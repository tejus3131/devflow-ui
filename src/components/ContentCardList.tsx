import React from "react";
import { ContentCard, ContentCardProps } from "./ContentCard";

interface ContentListProps {
  items: ContentCardProps[];
}

export default function ContentList({ items }: ContentListProps) {
  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-lg space-y-6">
      {items.map((item, index) => (
        <ContentCard key={index} {...item} />
      ))}
    </div>
  );
}
