export const getSupabaseAuthTokenName = () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        throw new Error("Supabase URL must be provided");
    }
    const supabaseProjectId = process.env.NEXT_PUBLIC_SUPABASE_URL.split("/")[2].split(".")[0];
    return `sb-${supabaseProjectId}-auth-token`;
}
export const getAuthJWT = () => {
    const data = localStorage.getItem(getSupabaseAuthTokenName());
    console.log("Auth JWT data", data);
    if (!data) {
        throw new Error("No auth data found");
    }
    const parsedData = JSON.parse(data);
    if (typeof parsedData !== "object") {
        throw new Error("Invalid auth data format");
    }
    console.log("Parsed auth data", parsedData);
    if (!parsedData.access_token) {
        return null;
    }
    console.log("Access token", parsedData.access_token);
    return parsedData.access_token;
}