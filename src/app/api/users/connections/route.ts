import { NextResponse } from "next/server";
import { ApiResponse, Connection, Connections } from "@/lib/types";
import { getUserConnectionCount, getUserConnections, initiateConnection } from '@/lib/data/users'

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const user_id = url.searchParams.get('user_id');
        const count = url.searchParams.get('count');
        
        if (!user_id) {
            const response: ApiResponse<null> = {
                status: 400,
                success: false,
                message: "User ID is required",
                data: null,
            };
            return NextResponse.json(response, { status: 400 });
        }

        if (count && count === "true") {
            const connectionsCount = await getUserConnectionCount(user_id);
            const response: ApiResponse<number> = {
                status: 200,
                success: true,
                message: "Connections count fetched successfully",
                data: connectionsCount,
            };
            return NextResponse.json(response, { status: 200 });
        }

        const connections = await getUserConnections(user_id);
        const response: ApiResponse<Connections> = {
            status: 200,
            success: true,
            message: "Connections fetched successfully",
            data: connections,
        };
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error("Error fetching connections:", error);
        const response: ApiResponse<null> = {
            status: 500,
            success: false,
            message: "Failed to fetch connections",
            data: null,
        };
        return NextResponse.json(response, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { initiator_id, target_id } = await req.json();
        if (!initiator_id || !target_id) {
            const response: ApiResponse<null> = {
                status: 400,
                success: false,
                message: "Initiator ID and Target ID are required",
                data: null,
            };
            return NextResponse.json(response, { status: 400 });
        }
        const connection = await initiateConnection(initiator_id, target_id);
        const response: ApiResponse<Connection> = {
            status: 200,
            success: true,
            message: "Connections fetched successfully",
            data: connection,
        };
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error("Error fetching connections:", error);
        const response: ApiResponse<null> = {
            status: 500,
            success: false,
            message: "Failed to fetch connections",
            data: null,
        };
        return NextResponse.json(response, { status: 500 });
    }
}