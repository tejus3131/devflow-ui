export interface User {
    id: string;
    email: string;
    avatar_url: string;
    full_name: string;
    user_name: string;
    bio: string;
}

export interface UserDetail {
    id: string;
    email: string;
    avatar_url: string;
    full_name: string;
    user_name: string;
    bio: string;
}

export interface ApiResponse<T> {
    status: number;
    success: boolean;
    message: string;
    data: T | null;
}
