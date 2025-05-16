import { getUserByUsername } from '@/lib/data/users';
import { NextResponse } from 'next/server';
import supabase from '@/lib/db';
import { getSupabaseAuthTokenName } from '@/lib/utils';
import serverAuth from '@/lib/admin';

export async function DELETE(request: Request, { params }: { params: { username: string } }) {
    const { username } = await params;
    if (!username) {
        return NextResponse.json({ status: 400, success: false, message: 'Username is required', data: null }, { status: 400 });
    }
    const response = await getUserByUsername(username);
    if (!response.success) {
        return NextResponse.json(response, { status: 404 });
    }
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
        return NextResponse.json({ status: 401, success: false, message: 'Unauthorized', data: null }, { status: 401 });
    }
    const user = await supabase.clientAuth.getUser(token);

    if (user.data.user?.id !== response.data!.id) {
        return NextResponse.json({ status: 403, success: false, message: 'Forbidden', data: null }, { status: 403 });
    }

    try {
        const { error } = await serverAuth.deleteUser(response.data!.id);

        if (error) {
            throw new Error(error.message);
        }

        return NextResponse.json({ status: 200, success: true, message: `User with username ${username} deleted successfully`, data: null });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}