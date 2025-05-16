import { Response, BlogDetail } from '@/lib/types'
import supabase from '@/lib/db'

export async function getBlogsByPage(
    page: number,
    limit: number
): Response<BlogDetail[]> {
    const { data, error } = await supabase.clientTable
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1)

    if (error) {
        return {
            status: 500,
            success: false,
            message: error.message,
            data: [],
        }
    }
    
    return {
        status: 200,
        success: true,
        message: 'Blogs fetched successfully',
        data: data as BlogDetail[],
    }
}

export async function getBlogByTitle(title: string): Response<BlogDetail> {

    console.log('Fetching blog with title:', title)

    const { data, error } = await supabase.clientTable
        .from('blogs')
        .select('*')
        .eq('title', title)

    if (error) {
        return {
            status: 500,
            success: false,
            message: error.message,
            data: null,
        }
    }

    return {
        status: 200,
        success: true,
        message: 'Blog fetched successfully',
        data: data[0] as BlogDetail,
    }
}