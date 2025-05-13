import { NextResponse } from "next/server";
import { deleteUserById, getUserById, getUserByUsername } from "@/lib/data/users";
import { ApiResponse, UserDetail } from "@/lib/types";
import { AuthError } from "@supabase/supabase-js";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const user_id = searchParams.get("user_id");
        if (!user_id) {
            const response: ApiResponse<null> = {
                status: 400,
                success: false,
                message: "User ID is required",
                data: null,
            };
            return NextResponse.json(response, { status: 400 });
        }
        const user = await getUserById(user_id);
        const response: ApiResponse<UserDetail> = {
            status: 200,
            success: true,
            message: "User fetched successfully",
            data: user,
        };
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error("Error fetching user:", error);
        const response: ApiResponse<null> = {
            status: 404,
            success: false,
            message: "User not found",
            data: null,
        };
        return NextResponse.json(response, { status: 404 });
    }
}
export async function DELETE(req: Request) {
    try {
        const { user_id } = await req.json();
        if (!user_id) {
            const response: ApiResponse<null> = {
                status: 400,
                success: false,
                message: "User ID is required",
                data: null,
            };
            return NextResponse.json(response, { status: 400 });
        }
        await deleteUserById(user_id);
        const response: ApiResponse<null> = {
            status: 200,
            success: true,
            message: "User deleted successfully",
            data: null,
        };
        return NextResponse.json(response, { status: 200 });
    } catch (error: any) {
        console.error("Error deleting user:", error);
        const response: ApiResponse<null> = {
            status: 400,
            success: false,
            message: error instanceof AuthError ? error.message : "Failed to delete user",
            data: null,
        };
        return NextResponse.json(response, { status: 400 });
    }
}

export async function POST(req: Request) {
    try {
        const { user_name } = await req.json();
        if (!user_name) {
            const response: ApiResponse<null> = {
                status: 400,
                success: false,
                message: "Username is required",
                data: null,
            };
            return NextResponse.json(response, { status: 400 });
        }
        const user = await getUserByUsername(user_name);
        const response: ApiResponse<UserDetail> = {
            status: 200,
            success: true,
            message: "User fetched successfully",
            data: user,
        };
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error("Error fetching user:", error);
        const response: ApiResponse<null> = {
            status: 404,
            success: false,
            message: "User not found",
            data: null,
        };
        return NextResponse.json(response, { status: 404 });
    }
}
