import supabase from "@/lib/db";
import { Response, Vote, VoteType } from "@/lib/types";

export const getVotesByRepoId = async (repoId: string): Response<Vote[]> => {
    const { data, error } = await supabase.clientTable
        .from("votes")
        .select("*")
        .eq("repo_id", repoId);
    if (error) return { status: 400, success: false, message: error.message, data: null };
    return { status: 200, success: true, message: "Votes fetched successfully", data: data as Vote[] };
}

export const upvoteRepository = async (repoId: string, userId: string): Response<Vote> => {

    const response = await getVoteByRepoIdAndUserId(repoId, userId);
    if (!response.success) {
        return { status: 400, success: false, message: response.message, data: null };
    }
    if (response.data) {
        if (response.data!.vote === "upvote") {
            return { status: 200, success: true, message: "Vote fetched successfully", data: response.data };
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
    if (error) return { status: 400, success: false, message: error.message, data: null };
    return { status: 200, success: true, message: "Vote added successfully", data: data as Vote };
}

export const downvoteRepository = async (repoId: string, userId: string): Response<Vote> => {
    const response = await getVoteByRepoIdAndUserId(repoId, userId);
    if (!response.success) {
        return { status: 400, success: false, message: response.message, data: null };
    }
    if (response.data) {
        if (response.data!.vote === "downvote") {
            return { status: 200, success: true, message: "Vote fetched successfully", data: response.data };
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

    if (error) return { status: 400, success: false, message: error.message, data: null };
    return { status: 200, success: true, message: "Vote added successfully", data: data as Vote };
}

export const removeVoteFromRepository = async (repoId: string, userId: string): Response<null> => {
    const { error } = await supabase.clientTable
        .from("votes")
        .delete()
        .eq("repo_id", repoId)
        .eq("user_id", userId);

    if (error) return { status: 400, success: false, message: error.message, data: null };
    return { status: 200, success: true, message: "Vote removed successfully", data: null };
}

export const getVoteByRepoIdAndUserId = async (blogTitle: string, userId: string): Response<Vote | null> => {
    const { data, error } = await supabase.clientTable
        .from("votes")
        .select("*")
        .eq("repo_id", blogTitle)
        .eq("user_id", userId)
        .maybeSingle();
    if (error) return { status: 400, success: false, message: error.message, data: null };
    if (!data) return { status: 200, success: true, message: "Vote not found", data: null };
    return { status: 200, success: true, message: "Vote fetched successfully", data: data as Vote };
}

export const getVotesByBlogTitle = async (blogTitle: string): Response<Vote[]> => {
    const { data, error } = await supabase.clientTable
        .from("votes")
        .select("*")
        .eq("blog_id", blogTitle);
    if (error) return { status: 400, success: false, message: error.message, data: null };
    return { status: 200, success: true, message: "Votes fetched successfully", data: data as Vote[] };
}

export const upvoteBlog = async (blogTitle: string, userId: string): Response<Vote> => {

    const response = await getVoteByBlogTitleAndUserId(blogTitle, userId);
    console.log("Response from getVoteByBlogTitleAndUserId:", response);
    if (!response.success) {
        return { status: 400, success: false, message: response.message, data: null };
    }
    if (response.data) {
        if (response.data!.vote === "upvote") {
            return { status: 200, success: true, message: "Vote fetched successfully", data: response.data };
        } else {
            await removeVoteFromBlog(blogTitle, userId);
        }
    }
    const { data, error } = await supabase.clientTable
        .from("votes")
        .insert({
            blog_id: blogTitle,
            user_id: userId,
            vote: "upvote"
        })
        .select("*")
        .single();
    console.log("Data from insert:", data);
    if (error) return { status: 400, success: false, message: error.message, data: null };
    return { status: 200, success: true, message: "Vote added successfully", data: data as Vote };
}

export const downvoteBlog = async (blogTitle: string, userId: string): Response<Vote> => {
    const response = await getVoteByRepoIdAndUserId(blogTitle, userId);
    if (!response.success) {
        return { status: 400, success: false, message: response.message, data: null };
    }
    if (response.data) {
        if (response.data!.vote === "downvote") {
            return { status: 200, success: true, message: "Vote fetched successfully", data: response.data };
        } else {
            await removeVoteFromBlog(blogTitle, userId);
        }
    }
    const { data, error } = await supabase.clientTable
        .from("votes")
        .insert({
            blog_id: blogTitle,
            user_id: userId,
            vote: "downvote"
        })
        .select("*")
        .single();

    if (error) return { status: 400, success: false, message: error.message, data: null };
    return { status: 200, success: true, message: "Vote added successfully", data: data as Vote };
}

export const removeVoteFromBlog = async (blogTitle: string, userId: string): Response<null> => {
    const { error } = await supabase.clientTable
        .from("votes")
        .delete()
        .eq("blog_id", blogTitle)
        .eq("user_id", userId);

    if (error) return { status: 400, success: false, message: error.message, data: null };
    return { status: 200, success: true, message: "Vote removed successfully", data: null };
}

export const getVoteByBlogTitleAndUserId = async (blogTitle: string, userId: string): Response<Vote | null> => {
    const { data, error } = await supabase.clientTable
        .from("votes")
        .select("*")
        .eq("blog_id", blogTitle)
        .eq("user_id", userId)
        .maybeSingle();
    if (error) return { status: 400, success: false, message: error.message, data: null };
    if (!data) return { status: 200, success: true, message: "Vote not found", data: null };
    return { status: 200, success: true, message: "Vote fetched successfully", data: data as Vote };
}