import { NextResponse } from "next/server";
import { ApiResponse, Vote, VoteType } from "@/lib/types";
import { getVotesByRepoId, getVoteByRepoIdAndUserId, upvoteRepository, downvoteRepository, removeVoteFromRepository } from "@/lib/data/votes";

export async function GET(req: Request, { params }: { params: { repository_id: string } }) {
    try {
        const { repository_id } = await params;
        if (!repository_id) {
            const response: ApiResponse<null> = {
                status: 400,
                success: false,
                message: "Repository ID is required",
                data: null,
            };
            return NextResponse.json(response, { status: 400 });
        }
        const { searchParams } = new URL(req.url);
        const user_id = searchParams.get("user_id");
        if (user_id) {
            const votes = await getVoteByRepoIdAndUserId(repository_id, user_id);

            const response: ApiResponse<VoteType> = {
                status: 200,
                success: true,
                message: "Vote fetched successfully",
                data: votes ? votes.vote : null,
            };
            return NextResponse.json(response, { status: 200 });
        }
        const votes = await getVotesByRepoId(repository_id);
        const response: ApiResponse<Vote[]> = {
            status: 200,
            success: true,
            message: "Votes fetched successfully",
            data: votes,
        };
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error("Error fetching votes:", error);
        const response: ApiResponse<null> = {
            status: 500,
            success: false,
            message: "Failed to fetch votes",
            data: null,
        };
        return NextResponse.json(response, { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params: { repository_id: string } }) {
    try {
        const { repository_id } = await params;
        if (!repository_id) {
            const response: ApiResponse<null> = {
                status: 400,
                success: false,
                message: "Repository ID is required",
                data: null,
            };
            return NextResponse.json(response, { status: 400 });
        }
        const { user_id, vote_type } = await req.json();
        let vote;
        if (vote_type === "upvote") {
            vote = await upvoteRepository(repository_id, user_id);
        } else if (vote_type === "downvote") {
            vote = await downvoteRepository(repository_id, user_id);
        } else if (vote_type === null) {
            vote = await removeVoteFromRepository(repository_id, user_id);
        } else {
            const response: ApiResponse<null> = {
                status: 400,
                success: false,
                message: "Invalid vote type",
                data: null,
            };
            return NextResponse.json(response, { status: 400 });
        }
        const response: ApiResponse<Vote | null> = {
            status: 200,
            success: true,
            message: "Vote added successfully",
            data: vote,
        };
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error("Error adding vote:", error);
        const response: ApiResponse<null> = {
            status: 500,
            success: false,
            message: "Failed to add vote",
            data: null,
        };
        return NextResponse.json(response, { status: 500 });
    }
}