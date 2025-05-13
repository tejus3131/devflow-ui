import { NextResponse } from "next/server";
import { ApiResponse, Connection } from "@/lib/types";
import { getConnectionByInitiatorAndTarget } from '@/lib/data/users'

export async function GET(_req: Request, { params }: { params: { connection_id: string, connection_id_2: string } }) {
    const { connection_id, connection_id_2 } = await params;
    if (!connection_id || !connection_id_2) {
        const response: ApiResponse<null> = {
            status: 400,
            success: false,
            message: "Target ID and Initiator ID are required",
            data: null,
        };
        return NextResponse.json(response, { status: 400 });
    }
    try {
        const connection = await getConnectionByInitiatorAndTarget(connection_id, connection_id_2);
        const response: ApiResponse<Connection | null> = {
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