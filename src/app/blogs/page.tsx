'use client';
import { getBlogsByPage } from '@/lib/data/blogs'
import { BlogDetail } from '@/lib/types'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { BlogCard } from './Card';
import { useUser } from '@/hooks/useUser';

function page() {

    const [blogs, setBlogs] = React.useState<BlogDetail[]>([])
    const { isLoading } = useUser();

    useEffect(() => {
        const fetchBlogs = async () => {
            const response = await getBlogsByPage(1, 10)
            if (response.success) {
                setBlogs(response.data!)
            }
        }
        fetchBlogs()
    }, [])



    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className='p-20'>
            {blogs.map(blog => (
                <BlogCard key={blog.title} blog={blog} />
            ))}
        </div>
    )
}

export default page;