import supabase from "@/lib/db";
import { BadgeDetail, Connection, Connections, ConnectionStatus, Response, UserConnection, UserDetail } from "@/lib/types";

async function getUserIdByUsername(username: string): Response<string> {
    const { data, error } = await supabase.clientTable.from("user_profile").select("id").eq("username", username);
    console.log("Get user ID by username response:", data, error, username);
    if (error) return { status: 400, success: false, message: error.message, data: null };
    if (data.length === 0) return { status: 404, success: false, message: "User not found", data: null };
    return { status: 200, success: true, message: "User ID fetched successfully", data: data[0].id };
}

export async function getUserById(user_id: string): Response<UserDetail> {
    const { data, error } = await supabase.clientTable.from("user_profile").select("*").eq("id", user_id).single();

    if (error) return { status: 400, success: false, message: error.message, data: null };
    if (!data) return { status: 404, success: false, message: "User not found", data: null };

    if (!data.avatar_url.startsWith("https://avatars.githubusercontent.com/")) {
        const response = await getAvatarUrl(data.avatar_url);
        if (!response.success) return { status: 400, success: false, message: "Error getting public URL for avatar", data: null };
        if (response.data) {
            data.avatar_url = response.data;
        }
    }

    console.log("Get user by ID response:", data);

    return {
        status: 200,
        success: true,
        message: "User fetched successfully",
        data: {
            id: user_id,
            email: data.email,
            avatar_url: data.avatar_url,
            full_name: data.fullname,
            user_name: data.username,
            bio: data.bio,
        }
    };
}

export async function getUserByUsername(username: string): Response<UserDetail> {
    const response = await getUserIdByUsername(username);
    console.log("Get user by username response:", response);
    if (!response.success) return { status: response.status, success: false, message: response.message, data: null };
    if (!response.data) return { status: 404, success: false, message: "User not found", data: null };
    return await getUserById(response.data);
}

export async function emailExists(email: string): Response<boolean> {
    const { data, error } = await supabase.clientTable.from("user_profile").select("email").eq("email", email);
    if (error) return { status: 400, success: false, message: error.message, data: null };
    if (data.length === 0) return { status: 200, success: true, message: "Email does not exist", data: false };
    return { status: 200, success: true, message: "Email exists", data: true };
}

export async function updateUserEmail(user_id: string, email: string): Response<null> {
    const { error } = await supabase.clientTable.from("user_profile").update({
        email,
        updated_at: new Date(),
    }).eq("id", user_id).single();
    if (error) {
        if (error.code === "23505") {
            return { status: 409, success: false, message: "Email already exists", data: null };
        }
        return { status: 400, success: false, message: error.message, data: null };
    }
    return { status: 200, success: true, message: "Email updated successfully", data: null };
}

async function uploadAvatar(file: File): Response<string> {
    const randomId = Math.random().toString(36).substring(2, 15);
    const { error } = await supabase.clientStorage
        .from("custom-avatars")
        .upload(randomId, file, {
            cacheControl: "3600",
            upsert: true,
        });
    if (error) return { status: 400, success: false, message: error.message, data: null };
    return { status: 200, success: true, message: "Public URL fetched successfully", data: randomId };
}

export const getAvatarUrl = async (avatar_id: string): Response<string> => {
    const { data } = supabase
        .clientStorage
        .from("custom-avatars")
        .getPublicUrl(avatar_id);
    return { status: 200, success: true, message: "Public URL fetched successfully", data: data.publicUrl };
}

async function deleteAvatar(avatar_id: string): Response<null> {
    const { error } = await supabase.clientStorage
        .from("custom-avatars")
        .remove([avatar_id]);
    if (error) return { status: 400, success: false, message: error.message, data: null };
    return { status: 200, success: true, message: "Avatar deleted successfully", data: null };
}

export async function updateUserAvatar(user_id: string, file: File): Response<string> {
    const userResponse = await getUserById(user_id);
    if (!userResponse.success) return { status: userResponse.status, success: false, message: userResponse.message, data: null };
    const response = await uploadAvatar(file);
    if (!response.success) return { status: response.status, success: false, message: response.message, data: null };
    const { error } = await supabase.clientTable.from("user_profile").update({
        avatar_url: response.data,
        updated_at: new Date(),
    }).eq("id", user_id);
    if (error) return { status: 400, success: false, message: error.message, data: null };
    if (!userResponse.data!.avatar_url.startsWith("https://avatars.githubusercontent.com/")) {
        const response = await deleteAvatar(userResponse.data!.avatar_url);
        if (!response.success) return { status: response.status, success: false, message: response.message, data: null };
    }
    const avatarResponse = await getAvatarUrl(response.data!);
    if (!avatarResponse.success) return { status: avatarResponse.status, success: false, message: avatarResponse.message, data: null };
    return { status: 200, success: true, message: "Avatar updated successfully", data: avatarResponse.data };
}

export async function updateUserBio(user_id: string, bio: string): Response<null> {
    const { error } = await supabase.clientTable.from("user_profile").update({
        bio,
        updated_at: new Date(),
    }).eq("id", user_id);
    if (error) return { status: 400, success: false, message: error.message, data: null };
    return { status: 200, success: true, message: "Bio updated successfully", data: null };
}

export async function updateUserUsername(user_id: string, username: string): Response<null> {
    const { data, error } = await supabase.clientTable.from("user_profile").update({
        username,
        updated_at: new Date(),
    }).eq("id", user_id);
    if (error) {
        if (error.code === "23505") {
            return { status: 409, success: false, message: "Username already exists", data: null };
        }
        return { status: 400, success: false, message: error.message, data: null };
    }
    return { status: 200, success: true, message: "Username updated successfully", data: null };
}

export async function updateUserFullName(user_id: string, full_name: string): Response<null> {
    const { error } = await supabase.clientTable.from("user_profile").update({
        fullname: full_name,
        updated_at: new Date(),
    }).eq("id", user_id);
    if (error) return { status: 400, success: false, message: error.message, data: null };
    return { status: 200, success: true, message: "Full name updated successfully", data: null };
}

export async function deleteUserById(user_id: string): Response<null> {
    const response = await getUserById(user_id);
    if (!response.success) return { status: response.status, success: false, message: response.message, data: null };
    const avatarResponse = await deleteAvatar(response.data!.avatar_url);
    if (!avatarResponse.success) return { status: avatarResponse.status, success: false, message: avatarResponse.message, data: null };
    const { error } = await supabase.clientTable.from("user_profile").delete().eq("id", user_id);
    if (error) return { status: 400, success: false, message: error.message, data: null };
    return { status: 200, success: true, message: "User deleted successfully", data: null };
}

export async function getUserBadges(user_id: string): Response<string[]> {
    const { data, error } = await supabase.clientTable.from("user_badge_relation").select("badge_id").eq("user_id", user_id);
    if (error) return { status: 400, success: false, message: error.message, data: null };
    const badges = data.map((item) => item.badge_id);
    if (!badges) return { status: 404, success: false, message: "Badges not found", data: null };
    return { status: 200, success: true, message: "Badges fetched successfully", data: badges };
}

export async function getBadgeById(badge_id: string): Response<BadgeDetail> {
    const { data, error } = await supabase.clientTable.from("badges").select("*").eq("id", badge_id).single();

    if (error) return { status: 400, success: false, message: error.message, data: null };
    return {
        status: 200,
        success: true,
        message: "Badge fetched successfully",
        data: {
            id: badge_id,
            name: data.name,
            description: data.description,
            image_url: data.image_url
        }
    };
}

export async function getUserConnectionCount(user_id: string): Response<number> {
    const { data, error } = await supabase.clientTable
        .from("connections")
        .select("*")
        .or(`initiator.eq.${user_id},target.eq.${user_id}`)
        .eq("status", "accepted");
    if (error) return { status: 400, success: false, message: error.message, data: null };
    return { status: 200, success: true, message: "Connection count fetched successfully", data: data.length };
}

export async function getUserConnections(user_id: string): Response<Connections> {
    const { data, error } = await supabase.clientTable
        .from("connections")
        .select("*")
        .or(`initiator.eq.${user_id},target.eq.${user_id}`);

    if (error) return { status: 400, success: false, message: error.message, data: null };
    const outgoing_requests: UserConnection[] = [];
    const incoming_requests: UserConnection[] = [];
    const active_connections: UserConnection[] = [];
    const blocked_users: UserConnection[] = [];
    await Promise.all(data.map(async (item) => {
        const isInitiator = item.initiator === user_id;
        const otherUserId = isInitiator ? item.target : item.initiator;

        try {
            const response = await getUserById(otherUserId);
            if (!response.success) return { status: 400, success: false, message: `Error fetching user details for user_id ${otherUserId}: ${response.message}`, data: null };
            const connection: UserConnection = {
                connection_id: item.id,
                user_name: response.data!.user_name,
                full_name: response.data!.full_name,
                avatar_url: response.data!.avatar_url
            };
            if (item.status === "accepted") {
                active_connections.push(connection);
            } else if (item.status === "blocked") {
                if (isInitiator) {
                    blocked_users.push(connection);
                } else {
                    incoming_requests.push(connection);
                }
            } else {
                if (isInitiator) {
                    outgoing_requests.push(connection);
                } else {
                    incoming_requests.push(connection);
                }
            }
        } catch (error: any) {
            return { status: 400, success: false, message: `Error fetching user details for user_id ${otherUserId}: ${error.message}`, data: null };
        }
    }));

    return {
        status: 200,
        success: true,
        message: "Connections fetched successfully",
        data: {
            outgoing_requests,
            incoming_requests,
            active_connections,
            blocked_users
        }
    };
}

export async function getConnectionById(connection_id: string): Response<Connection> {
    const { data, error } = await supabase.clientTable
        .from("connections")
        .select("*")
        .eq("id", connection_id)
        .single();

    if (error) return { status: 400, success: false, message: error.message, data: null };
    return {
        status: 200,
        success: true,
        message: "Connection fetched successfully",
        data: {
            id: connection_id,
            initiator: data.initiator,
            target: data.target,
            status: data.status
        }
    };
}

export async function initiateConnection(initiator_id: string, target_id: string): Response<Connection> {
    const { data, error } = await supabase.clientTable
        .from("connections")
        .insert({
            initiator: initiator_id,
            target: target_id,
            status: "pending"
        })
        .select()
        .single();
    if (error) return { status: 400, success: false, message: error.message, data: null };
    return {
        status: 200,
        success: true,
        message: "Connection initiated successfully",
        data: {
            id: data.id,
            initiator: data.initiator,
            target: data.target,
            status: data.status
        }
    };
}

export async function acceptConnection(connection_id: string): Response<null> {
    const { error } = await supabase.clientTable
        .from("connections")
        .update({
            status: "accepted",
            updated_at: new Date(),
        })
        .eq("id", connection_id);
    if (error) return { status: 400, success: false, message: error.message, data: null };
    return { status: 200, success: true, message: "Connection accepted successfully", data: null };
}

export async function declineConnection(connection_id: string): Response<null> {
    const { error } = await supabase.clientTable
        .from("connections")
        .update({
            status: "declined",
            updated_at: new Date(),
        })
        .eq("id", connection_id);

    if (error) return { status: 400, success: false, message: error.message, data: null };
    return { status: 200, success: true, message: "Connection declined successfully", data: null };
}

export async function blockConnection(connection_id: string): Response<null> {
    const { error } = await supabase.clientTable
        .from("connections")
        .update({
            status: "blocked",
            updated_at: new Date(),
        })
        .eq("id", connection_id);

    if (error) return { status: 400, success: false, message: error.message, data: null };
    return { status: 200, success: true, message: "Connection blocked successfully", data: null };
}

export async function deleteConnection(connection_id: string): Response<null> {
    const { error } = await supabase.clientTable
        .from("connections")
        .delete()
        .eq("id", connection_id);

    if (error) return { status: 400, success: false, message: error.message, data: null };
    return { status: 200, success: true, message: "Connection deleted successfully", data: null };
}

export async function getConnectionByInitiatorAndTarget(initiator_id: string, target_id: string): Response<Connection | null> {
    const { data, error } = await supabase.clientTable
        .from("connections")
        .select("*")
        .or(`and(initiator.eq.${initiator_id},target.eq.${target_id}),and(initiator.eq.${target_id},target.eq.${initiator_id})`)
        .maybeSingle();
    if (error) return { status: 400, success: false, message: error.message, data: null };
    if (!data) return { status: 200, success: true, message: "User not connected", data: null };
    return {
        status: 200,
        success: true,
        message: "Connection fetched successfully",
        data: {
            id: data.id,
            initiator: data.initiator,
            target: data.target,
            status: data.status as ConnectionStatus
        }
    };
}