import { NextResponse } from "next/server";
import { ApiResponse, Connection } from "@/lib/types";
import { getConnectionById, acceptConnection, declineConnection, deleteConnection, blockConnection } from '@/lib/data/users'

export async function GET(_req: Request, { params }: { params: { connection_id: string } }) {
    const { connection_id } = await params;
    if (!connection_id) {
        const response: ApiResponse<null> = {
            status: 400,
            success: false,
            message: "Connection ID is required",
            data: null,
        };
        return NextResponse.json(response, { status: 400 });
    }
    try {
        const connection = await getConnectionById(connection_id);
        const response: ApiResponse<Connection> = {
            status: 200,
            success: true,
            message: "Connection fetched successfully",
            data: connection,
        };
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error("Error fetching connection:", error);
        const response: ApiResponse<null> = {
            status: 500,
            success: false,
            message: "Failed to fetch connection",
            data: null,
        };
        return NextResponse.json(response, { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params: { connection_id: string } }) {
    try {
        const { connection_id } = await params;
        if (!connection_id) {
            const response: ApiResponse<null> = {
                status: 400,
                success: false,
                message: "Connection ID is required",
                data: null,
            };
            return NextResponse.json(response, { status: 400 });
        }
        const { action } = await req.json();
        if (!action) {
            const response: ApiResponse<null> = {
                status: 400,
                success: false,
                message: "Action is required",
                data: null,
            };
            return NextResponse.json(response, { status: 400 });
        }

        if (action === 'accept') {
            await acceptConnection(connection_id);
        } else if (action === 'decline') {
            await declineConnection(connection_id);
        } else if (action === 'delete') {
            await deleteConnection(connection_id);
        } else if (action === 'block') {
            await blockConnection(connection_id);
        } else {
            const response: ApiResponse<null> = {
                status: 400,
                success: false,
                message: "Invalid action",
                data: null,
            };
            return NextResponse.json(response, { status: 400 });
        }

        const response: ApiResponse<null> = {
            status: 200,
            success: true,
            message: `Connection ${action}ed successfully`,
            data: null,
        };
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error("Error updating connection:", error);
        const response: ApiResponse<null> = {
            status: 500,
            success: false,
            message: "Failed to update connection",
            data: null,
        };
        return NextResponse.json(response, { status: 500 });
    }
}