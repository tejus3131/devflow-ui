import { NextResponse } from "next/server";
import { ApiResponse } from "@/lib/types";
import { resendOtp } from "@/lib/email/manager";

export async function POST(req: Request) {
  try {
    const { otp_id } = await req.json();
    const new_otp_id = await resendOtp(otp_id);
    const response: ApiResponse<string> = {
      status: 200,
      success: true,
      message: "OTP sent successfully",
      data: new_otp_id,
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