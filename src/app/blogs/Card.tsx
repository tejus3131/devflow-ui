"use client";

import React, { JSX, useEffect, useState } from "react";

import { BlogDetail, Vote, VoteType } from "@/lib/types";
import { useUser } from "@/hooks/useUser";
import { downvoteBlog, getVoteByBlogTitleAndUserId, getVotesByBlogTitle, removeVoteFromBlog, upvoteBlog } from "@/lib/data/votes";
import { ContentCard } from "@/components/ContentCard";
import { getUserById } from "@/lib/data/users";


export interface BlogCardProps {
    blog: BlogDetail
}

export function BlogCard({
    blog
}: BlogCardProps): JSX.Element {

    const { user } = useUser();

    const [localUserVoteType, setLocalUserVoteType] = useState<VoteType>(null);
    const [localUpvotes, setLocalUpvotes] = useState<number>(0);
    const [localDownvotes, setLocalDownvotes] = useState<number>(0);

    const [author, setAuthor] = useState<{ user_name: string, avatar_url: string } | null>(null);
    const [authorState, setAuthorState] = useState<"loading" | "error" | "success">("loading");

    const [breadcrumbs, setBreadcrumbs] = useState<{ items: { label: string; href: string }[] }>({ items: [] });
    const [breadcrumbsState, setBreadcrumbsState] = useState<"loading" | "error" | "success">("loading");

    const onVoteChange = async (voteType: VoteType) => {
        if (!user) return;
        if (voteType === "upvote") {
            await upvoteBlog(blog.title, user.id);
        } else if (voteType === "downvote") {
            await downvoteBlog(blog.title, user.id);
        } else if (voteType === null) {
            await removeVoteFromBlog(blog.title, user.id);
        }
    };

    useEffect(() => {
        const fetchVotes = async () => {
            const response = await getVotesByBlogTitle(blog.title);
            if (!response.success) {
                console.error("Error fetching vote:", response.message);
                return;
            }
            const votes = response.data!;
            const upvotes = votes.filter((vote: Vote) => vote.vote === "upvote").length;
            const downvotes = votes.filter((vote: Vote) => vote.vote === "downvote").length;
            setLocalUpvotes(upvotes);
            setLocalDownvotes(downvotes);
        }
        fetchVotes();
    }, [user, blog.title]);

    useEffect(() => {
        const fetchUserVote = async () => {
            if (!user) return;
            const response = await getVoteByBlogTitleAndUserId(blog.title, user.id);
            if (!response.success) {
                console.error("Error fetching vote:", response.message);
                return;
            }
            setLocalUserVoteType(response.data?.vote || null);
        }
        fetchUserVote();
    }, [user, blog.title]);

    useEffect(() => {
        const fetchAuthor = async () => {
            const userRes = await getUserById(blog.author_id);
            if (!userRes.success) {
                console.error("Error fetching author:", userRes.message);
                setAuthorState("error");
                return;
            }
            setAuthor(userRes.data);
            setAuthorState("success");
        }
        fetchAuthor();
    }, [blog.title]);

    useEffect(() => {
        if (authorState !== "success") {
            setBreadcrumbsState("loading");
            return;
        }
        const fetchBreadcrumbs = async () => {
            const locationItems = [
                { label: author?.user_name!, href: `/${author?.user_name}` },
                { label: blog.title, href: `/blogs/${blog.title}` }
            ];
            setBreadcrumbs({ items: locationItems });
            setBreadcrumbsState("success");
        }
        fetchBreadcrumbs();
    }, [blog.title, author, authorState]);

    return (
        <ContentCard
            name={blog.title}
            description={blog.description}
            breadcrumbs={breadcrumbs}
            breadcrumbsState={breadcrumbsState}
            type="blog"
            author={author}
            authorState={authorState}
            tags={blog.tags}
            upvotes={localUpvotes}
            downvotes={localDownvotes}
            userVoteType={localUserVoteType}
            onVoteChange={onVoteChange}
        />


    );
}
