import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import State from "@/lib/models/State";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const hasParams = searchParams.toString().length > 0;

    if (hasParams) {
      // Build filter from query parameters
      const filter = {};
      searchParams.forEach((value, key) => {
        filter[key] = value;
      });

      const state = await State.findOne(filter).lean();

      if (!state) {
        return NextResponse.json({ error: "State not found" }, { status: 404 });
      }

      return NextResponse.json(state, { status: 200 });
    } else {
      // No params: return array with only state and state_slug
      const states = await State.find()
        .sort({ name: 1 })
        .select("state state_slug")
        .lean();

      return NextResponse.json({ allStates: states }, { status: 200 });
    }
  } catch (error) {
    console.error("GET /states error:", error);
    return NextResponse.json(
      { error: "Failed to fetch states", details: error.message },
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

    const state = await State.create(body);

    return NextResponse.json(state, { status: 201 });
  } catch (error) {
    console.error("POST /states error:", error);

    // Mongoose validation error (schema fields missing/invalid)
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return NextResponse.json(
        { error: "Validation failed", details: messages },
        { status: 422 },
      );
    }

    // MongoDB duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Duplicate entry", details: error.keyValue },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Failed to create state", details: error.message },
      { status: 500 },
    );
  }
}
