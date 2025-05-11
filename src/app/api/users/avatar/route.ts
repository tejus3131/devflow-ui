import { NextResponse } from "next/server";
import { updateUserAvatar } from "@/lib/data/users";
import { ApiResponse } from "@/lib/types";

export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    const user_id = formData.get("user_id") as string;
    const file = formData.get("file") as File;

    if (!user_id || !file) {
      throw new Error("Invalid input");
    }

    await updateUserAvatar(user_id, file);

    const response: ApiResponse<null> = {
      status: 200,
      success: true,
      message: "User avatar updated successfully",
      data: null,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error updating user avatar:", error);
    const response: ApiResponse<null> = {
      status: 400,
      success: false,
      message: "Failed to update user avatar",
      data: null,
    };
    return NextResponse.json(response, { status: 400 });
  }
}