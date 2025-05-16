/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Clock, Calendar } from 'lucide-react';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

interface BlogPost {
  id: string;
  title: string;
  coverImage: string;
  content: string;
  tags: string[];
  readTime: string;
  publishedDate: string;
}

// Dummy blog data for testing
const dummyBlogData: BlogPost = {
  id: "1",
  title: "Understanding Modern Web Development with React and TypeScript",
  coverImage: "https://images.unsplash.com/photo-1746730251085-34132b6dcec5?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Replace with your actual image path
  content: `
# Tejus Gupta
## Software Developer

### Contact
- 📞 [+91 63929 13763](tel:+916392913763)
- 📧 tejus3131@gmail.com
- 🔗 [LinkedIn](https://www.linkedin.com/in/tejus3131)
- 🔗 [GitHub](https://github.com/tejus3131)
- 🔗 [Twitter](https://twitter.com/tejus3131)

---

### Profile
Passionate Computer Science student with a strong foundation in software development. Skilled in Python and full-stack web development, with experience in building projects from scratch and leading technical workshops. Eager to innovate; I aim to leverage my knowledge to solve real-world problems and create impactful tech solutions.

---

### Work Experience

#### KloudiDev Digital Solutions
*Software Developer Intern*  
FEB 2025 - PRESENT  
- Collaborated with team members to design, develop, and launch a user-friendly AI software product.
- Created Automated CI/CD for deployment of the application on AWS and added tests for validation before deployment.
- Demonstrated adaptability by swiftly learning and applying new technologies, tools, and methodologies.

*Python Developer Intern*  
FEB 2024 - AUGUST 2024  
- Managed FastAPI-based server for multiple microservices deployed on GCP with Docker.
- Worked on multiple Proof of Concepts (POCs) with Streamlit and LangChain.

---

### Skills
- Python, JavaScript, Rust, C++
- Flask, FastAPI
- LangChain
- Streamlit
- ReactJS, Next.js
- Tailwind, Bootstrap
- Supabase, MongoDB, MySQL
- GCP, AWS
- Git, GitHub
- CI/CD - GitHub Action

---

### Projects
- *[Kairos (Gen AI)](https://github.com/tejus3131/kairos)*  
  Built a Gen AI-based Mental Therapist that can help users by providing a safe space to talk and also assess their mental situation based on the talk.  
  Technologies: Python, Flask, Jinja, MongoDB

- *[Quellify (Full Stack)](https://github.com/tejus3131/quellify)*  
  Built a complete course-providing website where users can share their courses and also see others' courses.  
  Technologies: Python, Flask, Jinja, MongoDB

- *[Interpreter for Toy Language (Rust)](https://github.com/tejus3131/bhasha)*  
  Developed an interpreter for a toy language, focusing on parsing and language construction.  
  Technologies: Rust, Compiler Design

---

### Accomplishments
- Speaker at NextFest, MIET, Meerut.
- Winner, AWS Ideathon, 2024.
- First runner-up, Fetchathon.
- Second runner-up, Fetchathon 2.0.
- Speaker at Tech Fest Xcepto, IIT Mandi.

---

### Strengths
- Strong problem-solving skills
- Effective communication
- Adaptable and quick learner

---

### Education
*Bachelor of Technology*  
Meerut Institute of Engineering and Technology
  `,
  tags: ["React", "TypeScript", "WebDev", "Frontend", "JavaScript"],
  readTime: "5 min read",
  publishedDate: "May 10, 2025"
};

// Custom components for MDX
const components = {
  h1: (props: any) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-bold mt-8 mb-3 border-b pb-2" {...props} />,
  h3: (props: any) => <h3 className="text-xl font-semibold mt-6 mb-2" {...props} />,
  h4: (props: any) => <h4 className="text-lg font-semibold mt-4 mb-2" {...props} />,
  p: (props: any) => <p className="my-4 leading-relaxed" {...props} />,
  ul: (props: any) => <ul className="list-disc pl-5 my-4 space-y-2" {...props} />,
  ol: (props: any) => <ol className="list-decimal pl-5 my-4 space-y-2" {...props} />,
  li: (props: any) => <li className="ml-2" {...props} />,
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-4" {...props} />
  ),
  code: (props: any) => {
    const { className, ...rest } = props;
    return className ? (
      // For code blocks with language highlighting
      <code className={`${className} block rounded-md p-4 text-sm overflow-x-auto`} {...rest} />
    ) : (
      // For inline code
      <code className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5 text-sm font-mono" {...rest} />
    );
  },
  pre: (props: any) => <pre className="rounded-md overflow-x-auto bg-gray-100 dark:bg-gray-800 p-4 my-6" {...props} />,
  table: (props: any) => (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700" {...props} />
    </div>
  ),
  thead: (props: any) => <thead className="bg-gray-100 dark:bg-gray-800" {...props} />,
  tbody: (props: any) => <tbody {...props} />,
  tr: (props: any) => <tr className="even:bg-gray-50 dark:even:bg-gray-900" {...props} />,
  th: (props: any) => <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-semibold" {...props} />,
  td: (props: any) => <td className="border border-gray-300 dark:border-gray-700 px-4 py-2" {...props} />,
  hr: () => <hr className="my-8 border-t border-gray-300 dark:border-gray-700" />,
  img: (props: any) => (
    <div className="my-6">
      <img className="max-w-full h-auto rounded-lg" {...props} alt={props.alt || ''} />
    </div>
  ),
  a: (props: any) => <a className="text-blue-600 dark:text-blue-400 hover:underline" {...props} />,
  em: (props: any) => <em className="italic" {...props} />,
  strong: (props: any) => <strong className="font-bold" {...props} />,
};

const BlogPostPage: React.FC = () => {
  const params = useParams();
  const id = params.id as string;
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [mdxSource, setMdxSource] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // For testing with dummy data
    const loadDummyData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Set dummy blog data
        setBlog(dummyBlogData);
        
        // Process MDX content from dummy data with enhanced plugins
        const mdxSource = await serialize(dummyBlogData.content, {
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeSlug,
              [rehypeAutolinkHeadings, { behavior: 'wrap' }],
              rehypeHighlight
            ],
          },
          // Adding this to prevent potential JS expression parsing issues
          parseFrontmatter: false,
        });
        setMdxSource(mdxSource);
      } catch (error) {
        console.error('Error processing dummy data:', error);
        setError('Failed to process blog content. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    // Use this for testing with dummy data
    loadDummyData();
    
    // For real API usage (uncomment when ready)
    // const fetchBlog = async () => {
    //   if (!id) return;
    //   
    //   try {
    //     setIsLoading(true);
    //     setError(null);
    //     // Replace with your actual API endpoint
    //     const response = await fetch(`/api/blogs/${id}`);
    //     
    //     if (!response.ok) {
    //       throw new Error('Failed to fetch blog post');
    //     }
    //     
    //     const data = await response.json();
    //     setBlog(data);
    //     
    //     // Process MDX content with enhanced plugins
    //     const mdxSource = await serialize(data.content, {
    //       mdxOptions: {
    //         remarkPlugins: [remarkGfm],
    //         rehypePlugins: [
    //           rehypeSlug,
    //           [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    //           rehypeHighlight
    //         ],
    //       },
    //       // Adding this to prevent potential JS expression parsing issues
    //       parseFrontmatter: false,
    //     });
    //     setMdxSource(mdxSource);
    //   } catch (error) {
    //     console.error('Error fetching blog post:', error);
    //     setError('Failed to load blog post. Please try again later.');
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // fetchBlog();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background dark:bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary dark:border-blue-600 rounded-full animate-spin border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background dark:bg-black flex items-center justify-center">
        <div className="text-foreground dark:text-white text-xl text-center px-4">
          <div className="mb-4 text-red-500">❌ Error</div>
          {error}
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-background dark:bg-black flex items-center justify-center">
        <div className="text-foreground dark:text-white text-xl">Blog post not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-black text-foreground dark:text-white py-12">
      <div className="container mx-auto px-4 max-w-5xl rounded-t-md">
        <div className="bg-surface dark:bg-neutral-dark rounded-lg shadow-md overflow-hidden">
          {/* Cover image inside container */}
          <div className="relative w-full h-80">
            <Image 
              src={blog.coverImage} 
              alt={blog.title}
              layout="fill"
              objectFit="cover"
              className="opacity-90"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
          </div>

          {/* Blog header */}
          <div className="p-6 md:p-8 bg-background-light dark:bg-muted-dark">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-on-surface dark:text-on-surface-dark">{blog.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-on-surface dark:text-on-surface-dark text-sm mb-6">
              <div className="flex items-center">
                <Calendar size={16} className="mr-1" />
                <span>{blog.publishedDate}</span>
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-1" />
                <span>{blog.readTime}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {blog.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="bg-accent dark:bg-accent-dark text-on-accent dark:text-on-accent-dark px-3 py-1 rounded-full text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Blog content with improved styling */}
          <div className="p-6 md:p-8 bg-white dark:bg-muted-dark text-on-surface dark:text-on-muted-dark">
            <article className="max-w-none mdx-content">
              {mdxSource && <MDXRemote {...mdxSource} components={components} />}
            </article>
          </div>

          {/* Comments section */}
          <div className="p-6 md:p-8 bg-white dark:bg-muted-dark text-on-surface dark:text-on-muted-dark border-t border-gray-200 dark:border-gray-800">
            <h3 className="text-xl font-semibold mb-6">Thoughts</h3>
            
            {/* Add comment form */}
            <div className="mb-8">
              <textarea 
                placeholder="Share your thoughts..." 
                className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-background dark:bg-black text-foreground dark:text-white resize-none min-h-[120px] focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-dark"
              />
              <div className="flex justify-end mt-3">
                <button 
                  className="bg-accent dark:bg-accent-dark text-on-accent dark:text-on-accent-dark px-4 py-2 rounded-md font-medium hover:bg-accent/90 dark:hover:bg-accent-dark/90 transition-colors"
                >
                  Post Comment
                </button>
              </div>
            </div>
            
            {/* Comments list */}
            <div className="space-y-6">
              {/* Example comments - replace with actual comments data */}
              <div className="border-b border-gray-200 dark:border-gray-800 pb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400">
                    JP
                  </div>
                  <div>
                    <p className="font-medium">John Peterson</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">May 12, 2025</p>
                  </div>
                </div>
                <div className="mt-2  ml-5  p-3 rounded-md bg-gray-50 dark:bg-neutral-700 border-l-4 border-gray-300 dark:border-neutral-400">
                  <p>Thanks for sharing these Git workflow tips! I&apos;ve been looking for a clear guide like this for my team.</p>
                </div>
              </div>
              
              <div className="border-b border-gray-200 dark:border-gray-800 pb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400">
                    SD
                  </div>
                  <div>
                    <p className="font-medium">Sara Donaldson</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">May 11, 2025</p>
                  </div>
                </div>
                <div className="mt-2 ml-5 p-3 rounded-md bg-gray-50 dark:bg-neutral-700 border-l-4 border-gray-300 dark:border-neutral-400">
                  <p>I&apos;ve been using a similar workflow for years and it&apos;s really effective. One additional tip: use git alias to make common commands shorter!</p>
                </div>
                <div className="mt-2 ml-5 p-3 rounded-md bg-gray-50 dark:bg-neutral-700 border-l-4 border-gray-300 dark:border-neutral-400">
                  <p>I&apos;ve been using a similar workflow for years and it&apos;s really effective. One additional tip: use git alias to make common commands shorter! Lorem ipsum dolor sit, amet consectetur adipisicing elit. Explicabo dolores numquam illum.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;