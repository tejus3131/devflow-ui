"use client";

import React, { JSX, useEffect, useState } from "react";

import { RepositoryDetail, Vote, VoteType } from "@/lib/types";
import { useUser } from "@/hooks/useUser";
import { downvoteRepository, getVoteByRepoIdAndUserId, getVotesByRepoId, removeVoteFromRepository, upvoteRepository } from "@/lib/data/votes";
import { ContentCard } from "@/components/ContentCard";
import { getUserById } from "@/lib/data/users";


export interface RepositoryCardProps {
    repository: RepositoryDetail
}

export function RepositoryCard({
    repository
}: RepositoryCardProps): JSX.Element {

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
            await upvoteRepository(repository.id, user.id);
        } else if (voteType === "downvote") {
            await downvoteRepository(repository.id, user.id);
        } else if (voteType === null) {
            await removeVoteFromRepository(repository.id, user.id);
        }
    };

    useEffect(() => {
        const fetchVotes = async () => {
            const response = await getVotesByRepoId(repository.id);
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
    }, [user, repository.id]);

    useEffect(() => {
        const fetchUserVote = async () => {
            if (!user) return;
            const response = await getVoteByRepoIdAndUserId(repository.id, user.id);
            if (!response.success) {
                console.error("Error fetching vote:", response.message);
                return;
            }
            setLocalUserVoteType(response.data!.vote);
        }
        fetchUserVote();
    }, [user, repository.id]);

    useEffect(() => {
        const fetchAuthor = async () => {
            const userRes = await getUserById(repository.author_id);
            if (!userRes.success) {
                console.error("Error fetching author:", userRes.message);
                setAuthorState("error");
                return;
            }
            setAuthor(userRes.data);
            setAuthorState("success");
        }
        fetchAuthor();
    }, [repository.id]);

    useEffect(() => {
        if (authorState !== "success") {
            setBreadcrumbsState("loading");
            return;
        }
        const fetchBreadcrumbs = async () => {
            const locationItems = [
                { label: author?.user_name!, href: `/${author?.user_name}` },
                { label: repository.name, href: `/${author?.user_name}/${repository.name}` }
            ];
            setBreadcrumbs({ items: locationItems });
            setBreadcrumbsState("success");
        }
        fetchBreadcrumbs();
    }, [repository.id, author, authorState]);

    return (
        <ContentCard
            name={repository.name}
            description={repository.description}
            breadcrumbs={breadcrumbs}
            breadcrumbsState={breadcrumbsState}
            type="repository"
            author={author}
            authorState={authorState}
            tags={repository.tags}
            upvotes={localUpvotes}
            downvotes={localDownvotes}
            userVoteType={localUserVoteType}
            onVoteChange={onVoteChange}
        />


    );
}
