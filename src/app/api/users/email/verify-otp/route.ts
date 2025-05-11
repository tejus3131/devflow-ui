import { NextResponse } from "next/server";
import { updateUserEmail } from "@/lib/data/users";
import { ApiResponse } from "@/lib/types";
import { verifyOtp } from "@/lib/email/manager"

export async function POST(req: Request) {
  try {
    const { email, user_id, otp } = await req.json();
    await verifyOtp(email, otp);
    await updateUserEmail(user_id, email);
    const response: ApiResponse<null> = {
      status: 200,
      success: true,
      message: "User email updated successfully",
      data: null,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error("Error updating user email:", error);
    const response: ApiResponse<null> = {
      status: 400,
      success: false,
      message: error.message || "Failed to update user email",
      data: null,
    };
    return NextResponse.json(response, { status: 400 });
  }
}