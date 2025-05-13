import { NextResponse } from "next/server";
import { ApiResponse, RepositoryDetail } from "@/lib/types";
import { createRepository, getRepositoriesByUserId } from '@/lib/data/repositories'
import { getUserByUsername } from "@/lib/data/users";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const username = searchParams.get("username");
        const count = searchParams.get("count");
        if (!username) {
            const response: ApiResponse<null> = {
                status: 400,
                success: false,
                message: "Username is required",
                data: null,
            };
            return NextResponse.json(response, { status: 400 });
        }
        const user = await getUserByUsername(username);
        const repositories = await getRepositoriesByUserId(user.id);
        if (count && count === "true") {
            const countNumber = repositories.length;
            const response: ApiResponse<number> = {
                status: 200,
                success: true,
                message: "Repository count fetched successfully",
                data: countNumber,
            };
            return NextResponse.json(response, { status: 200 });
        }
        const response: ApiResponse<RepositoryDetail[]> = {
            status: 200,
            success: true,
            message: "Repositories fetched successfully",
            data: repositories,
        };
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error("Error fetching repositories:", error);
        const response: ApiResponse<null> = {
            status: 500,
            success: false,
            message: "Failed to fetch repositories",
            data: null,
        };
        return NextResponse.json(response, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { user_id, name, description, tags } = await req.json();
        const repository = await createRepository(name, description, tags, user_id);
        const response: ApiResponse<RepositoryDetail> = {
            status: 200,
            success: true,
            message: "Repository created successfully",
            data: repository,
        };
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error("Error creating repository:", error);
        const response: ApiResponse<null> = {
            status: 500,
            success: false,
            message: "Failed to create repository",
            data: null,
        };
        return NextResponse.json(response, { status: 500 });
    }
}