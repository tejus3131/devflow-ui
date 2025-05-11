import React from "react";
import { ContentCard, ContentCardProps } from "./ContentCard";

interface ContentListProps {
  items: ContentCardProps[];
}

export default function ContentList({ items }: ContentListProps) {
  return (
    <div className=" w-full bg-background-light dark:bg-background-dark   p-6   space-y-6">
      {items.map((item, index) => (
        <ContentCard key={index} {...item} />
      ))}
    </div>
  );
}
