import { NextResponse } from "next/server";
import { ApiResponse, RepositoryDetail } from "@/lib/types";
import { getRepositoryById, deleteRepositoryById, updateRepositoryDescription, updateRepositoryName, updateRepositoryTags } from '@/lib/data/repositories'

export async function GET(req: Request, { params }: { params: { repository_id: string } }) {
    try {
        const { repository_id } = params;
        if (!repository_id) {
            const response: ApiResponse<null> = {
                status: 400,
                success: false,
                message: "Repository ID is required",
                data: null,
            };
            return NextResponse.json(response, { status: 400 });
        }
        const repository = await getRepositoryById(repository_id);
        const response: ApiResponse<RepositoryDetail> = {
            status: 200,
            success: true,
            message: "Repository fetched successfully",
            data: repository,
        };
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error("Error fetching repository:", error);
        const response: ApiResponse<null> = {
            status: 500,
            success: false,
            message: "Failed to fetch repository",
            data: null,
        };
        return NextResponse.json(response, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { repository_id: string } }) {
    try {
        const { repository_id } = params;
        if (!repository_id) {
            const response: ApiResponse<null> = {
                status: 400,
                success: false,
                message: "Repository ID is required",
                data: null,
            };
            return NextResponse.json(response, { status: 400 });
        }
        await deleteRepositoryById(repository_id);
        const response: ApiResponse<null> = {
            status: 200,
            success: true,
            message: "Repository deleted successfully",
            data: null,
        };
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error("Error deleting repository:", error);
        const response: ApiResponse<null> = {
            status: 500,
            success: false,
            message: "Failed to delete repository",
            data: null,
        };
        return NextResponse.json(response, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: { repository_id: string } }) {
    try {
        const { repository_id } = params;
        if (!repository_id) {
            const response: ApiResponse<null> = {
                status: 400,
                success: false,
                message: "Repository ID is required",
                data: null,
            };
            return NextResponse.json(response, { status: 400 });
        }
        const { name, description, tags, action } = await req.json();
        if (name) {
            await updateRepositoryName(repository_id, name);
        }
        if (description) {
            await updateRepositoryDescription(repository_id, description);
        }
        if (tags) {
            if (!action) {
                const response: ApiResponse<null> = {
                    status: 400,
                    success: false,
                    message: "Action is required for updating tags",
                    data: null,
                };
                return NextResponse.json(response, { status: 400 });
            }
            if (action !== "add" && action !== "remove") {
                const response: ApiResponse<null> = {
                    status: 400,
                    success: false,
                    message: "Invalid action. Use 'add' or 'remove'",
                    data: null,
                };
                return NextResponse.json(response, { status: 400 });
            }
            await updateRepositoryTags(repository_id, tags, action);
        }
        const response: ApiResponse<null> = {
            status: 200,
            success: true,
            message: "Repository updated successfully",
            data: null,
        };
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error("Error updating repository:", error);
        const response: ApiResponse<null> = {
            status: 500,
            success: false,
            message: "Failed to update repository",
            data: null,
        };
        return NextResponse.json(response, { status: 500 });
    }
}