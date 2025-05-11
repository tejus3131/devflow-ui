import supabase from "@/lib/db";
import { UserDetail } from "@/lib/types";

async function getUserIdByUsername(username: string): Promise<string> {
    const { data, error } = await supabase.clientTable.from("user_id_username_mappings").select("user_id").eq("username", username).single();

    if (error) {
        console.error("Error fetching user ID:", error);
        throw new Error("Failed to fetch user ID");
    }
    if (!data) {
        console.error("User not found");
        throw new Error("User not found");
    }
    const { user_id } = data;
    if (!user_id) {
        console.error("User ID not found");
        throw new Error("User ID not found");
    }
    return user_id;
}

export async function getUserByUsername(username: string): Promise<UserDetail> {
    const user_id = await getUserIdByUsername(username);
    const { data, error } = await supabase.serverAuth.getUserById(user_id);

    if (error) {
        console.error("Error fetching user:", error);
        throw new Error("User not found");
    }
    if (!data) {
        console.error("User not found");
        throw new Error("User not found");
    }
    const { user } = data;
    if (!user) {
        console.error("User not found");
        throw new Error("User not found");
    }
    const { user_metadata } = user;
    if (!user_metadata) {
        console.error("User metadata not found");
        throw new Error("User metadata not found");
    }

    const formattedData: UserDetail = {
        id: user.id,
        email: user.email || "",
        avatar_url: user_metadata.avatar_url || "",
        full_name: user_metadata.full_name || "",
        user_name: user_metadata.user_name || "",
        bio: user_metadata.bio || "",
    };

    return formattedData;
}

export async function updateUserEmail(user_id: string, email: string): Promise<void> {
    const { data, error } = await supabase.serverAuth.updateUserById(user_id, { email });

    if (error) {
        console.error("Error updating user email:", error);
        throw new Error("Failed to update email");
    }
    if (!data) {
        console.error("User not found");
        throw new Error("User not found");
    }
}

async function uploadAvatar(user_id: string, file: File): Promise<string> {
    const { error } = await supabase.clientStorage
        .from("custom-avatars")
        .upload(user_id, file, {
            cacheControl: "3600",
            upsert: true,
        });

    if (error) {
        console.error("Error uploading avatar:", error);
        throw new Error("Failed to upload avatar");
    }

    const { data } = supabase
        .clientStorage
        .from("custom-avatars")
        .getPublicUrl(user_id);

    if (!data) {
        console.error("Error getting public URL for avatar");
        throw new Error("Failed to get public URL for avatar");
    }
    if (!data.publicUrl) {
        console.error("Public URL not found");
        throw new Error("Public URL not found");
    }

    return data.publicUrl;
}

export async function updateUserAvatar(user_id: string, file: File): Promise<void> {

    const avatarUrl = await uploadAvatar(user_id, file);

    const { error } = await supabase.serverAuth.updateUserById(user_id, {
        user_metadata: {
            avatar_url: avatarUrl,
        },
    });
    if (error) {
        console.error("Error updating user avatar:", error);
        throw new Error("Failed to update avatar");
    }
}

export async function updateUserBio(user_id: string, bio: string): Promise<void> {
    const { error } = await supabase.serverAuth.updateUserById(user_id, {
        user_metadata: {
            bio
        },
    });
    if (error) {
        console.error("Error updating user bio:", error);
        throw new Error("Failed to update bio");
    }
}

export async function updateUserUsername(user_id: string, username: string): Promise<void> {
    const { error } = await supabase.serverAuth.updateUserById(user_id, {
        user_metadata: {
            user_name: username
        },
    });
    if (error) {
        console.error("Error updating user username:", error);
        throw new Error("Failed to update user username");
    }

    const { error: mappingError } = await supabase.clientTable
        .from("user_id_username_mappings")
        .update({ username, updated_at: new Date() })
        .eq("user_id", user_id);
    if (mappingError) {
        console.error("Error updating user ID username mapping:", mappingError);
        throw new Error("Failed to update user ID username mapping");
    }
}

export async function updateUserFullName(user_id: string, full_name: string): Promise<void> {
    const { error } = await supabase.serverAuth.updateUserById(user_id, {
        user_metadata: {
            full_name
        },
    });
    if (error) {
        console.error("Error updating user full name:", error);
        throw new Error("Failed to update full name");
    }
}

// type ItemType = "repository" | "component" | "thought" | "blog";

// async function getCurrentFavorites(): Promise<string[]> {
//     const { data, error } = await supabase.client.auth.getUser();
//     if (error) {
//         console.error("Error fetching user:", error);
//         return [];
//     }
//     if (!data.user) {
//         console.error("User not found");
//         return [];
//     }
//     const { user_metadata } = data.user;
//     if (!user_metadata) {
//         console.error("User metadata not found");
//         return [];
//     }
//     const { favorites } = user_metadata;
//     if (!favorites) {
//         console.error("Favorites not found");
//         return [];
//     }
//     return favorites;
// }

// export async function updateUserFavorites(item_id: string, item_type: ItemType, action: "add" | "remove"): Promise<ApiResponse<null>> {
//     const currentFavorites = await getCurrentFavorites();
//     if (!currentFavorites) {
//         return {
//             data: null,
//             status: 404,
//             success: false,
//             message: "User not found",
//         };
//     }
//     if (action === "add" && currentFavorites.includes(item_id)) {
//         return {
//             data: null,
//             status: 400,
//             success: false,
//             message: "Item already in favorites",
//         };
//     }
//     if (action === "remove" && !currentFavorites.includes(item_id)) {
//         return {
//             data: null,
//             status: 400,
//             success: false,
//             message: "Item not in favorites",
//         };
//     }
//     if (action === "add") {
//         currentFavorites.push(item_id);
//     } else {
//         const index = currentFavorites.indexOf(item_id);
//         if (index > -1) {
//             currentFavorites.splice(index, 1);
//         }
//     }

//     const { error } = await supabase.client.auth.updateUser({
//         data: {
//             favorites: currentFavorites
//         }
//     });

//     if (error) {
//         console.error("Error updating user favorites:", error);
//         return {
//             data: null,
//             status: 400,
//             success: false,
//             message: "Failed to update favorites",
//         };
//     }

//     return { data: null, status: 200, success: true, message: "Favorites updated successfully" };
// }

// export async function updateUserBadges(user_id: string, badge_id: string, action: "add" | "remove"): Promise<ApiResponse<null>> {

//     const { data, success, message, status } = await getUserByUsername(user_id);



//     return { data: null, status: 200, success: true, message: "Badges updated successfully" };
// }

export async function deleteUserById(user_id: string): Promise<void> {
    const { error } = await supabase.serverAuth.deleteUser(user_id);

    if (error) {
        console.error("Error deleting user:", error);
        throw new Error("Failed to delete user");
    }
}