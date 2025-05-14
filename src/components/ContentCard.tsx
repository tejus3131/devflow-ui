"use client";

import React, { JSX, useState } from "react";
import Link from "next/link";
import {
  Folder,
  Puzzle,
  Settings,
  Palette,
  ThumbsUp,
  ThumbsDown,
  Tag,
  CircleArrowRight,
  CircleX,
} from "lucide-react";
import { Breadcrumb, BreadcrumbProps } from "./Breadcrumb";
import { Button } from "./Button";
import Image from "next/image";
import { ContentType, VoteType } from "@/lib/types";


export interface ContentCardProps {
  name: string;
  description: string;
  breadcrumbs: BreadcrumbProps;
  breadcrumbsState: "loading" | "error" | "success";
  type: ContentType;
  author: { user_name: string, avatar_url: string } | null;
  authorState: "loading" | "error" | "success";
  tags: string[];
  upvotes: number;
  downvotes: number;
  userVoteType: VoteType;
  onVoteChange: (voteType: VoteType) => void;
}

export function ContentCard({
  name,
  description,
  breadcrumbs,
  breadcrumbsState,
  type,
  author,
  authorState,
  tags,
  upvotes,
  downvotes,
  userVoteType,
  onVoteChange
}: ContentCardProps): JSX.Element {
  const [localUserVoteType, setLocalUserVoteType] =
    useState<VoteType>(userVoteType);
  const [localUpvotes, setLocalUpvotes] = useState<number>(upvotes);
  const [localDownvotes, setLocalDownvotes] = useState<number>(downvotes);

  const typeStyles: Record<
    ContentType,
    {
      bgColor: string;
      textColor: string;
      icon: React.ElementType;
    }
  > = {
    repository: {
      bgColor: "bg-blue-100 dark:bg-blue-800/30",
      textColor: "text-blue-800 dark:text-blue-300",
      icon: Folder,
    },
    component: {
      bgColor: "bg-green-100 dark:bg-green-800/30",
      textColor: "text-green-800 dark:text-green-300",
      icon: Puzzle,
    },
    configuration: {
      bgColor: "bg-yellow-100 dark:bg-yellow-800/30",
      textColor: "text-yellow-800 dark:text-yellow-300",
      icon: Settings,
    },
    flavour: {
      bgColor: "bg-purple-100 dark:bg-purple-800/30",
      textColor: "text-purple-800 dark:text-purple-300",
      icon: Palette,
    },
  };

  const currentTypeStyle = typeStyles[type];
  const TypeIcon = currentTypeStyle.icon;

  const handleUpvote = () => {
    if (localUserVoteType === "upvote") {
      setLocalUpvotes(localUpvotes - 1);
      setLocalUserVoteType(null);
      onVoteChange(null);
    } else {
      setLocalUpvotes(localUpvotes + 1);
      if (localUserVoteType === "downvote") {
        setLocalDownvotes(localDownvotes - 1);
      }
      setLocalUserVoteType("upvote");
      onVoteChange("upvote");
    }
  };

  const handleDownvote = () => {
    if (localUserVoteType === "downvote") {
      setLocalDownvotes(localDownvotes - 1);
      setLocalUserVoteType(null);
      onVoteChange(null);
    } else {
      setLocalDownvotes(localDownvotes + 1);
      if (localUserVoteType === "upvote") {
        setLocalUpvotes(localUpvotes - 1);
      }
      setLocalUserVoteType("downvote");
      onVoteChange("downvote");
    }
  };

  return (
    <div className={`rounded-lg shadow-sm overflow-hidden`}>
      <div className="p-4 sm:p-6 bg-muted-light dark:bg-muted-dark text-on-muted-light dark:text-on-muted-dark">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0 mb-4">
          <div
            className={`inline-flex items-center px-2.5 py-1.5 rounded-full border text-sm font-medium w-fit ${currentTypeStyle.bgColor} ${currentTypeStyle.textColor}`}
          >
            <TypeIcon className="w-4 h-4 mr-1" />
            {type}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleUpvote}
              className={`flex items-center gap-1 px-2 py-1 rounded-md ${localUserVoteType === "upvote"
                ? "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300"
                : "bg-surface-light dark:bg-accent-dark text-on-surface-light dark:text-on-accent-dark hover:bg-muted-light dark:hover:bg-border-dark"
                }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{localUpvotes}</span>
            </button>

            <button
              onClick={handleDownvote}
              className={`flex items-center gap-1 px-2 py-1 rounded-md ${localUserVoteType === "downvote"
                ? "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300"
                : "bg-surface-light dark:bg-accent-dark text-on-surface-light dark:text-on-accent-dark hover:bg-muted-light dark:hover:bg-border-dark"
                }`}
            >
              <ThumbsDown className="w-4 h-4" />
              <span>{localDownvotes}</span>
            </button>
          </div>
        </div>

        <h3 className="text-lg sm:text-xl font-semibold text-foreground-light dark:text-foreground-dark mb-2">
          {name}
        </h3>
        <p className="text-sm sm:text-base text-foreground-light dark:text-foreground-dark/50 mb-4 line-clamp-3">
          {description}
        </p>

        {authorState === "success" && <Link className="flex items-center gap-2 mb-4" href={`/${author!.user_name}`}>
          <Image
            alt={author!.user_name}
            src={author!.avatar_url}
            className="w-8 h-8 rounded-full"
            width={32}
            height={32}
          />
          <span className="text-sm sm:text-base text-on-surface-light dark:text-on-accent-dark">
            @{author!.user_name}
          </span>
        </Link>}

        {authorState === "loading" && (
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full"></div>
            <span className="text-sm sm:text-base text-on-surface-light dark:text-on-accent-dark">
              Loading...
            </span>
          </div>
        )}

        {authorState === "error" && (
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-red-200 rounded-full">
              <CircleX
                className="w-6 h-6 text-red-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                size={24}
                strokeWidth={2}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </div>
            <span className="text-sm sm:text-base text-on-surface-light dark:text-on-accent-dark">
              Error loading author
            </span>
          </div>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-medium bg-surface-light dark:bg-accent-dark text-on-surface-light dark:text-on-accent-dark"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="border-border-light dark:border-border-dark bg-neutral-light dark:bg-neutral-dark p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <div className="text-xs sm:text-sm text-on-neutral-light dark:text-on-neutral-dark w-full sm:w-auto overflow-x-auto">
            {breadcrumbsState === "loading" ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 animate-pulse rounded-full" />
                <span className="text-sm sm:text-base text-on-surface-light dark:text-on-accent-dark">
                  Loading breadcrumbs...
                </span>
              </div>
            ) : (<Breadcrumb items={breadcrumbs.items} />)}

          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Link href={breadcrumbsState === "loading" ? "#" : `${breadcrumbs.items[breadcrumbs.items.length - 1].href}`} className="w-full sm:w-auto">
              <Button
                variant="primary"
                className="py-1.5 sm:py-2 px-3 sm:px-5 w-full sm:w-auto text-sm"
                icon={<CircleArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />}
              >
                {breadcrumbsState === "loading" ? "Loading..." : `Go to ${breadcrumbs.items[breadcrumbs.items.length - 1].label}`}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
