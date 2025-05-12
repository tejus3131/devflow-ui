import { NextResponse } from "next/server";
import { ApiResponse } from "@/lib/types";
import { getUserBadges } from '@/lib/data/users'

export async function POST(req: Request) {
  try {
    const { user_id } = await req.json();
    const badges = await getUserBadges(user_id);
    const response: ApiResponse<typeof badges> = {
      status: 200,
      success: true,
      message: "Badges fetched successfully",
      data: badges,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching badges:", error);
    const response: ApiResponse<null> = {
      status: 500,
      success: false,
      message: "Failed to fetch badges",
      data: null,
    };
    return NextResponse.json(response, { status: 500 });
  }
}