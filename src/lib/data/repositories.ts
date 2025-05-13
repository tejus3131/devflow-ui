import supabase from "@/lib/db";
import { RepositoryDetail } from "@/lib/types";

export const createRepository = async (
    name: string,
    description: string,
    tags: string[],
    userId: string,
): Promise<RepositoryDetail> => {
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

    if (error) {
        console.error("Error creating repository:", error);
        throw new Error("Failed to create repository");
    }

    return {
        id: data.id,
        name,
        description,
        type: "Repository",
        author_id: userId,
        tags,
    }
}

export const getRepositoryById = async (id: string): Promise<RepositoryDetail> => {
    const { data, error } = await supabase.clientTable
        .from("repositories")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching repository:", error);
        throw new Error("Failed to fetch repository");
    }

    return {
        id: data.id,
        name: data.name,
        description: data.description,
        type: "Repository",
        author_id: data.author_id,
        tags: data.tags
    }
}


export const getRepositoriesByUserId = async (userId: string): Promise<RepositoryDetail[]> => {
    const { data, error } = await supabase.clientTable
        .from("repositories")
        .select("*")
        .eq("author_id", userId);

    if (error) {
        console.error("Error fetching repositories:", error);
        throw new Error("Failed to fetch repositories");
    }

    const repositories = data.map((repo) => {
        return {
            id: repo.id,
            name: repo.name,
            description: repo.description,
            type: "Repository",
            author_id: repo.author_id,
            tags: repo.tags
        }
    })


    return repositories;
}

export const deleteRepositoryById = async (id: string): Promise<void> => {
    const { error } = await supabase.clientTable
        .from("repositories")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting repository:", error);
        throw new Error("Failed to delete repository");
    }
}

export const updateRepositoryName = async (
    id: string,
    newName: string,
): Promise<void> => {
    const { error } = await supabase.clientTable
        .from("repositories")
        .update({
            name: newName,
        })
        .eq("id", id);
    if (error) {
        console.error("Error updating repository name:", error);
        throw new Error("Failed to update repository name");
    }
}
export const updateRepositoryDescription = async (
    id: string,
    newDescription: string,
): Promise<void> => {
    const { error } = await supabase.clientTable
        .from("repositories")
        .update({
            description: newDescription,
        })
        .eq("id", id);
    if (error) {
        console.error("Error updating repository description:", error);
        throw new Error("Failed to update repository description");
    }
}
export const updateRepositoryTags = async (
    id: string,
    newTag: string,
    action: "add" | "remove",
): Promise<void> => {
    const { data, error } = await supabase.clientTable
        .from("repositories")
        .select("tags")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching repository tags:", error);
        throw new Error("Failed to fetch repository tags");
    }

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
        })
        .eq("id", id);

    if (updateError) {
        console.error("Error updating repository tags:", updateError);
        throw new Error("Failed to update repository tags");
    }
}

