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
  CircleArrowRight
} from "lucide-react";
import { Breadcrumb, BreadcrumbProps } from "./Breadcrumb";

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
  className
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
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      icon: Folder, // Repository icon
    },
    Component: {
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      icon: Puzzle, // Component icon
    },
    Configuration: {
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
      icon: Settings, // Configuration icon
    },
    Flavour: {
      bgColor: "bg-purple-100",
      textColor: "text-purple-800",
      icon: Palette, // Flavour icon
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
    <div
      className={`bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden ${className}`}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div
            className={`inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium ${currentTypeStyle.bgColor} ${currentTypeStyle.textColor}`}
          >
            <TypeIcon className="w-4 h-4 mr-1" />
            {type}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleUpvote}
              className={`flex items-center gap-1 px-2 py-1 rounded-md ${localUserVoteType === "up"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{localUserVoteType === null ? upvotes : localUserVoteType === "up" ? upvotes + 1 : upvotes}</span>
            </button>

            <button
              onClick={handleDownvote}
              className={`flex items-center gap-1 px-2 py-1 rounded-md ${localUserVoteType === "down"
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              <ThumbsDown className="w-4 h-4" />
              <span>{localUserVoteType === null ? downvotes : localUserVoteType === "down" ? downvotes + 1 : downvotes}</span>
            </button>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">{name}</h3>
        <p className="text-gray-600 mb-4">{description}</p>

        {authors.length > 0 && (
          <div className="flex items-center mb-4">
            <Users className="w-4 h-4 text-gray-500 mr-2" />
            <div className="flex flex-wrap gap-2">
              {authors.map((author, index) => (
                <span
                  key={index}
                  className="text-sm text-gray-700 font-medium"
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
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 bg-gray-50 p-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            <Breadcrumb
              items={location.items}
            />
          </div>
          <div className="flex gap-2">
            <Link
              href={`/${location.items[0].href}`}
              className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-semibold shadow-sm"
            >
              Discover
              <CircleArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
