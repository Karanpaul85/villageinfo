import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Village from "../../../lib/models/village";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const state_slug = searchParams.get("state_slug");
    const district_slug = searchParams.get("district_slug");
    const block_slug = searchParams.get("block_slug");
    const village_slug = searchParams.get("village_slug");

    console.log("GET /villages called with params:", {
      state_slug,
      district_slug,
      block_slug,
      village_slug,
    });

    // Case 1: All 4 slugs provided → return single village details
    if (state_slug && district_slug && block_slug && village_slug) {
      const village = await Village.findOne({
        state_slug,
        district_slug,
        block_slug,
        village_slug,
      }).lean();

      if (!village) {
        return NextResponse.json(
          { error: "Village not found" },
          { status: 404 },
        );
      }

      return NextResponse.json(village, { status: 200 });
    }

    // Case 2: state + district + block provided → return all villages for that block
    if (state_slug && district_slug && block_slug) {
      const villages = await Village.find({
        state_slug,
        district_slug,
        block_slug,
      })
        .sort({ village_name: 1 })
        .select("village_name village_slug total_population nearest_town")
        .lean();

      return NextResponse.json({ allVillages: villages }, { status: 200 });
    }

    // No params or incomplete → error
    return NextResponse.json(
      {
        error:
          "state_slug, district_slug and block_slug parameters are required",
      },
      { status: 400 },
    );
  } catch (error) {
    console.error("GET /villages error:", error);
    return NextResponse.json(
      { error: "Failed to fetch villages", details: error.message },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: "Request body is empty or invalid" },
        { status: 400 },
      );
    }
    // ✅ Convert empty values to null
    Object.keys(body).forEach((key) => {
      const value = body[key];

      // Only set to null if it's ACTUALLY empty, not if it's a valid number
      if (value === null || value === undefined || value === "") {
        body[key] = null;
      }
      // Don't touch numbers, even if they're 0
    });

    const village = await Village.findOneAndUpdate(
      { village_id: body.village_id },
      body, // Direct update without $set works when upsert is true
      {
        returnDocument: "after", // Return updated doc
        upsert: true, // Create if not exists
        runValidators: true, // Validate
        overwrite: false, // Don't replace entire doc, just update fields
      },
    );

    return NextResponse.json(village, { status: 201 });
  } catch (error) {
    console.error("POST /villages error:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return NextResponse.json(
        { error: "Validation failed", details: messages },
        { status: 422 },
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Duplicate entry", details: error.keyValue },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Failed to create village", details: error.message },
      { status: 500 },
    );
  }
}
