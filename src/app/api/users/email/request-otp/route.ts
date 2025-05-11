import { NextResponse } from "next/server";
import { ApiResponse } from "@/lib/types";
import { requestOtp } from "@/lib/email/manager";

export async function PUT(req: Request) {
  try {
    const { email, full_name } = await req.json();
    await requestOtp(email, full_name);
    const response: ApiResponse<null> = {
      status: 200,
      success: true,
      message: "OTP sent successfully",
      data: null,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error sending OTP:", error);
    const response: ApiResponse<null> = {
      status: 500,
      success: false,
      message: "Failed to send OTP",
      data: null,
    };
    return NextResponse.json(response, { status: 500 });
  }
}