import { NextResponse } from "next/server";
import { updateUserUsername } from "@/lib/data/users";
import { ApiResponse } from "@/lib/types";

export async function PUT(req: Request) {
  try {
    const { user_id, username } = await req.json();
    await updateUserUsername(user_id, username);
    const response: ApiResponse<null> = {
      status: 200,
      success: true,
      message: "User username updated successfully",
      data: null,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error updating user username:", error);
    const response: ApiResponse<null> = {
      status: 404,
      success: false,
      message: "User not found",
      data: null,
    };
    return NextResponse.json(response, { status: 404 });
  }
}