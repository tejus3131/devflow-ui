import Link from 'next/link'
import React from 'react'

function page() {
    const ID = '123' // Replace with your actual blog ID
    
    return (
        <div className='p-20'>
            <Link href={`/blog/${ID}`}>Blog 1</Link>
        </div>
    )
}

export default page