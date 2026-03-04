import { NextRequest, NextResponse } from "next/server";
import { otpService } from "@/lib/otp";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // ==========================
    // Get Client IP (Safe for Vercel + Local)
    // ==========================

    const forwardedFor = request.headers.get("x-forwarded-for");

    let ip =
      forwardedFor?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    if (!ip || ip === "unknown") {
      ip = "127.0.0.1";
    }

    // ==========================
    // Rate Limit
    // ==========================

    const rateLimit = await checkRateLimit(
      ip,
      "auth/send-otp",
      10, // max 10 request
      60 * 1000 // 1 minute
    );

    if (!rateLimit.allowed) {
      const retryAfter = Math.ceil(
        (rateLimit.resetAt.getTime() - Date.now()) / 1000
      );

      return NextResponse.json(
        {
          success: false,
          error: "Too many OTP requests. Please wait before trying again."
        },
        {
          status: 429,
          headers: {
            "Retry-After": retryAfter.toString()
          }
        }
      );
    }

    // ==========================
    // Parse Request Body
    // ==========================

    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    const email = body.email?.toLowerCase()?.trim();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // ==========================
    // Validate Email
    // ==========================

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // ==========================
    // Send OTP
    // ==========================

    const result = await otpService.sendOTP(email);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.message
        },
        { status: 400 }
      );
    }

    // ==========================
    // Success
    // ==========================

    return NextResponse.json({
      success: true,
      message: result.message
    });

  } catch (error) {
    console.error("OTP send error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error"
      },
      { status: 500 }
    );
  }
}