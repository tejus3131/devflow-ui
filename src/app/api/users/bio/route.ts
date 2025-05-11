import { NextResponse } from "next/server";
import { updateUserBio } from "@/lib/data/users";
import { ApiResponse } from "@/lib/types";

export async function PUT(req: Request) {
  try {
    const { user_id, bio } = await req.json();
    await updateUserBio(user_id, bio);
    const response: ApiResponse<null> = {
      status: 200,
      success: true,
      message: "User bio updated successfully",
      data: null,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error updating user bio:", error);
    const response: ApiResponse<null> = {
      status: 404,
      success: false,
      message: "User not found",
      data: null,
    };
    return NextResponse.json(response, { status: 404 });
  }
}