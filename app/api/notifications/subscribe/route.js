import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Subscription from "@/lib/models/subscription";

// POST /api/notifications/subscribe → save a subscription
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { endpoint, keys } = body;

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return NextResponse.json(
        { error: "Invalid subscription object" },
        { status: 400 },
      );
    }

    const userAgent = req.headers.get("user-agent") || null;

    // Upsert: update if exists, insert if new
    const subscription = await Subscription.findOneAndUpdate(
      { endpoint },
      { endpoint, keys, userAgent },
      { upsert: true, new: true, runValidators: true },
    );

    return NextResponse.json(
      { message: "Subscribed successfully", id: subscription._id },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /notifications/subscribe error:", error);
    return NextResponse.json(
      { error: "Failed to save subscription", details: error.message },
      { status: 500 },
    );
  }
}

// DELETE /api/notifications/subscribe → remove a subscription
export async function DELETE(req) {
  try {
    await connectDB();

    const { endpoint } = await req.json();

    if (!endpoint) {
      return NextResponse.json(
        { error: "Endpoint is required" },
        { status: 400 },
      );
    }

    await Subscription.deleteOne({ endpoint });

    return NextResponse.json(
      { message: "Unsubscribed successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE /notifications/subscribe error:", error);
    return NextResponse.json(
      { error: "Failed to remove subscription", details: error.message },
      { status: 500 },
    );
  }
}
