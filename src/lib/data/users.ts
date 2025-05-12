import supabase from "@/lib/db";
import { BadgeDetail, UserDetail } from "@/lib/types";

async function getUserIdByUsername(username: string): Promise<string> {
    const { data, error } = await supabase.clientTable.from("user_profile").select("id").eq("username", username).single();

    if (error) {
        console.error("Error fetching user ID:", error);
        throw new Error("Failed to fetch user ID");
    }
    if (!data) {
        console.error("User not found");
        throw new Error("User not found");
    }
    const { id } = data;
    if (!id) {
        console.error("User ID not found");
        throw new Error("User ID not found");
    }
    return id;
}

export async function getUserById(user_id: string): Promise<UserDetail> {
    const { data, error } = await supabase.clientTable.from("user_profile").select("*").eq("id", user_id).single();

    if (error) {
        console.error("Error fetching user:", error);
        throw new Error("User not found");
    }
    if (!data) {
        console.error("User not found");
        throw new Error("User not found");
    }

    const formattedData: UserDetail = {
        id: user_id,
        email: data.email,
        avatar_url: data.avatar_url,
        full_name: data.fullname,
        user_name: data.username,
        bio: data.bio,
    };

    return formattedData;
}

export async function getUserByUsername(username: string): Promise<UserDetail> {
    const user_id = await getUserIdByUsername(username);
    return await getUserById(user_id);
}

export async function updateUserEmail(user_id: string, email: string): Promise<void> {
    const { error } = await supabase.clientTable.from("user_profile").update({ email }).eq("id", user_id).single();
    if (error) {
        console.error("Error updating user email:", error);
        throw new Error("Failed to update email");
    }
}

async function uploadAvatar(file: File): Promise<string> {
    const randomId = Math.random().toString(36).substring(2, 15);
    const { error } = await supabase.clientStorage
        .from("custom-avatars")
        .upload(randomId, file, {
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
        .getPublicUrl(randomId);

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

export async function updateUserAvatar(user_id: string, file: File): Promise<string> {

    const avatarUrl = await uploadAvatar(file);

    const { error } = await supabase.clientTable.from("user_profile").update({ avatar_url: avatarUrl }).eq("id", user_id);
    if (error) {
        console.error("Error updating user avatar:", error);
        throw new Error("Failed to update avatar");
    }
    return avatarUrl;
}

export async function updateUserBio(user_id: string, bio: string): Promise<void> {
    const { error } = await supabase.clientTable.from("user_profile").update({ bio }).eq("id", user_id);
    if (error) {
        console.error("Error updating user bio:", error);
        throw new Error("Failed to update bio");
    }
}

export async function updateUserUsername(user_id: string, username: string): Promise<void> {
    const { error } = await supabase.clientTable.from("user_profile").update({ username }).eq("id", user_id);
    if (error) {
        console.error("Error updating user username:", error);
        throw new Error("Failed to update user username");
    }
}

export async function updateUserFullName(user_id: string, full_name: string): Promise<void> {
    const { error } = await supabase.clientTable.from("user_profile").update({ fullname: full_name }).eq("id", user_id);
    if (error) {
        console.error("Error updating user full name:", error);
        throw new Error("Failed to update full name");
    }
}

// export async function getAcceptedConnections(userId: string) {
//     const { data, error } = await supabase.clientTable
//         .from('connections')
//         .select('initiator, target')
//         .eq('status', 'accepted')
//         .or(`initiator.eq.${userId},target.eq.${userId}`);

//     if (error) throw error;

//     return data?.map(conn =>
//         conn.initiator === userId ? conn.target : conn.initiator
//     );
// }

// export async function getMutualConnections(userA: string, userB: string) {
//     const [aRes, bRes] = await Promise.all([
//         getAcceptedConnections(userA),
//         getAcceptedConnections(userB)
//     ]);

//     const mutualIds = aRes.filter(id => bRes.includes(id));

//     const { data, error } = await supabase.clientTable
//         .from('users')
//         .select('*')
//         .in('id', mutualIds);

//     if (error) throw error;

//     return data;
// }

// export async function getSentRequests(userId: string) {
//     const { data, error } = await supabase.clientTable
//         .from('connections')
//         .select('target')
//         .eq('initiator', userId)
//         .eq('status', 'requested');

//     if (error) throw error;
//     return data.map(d => d.target);
// }

// export async function getReceivedRequests(userId: string) {
//     const { data, error } = await supabase.clientTable
//         .from('connections')
//         .select('initiator')
//         .eq('target', userId)
//         .eq('status', 'requested');

//     if (error) throw error;
//     return data.map(d => d.initiator);
// }

// export async function getInvitableUsers(userId: string) {
//     const { data: allConnections, error } = await supabase.clientTable
//         .from('connections')
//         .select('initiator, target')
//         .or(`initiator.eq.${userId},target.eq.${userId}`);

//     if (error) throw error;

//     const relatedIds = new Set(
//         allConnections.map(conn =>
//             conn.initiator === userId ? conn.target : conn.initiator
//         )
//     );

//     const { data: users, error: userError } = await supabase.clientTable
//         .from('users')
//         .select('*')
//         .neq('id', userId)
//         .not('id', 'in', `(${[...relatedIds].join(',')})`);

//     if (userError) throw userError;

//     return users;
// }

// export async function getConnectionStatus(userA: string, userB: string) {
//     const { data, error } = await supabase.clientTable
//         .from('connections')
//         .select('*')
//         .or(
//             `and(initiator.eq.${userA},target.eq.${userB}),and(initiator.eq.${userB},target.eq.${userA})`
//         )
//         .maybeSingle();

//     if (error) throw error;
//     if (!data) return 'none';

//     if (data.status === 'accepted') return 'connected';
//     if (data.status === 'requested' && data.initiator === userA) return 'invitation_sent';
//     if (data.status === 'requested' && data.target === userA) return 'invitation_received';

//     return data.status; // e.g., 'declined' or 'blocked'
// }


// export async function sendConnectionRequest(initiatorId: string, targetId: string) {
//     const { error } = await supabase.clientTable
//         .from('connections')
//         .insert([
//             {
//                 initiator: initiatorId,
//                 target: targetId,
//                 status: 'requested'
//             }
//         ]);

//     if (error) throw error;
// }


// export async function respondToConnectionRequest(
//     initiatorId: string,
//     targetId: string,
//     action: 'accepted' | 'declined'
// ) {
//     const { error } = await supabase.clientTable
//         .from('connections')
//         .update({ status: action })
//         .eq('initiator', initiatorId)
//         .eq('target', targetId)
//         .eq('status', 'requested');

//     if (error) throw error;
// }



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
    const { error } = await supabase.clientTable.from("user_profile").delete().eq("id", user_id);

    if (error) {
        console.error("Error deleting user:", error);
        throw new Error("Failed to delete user");
    }
}

export async function getUserBadges(user_id: string): Promise<string[]> {

    console.log("User ID", user_id);

    const { data, error } = await supabase.clientTable.from("user_badge_relation").select("badge_id").eq("user_id", user_id);

    console.log("User Badges", data);
    console.log("User Badges Error", error);

    if (error) {
        console.error("Error fetching user badges:", error);
        throw new Error("Failed to fetch user badges");
    }
    if (!data) {
        console.error("User not found");
        throw new Error("User not found");
    }
    const badges = data.map((item) => item.badge_id);
    if (!badges) {
        console.error("Badges not found");
        throw new Error("Badges not found");
    }
    return badges;
}

export async function getBadgeById(badge_id: string): Promise<BadgeDetail> {
    const { data, error } = await supabase.clientTable.from("badges").select("*").eq("id", badge_id).single();

    if (error) {
        console.error("Error fetching badge:", error);
        throw new Error("Badge not found");
    }
    if (!data) {
        console.error("Badge not found");
        throw new Error("Badge not found");
    }
    return {
        id: badge_id,
        name: data.name,
        description: data.description,
        image_url: data.image_url
    };
}