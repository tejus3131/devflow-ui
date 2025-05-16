import supabase from "@/lib/db";
import { RepositoryDetail, Response } from "@/lib/types";

export const createRepository = async (
    name: string,
    description: string,
    tags: string[],
    userId: string,
): Response<RepositoryDetail> => {
    const { data, error } = await supabase.clientTable
        .from("repositories")
        .insert({
            name,
            description,
            tags,
            author_id: userId
        })
        .select("*")
        .single();
    if (error) return { status: 400, success: false, message: error.message, data: null };

    return {
        status: 200,
        success: true,
        message: "Repository created successfully",
        data: {
            id: data.id,
            name,
            description,
            type: "Repository",
            author_id: userId,
            tags,
        }
    }
}

export const getRepositoryById = async (id: string): Response<RepositoryDetail> => {
    const { data, error } = await supabase.clientTable
        .from("repositories")
        .select("*")
        .eq("id", id)
        .single();
    if (error) return { status: 400, success: false, message: error.message, data: null };
    return {
        status: 200,
        success: true,
        message: "Repository fetched successfully",
        data: {
            id: data.id,
            name: data.name,
            description: data.description,
            type: "Repository",
            author_id: data.author_id,
            tags: data.tags
        }
    }
}


export const getRepositoriesByUserId = async (userId: string): Response<RepositoryDetail[]> => {
    const { data, error } = await supabase.clientTable
        .from("repositories")
        .select("*")
        .eq("author_id", userId);
    if (error) return { status: 400, success: false, message: error.message, data: null };
    const repositories = data.map((repo) => {
        return {
            id: repo.id,
            name: repo.name,
            description: repo.description,
            type: "Repository",
            author_id: repo.author_id,
            tags: repo.tags
        }
    });
    return {
        status: 200,
        success: true,
        message: "Repositories fetched successfully",
        data: repositories
    };
}

export const getRepositoriesCountByUserId = async (userId: string): Response<number> => {
    const { data, error } = await supabase.clientTable
        .from("repositories")
        .select("*", { count: "exact" })
        .eq("author_id", userId);
    if (error) return { status: 400, success: false, message: error.message, data: null };
    return {
        status: 200,
        success: true,
        message: "Repositories count fetched successfully",
        data: data.length
    };
}

export const deleteRepositoryById = async (id: string): Response<null> => {
    const { error } = await supabase.clientTable
        .from("repositories")
        .delete()
        .eq("id", id);
    if (error) return { status: 400, success: false, message: error.message, data: null };
    return { status: 200, success: true, message: "Repository deleted successfully", data: null };
}

export const updateRepositoryName = async (
    id: string,
    newName: string,
): Response<null> => {
    const { error } = await supabase.clientTable
        .from("repositories")
        .update({
            name: newName,
            updated_at: new Date(),
        })
        .eq("id", id);
    if (error) return { status: 400, success: false, message: error.message, data: null };
    return { status: 200, success: true, message: "Repository name updated successfully", data: null };
}
export const updateRepositoryDescription = async (
    id: string,
    newDescription: string,
): Response<null> => {
    const { error } = await supabase.clientTable
        .from("repositories")
        .update({
            description: newDescription,
            updated_at: new Date(),
        })
        .eq("id", id);
    if (error) return { status: 400, success: false, message: error.message, data: null };
    return { status: 200, success: true, message: "Repository description updated successfully", data: null };
}
export const updateRepositoryTags = async (
    id: string,
    newTag: string,
    action: "add" | "remove",
): Response<null> => {
    const { data, error } = await supabase.clientTable
        .from("repositories")
        .select("tags")
        .eq("id", id)
        .single();
    if (error) return { status: 400, success: false, message: error.message, data: null };
    let updatedTags: string[];
    if (action === "add") {
        updatedTags = [...data.tags, newTag];
    } else {
        updatedTags = data.tags.filter((tag: string) => tag !== newTag);
    }
    const { error: updateError } = await supabase.clientTable
        .from("repositories")
        .update({
            tags: updatedTags,
            updated_at: new Date(),
        })
        .eq("id", id);
    if (updateError) return { status: 400, success: false, message: updateError.message, data: null };
    return { status: 200, success: true, message: "Repository tags updated successfully", data: null };
}

