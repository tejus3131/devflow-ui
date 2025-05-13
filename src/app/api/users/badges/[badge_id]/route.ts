import { NextResponse } from "next/server";
import { ApiResponse, BadgeDetail } from "@/lib/types";
import { getBadgeById } from '@/lib/data/users'

export async function GET(_req: Request, { params }: { params: { badge_id: string } }) {
    const { badge_id } = await params;
    if (!badge_id) {
        const response: ApiResponse<null> = {
            status: 400,
            success: false,
            message: "Badge ID is required",
            data: null,
        };
        return NextResponse.json(response, { status: 400 });
    }
    try {
        const badge = await getBadgeById(badge_id);
        const response: ApiResponse<BadgeDetail> = {
            status: 200,
            success: true,
            message: "Badge fetched successfully",
            data: badge,
        };
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error("Error fetching badge:", error);
        const response: ApiResponse<null> = {
            status: 500,
            success: false,
            message: "Failed to fetch badge",
            data: null,
        };
        return NextResponse.json(response, { status: 500 });
    }
}