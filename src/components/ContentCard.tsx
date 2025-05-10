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
  Users,
  Tag,
  CircleArrowRight,
} from "lucide-react";
import { Breadcrumb, BreadcrumbProps } from "./Breadcrumb";
import Button from "./Button";

type VoteType = "up" | "down" | null;

type ContentType = "Repository" | "Component" | "Configuration" | "Flavour";

export interface ContentCardProps {
  name: string;
  description: string;
  location: BreadcrumbProps;
  type: ContentType;
  authors: string[];
  tags: string[];
  upvotes: number;
  downvotes: number;
  userVote: VoteType;
  className: string;
}

export function ContentCard({
  name,
  description,
  location,
  type,
  authors,
  tags,
  upvotes,
  downvotes,
  userVote,
  className,
}: ContentCardProps): JSX.Element {
  const [localUserVoteType, setLocalUserVoteType] =
    useState<VoteType>(userVote);

  const typeStyles: Record<
    ContentType,
    {
      bgColor: string;
      textColor: string;
      icon: React.ElementType;
    }
  > = {
    Repository: {
      bgColor: "bg-blue-100 dark:bg-blue-800/30",
      textColor: "text-blue-800 dark:text-blue-300",
      icon: Folder,
    },
    Component: {
      bgColor: "bg-green-100 dark:bg-green-800/30",
      textColor: "text-green-800 dark:text-green-300",
      icon: Puzzle,
    },
    Configuration: {
      bgColor: "bg-yellow-100 dark:bg-yellow-800/30",
      textColor: "text-yellow-800 dark:text-yellow-300",
      icon: Settings,
    },
    Flavour: {
      bgColor: "bg-purple-100 dark:bg-purple-800/30",
      textColor: "text-purple-800 dark:text-purple-300",
      icon: Palette,
    },
  };

  const currentTypeStyle = typeStyles[type];
  const TypeIcon = currentTypeStyle.icon;

  const handleUpvote = () => {
    if (localUserVoteType === "up") {
      setLocalUserVoteType(null);
      // onUpvote(false);
    } else {
      setLocalUserVoteType("up");
      // onUpvote(true);
    }
  };

  const handleDownvote = () => {
    if (localUserVoteType === "down") {
      setLocalUserVoteType(null);
      // onDownvote(false);
    } else {
      setLocalUserVoteType("down");
      // onDownvote(true);
    }
  };

  return (
    <div className={`rounded-lg shadow-sm overflow-hidden ${className}`}>
      <div className="p-6 bg-muted-light dark:bg-muted-dark text-on-muted-light dark:text-on-muted-dark">
        <div className="flex justify-between items-start mb-4">
          <div
            className={`inline-flex items-center px-2.5 py-1.5 rounded-full border text-sm font-medium ${currentTypeStyle.bgColor} ${currentTypeStyle.textColor}`}
          >
            <TypeIcon className="w-4 h-4 mr-1" />
            {type}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleUpvote}
              className={`flex items-center gap-1 px-2 py-1 rounded-md ${
                localUserVoteType === "up"
                  ? "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300"
                  : "bg-surface-light dark:bg-accent-dark text-on-surface-light dark:text-on-accent-dark hover:bg-muted-light dark:hover:bg-border-dark"
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>
                {localUserVoteType === null
                  ? upvotes
                  : localUserVoteType === "up"
                  ? upvotes + 1
                  : upvotes}
              </span>
            </button>

            <button
              onClick={handleDownvote}
              className={`flex items-center gap-1 px-2 py-1 rounded-md ${
                localUserVoteType === "down"
                  ? "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300"
                  : "bg-surface-light dark:bg-accent-dark text-on-surface-light dark:text-on-accent-dark hover:bg-muted-light dark:hover:bg-border-dark"
              }`}
            >
              <ThumbsDown className="w-4 h-4" />
              <span>
                {localUserVoteType === null
                  ? downvotes
                  : localUserVoteType === "down"
                  ? downvotes + 1
                  : downvotes}
              </span>
            </button>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-foreground-light dark:text-foreground-dark mb-2">
          {name}
        </h3>
        <p className="text-foreground-light dark:text-foreground-dark/50 mb-4">
          {description}
        </p>

        {authors.length > 0 && (
          <div className="flex items-center mb-4">
            <Users className="w-4 h-4 text-on-muted-light dark:text-on-muted-dark mr-2" />
            <div className="flex flex-wrap gap-2">
              {authors.map((author, index) => (
                <span
                  key={index}
                  className="text-sm text-on-muted-light dark:text-on-muted-dark font-medium"
                >
                  {author}
                  {index < authors.length - 1 ? "," : ""}
                </span>
              ))}
            </div>
          </div>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-surface-light dark:bg-accent-dark text-on-surface-light dark:text-on-accent-dark"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className=" border-border-light dark:border-border-dark bg-neutral-light dark:bg-neutral-dark p-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-on-neutral-light dark:text-on-neutral-dark">
            <Breadcrumb items={location.items} />
          </div>
          <div className="flex gap-2">
            <Link href={`/${location.items[0].href}`}>
              <Button variant="primary" 
              
                className="py-2 px-5">
                Discover
                <CircleArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
