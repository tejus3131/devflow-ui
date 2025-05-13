import supabase from "@/lib/db";
import { Vote, VoteType } from "@/lib/types";

export const getVotesByRepoId = async (repoId: string): Promise<Vote[]> => {
    const { data, error } = await supabase.clientTable
        .from("votes")
        .select("*")
        .eq("repo_id", repoId);

    if (error) {
        console.error("Error fetching votes:", error);
        throw new Error("Failed to fetch votes");
    }

    return data as Vote[];
}

export const upvoteRepository = async (repoId: string, userId: string): Promise<Vote> => {

    const existingVote = await getVoteByRepoIdAndUserId(repoId, userId);
    if (existingVote) {
        if (existingVote.vote === "upvote") {
            return existingVote;
        } else {
            await removeVoteFromRepository(repoId, userId);
        }
    }

    const { data, error } = await supabase.clientTable
        .from("votes")
        .insert({
            repo_id: repoId,
            user_id: userId,
            vote: "upvote"
        })
        .select("*")
        .single();

    if (error) {
        console.error("Error upvoting repository:", error);
        throw new Error("Failed to upvote repository");
    }

    return data as Vote;
}

export const downvoteRepository = async (repoId: string, userId: string): Promise<Vote> => {
    const existingVote = await getVoteByRepoIdAndUserId(repoId, userId);
    if (existingVote) {
        if (existingVote.vote === "downvote") {
            return existingVote;
        } else {
            await removeVoteFromRepository(repoId, userId);
        }
    }
    const { data, error } = await supabase.clientTable
        .from("votes")
        .insert({
            repo_id: repoId,
            user_id: userId,
            vote: "downvote"
        })
        .select("*")
        .single();

    if (error) {
        console.error("Error downvoting repository:", error);
        throw new Error("Failed to downvote repository");
    }

    return data as Vote;
}

export const removeVoteFromRepository = async (repoId: string, userId: string): Promise<null> => {
    const { error } = await supabase.clientTable
        .from("votes")
        .delete()
        .eq("repo_id", repoId)
        .eq("user_id", userId);

    if (error) {
        console.error("Error removing vote:", error);
        throw new Error("Failed to remove vote");
    }
    return null;
}

export const getVoteByRepoIdAndUserId = async (repoId: string, userId: string): Promise<Vote | null> => {
    const { data, error } = await supabase.clientTable
        .from("votes")
        .select("*")
        .eq("repo_id", repoId)
        .eq("user_id", userId);

    if (error) {
        console.error("Error fetching vote:", error);
        throw new Error("Failed to fetch vote");
    }

    if (!data) {
        return null;
    }

    return data[0] as Vote;
}