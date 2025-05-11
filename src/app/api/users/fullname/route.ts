import { NextResponse } from "next/server";
import { updateUserFullName } from "@/lib/data/users";
import { ApiResponse } from "@/lib/types";

export async function PUT(req: Request) {
  try {
    const { user_id, full_name } = await req.json();
    await updateUserFullName(user_id, full_name);
    const response: ApiResponse<null> = {
      status: 200,
      success: true,
      message: "User full name updated successfully",
      data: null,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error updating user full name:", error);
    const response: ApiResponse<null> = {
      status: 404,
      success: false,
      message: "User not found",
      data: null,
    };
    return NextResponse.json(response, { status: 404 });
  }
}