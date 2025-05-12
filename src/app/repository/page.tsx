'use client';
import PageHeader from "../../components/PageHeader";
import ContentCardList from "../../components/ContentCardList";
import { ContentCardProps } from "../../components/ContentCard";
import Button from "@/components/Button";
import { useModal } from "@/hooks/useModal";
const demoData: ContentCardProps[] = [
  {
    name: "Repository A",
    description: "A repository containing core utilities.",
    location: {
      items: [
        { label: "Alice Johnson", href: "/alice-johnson" },
        { label: "Repository A", href: "/alice-johnson/repo-a" },
      ],
    },
    type: "Repository",
    authors: ["Alice Johnson"],
    tags: ["Core", "Utilities"],
    upvotes: 15,
    downvotes: 2,
    userVote: null,
    className: "",
  },
  {
    name: "Button",
    description: "Reusable UI components for the project.",
    location: {
      items: [
        { label: "Alice Johnson", href: "/alice-johnson" },
        { label: "Repository A", href: "/alice-johnson/repo-a" },
        { label: "Button", href: "/alice-johnson/repo-a/button" },
      ],
    },
    type: "Component",
    authors: ["Alice Johnson"],
    tags: ["UI", "React"],
    upvotes: 25,
    downvotes: 1,
    userVote: "up",
    className: "",
  },
  {
    name: "React + Tailwind CSS",
    description: "Configuration files for the project setup lorem.",
    location: {
      items: [
        { label: "Alice Johnson", href: "/alice-johnson" },
        { label: "Repository A", href: "/alice-johnson/repo-a" },
        { label: "Button", href: "/alice-johnson/repo-a/button" },
        {
          label: "React + Tailwind CSS",
          href: "/alice-johnson/repo-a/button/react-tailwindcss",
        },
      ],
    },
    type: "Configuration",
    authors: ["Alice Johnson"],
    tags: ["Config", "Setup"],
    upvotes: 10,
    downvotes: 0,
    userVote: null,
    className: "",
  },
  {
    name: "Dark Mode Theme",
    description: "A flavour for dark mode support.",
    location: {
      items: [
        { label: "Alice Johnson", href: "/alice-johnson" },
        { label: "Repository A", href: "/alice-johnson/repo-a" },
        { label: "Button", href: "/alice-johnson/repo-a/button" },
        {
          label: "React + Tailwind CSS",
          href: "/alice-johnson/repo-a/button/react-tailwindcss",
        },
        {
          label: "Dark Mode",
          href: "/alice-johnson/repo-a/button/react-tailwindcss/dark-mode",
        },
      ],
    },
    type: "Flavour",
    authors: ["Alice Johnson"],
    tags: ["Theme", "Dark Mode"],
    upvotes: 30,
    downvotes: 3,
    userVote: "down",
    className: "",
  },
];
export default function Page() {

  const {openModal} = useModal();
  const sampleBreadcrumbs = {
    items: [
      { label: "Alice Johnson", href: "/alice-johnson" },
      { label: "Repository A", href: "/alice-johnson/repo-a" },
      { label: "Button", href: "/alice-johnson/repo-a/button" },
      {
        label: "React + Tailwind CSS",
        href: "/alice-johnson/repo-a/button/react-tailwindcss",
      },
      {
        label: "Dark Mode",
        href: "/alice-johnson/repo-a/button/react-tailwindcss/dark-mode",
      },
    ],
  };

  return (
    <>
      <PageHeader
        breadcrumbs={sampleBreadcrumbs}
        title="Project Details"
        rightComponent={
          <Button
            variant="primary"
            className="px-5 py-3"
            onClick={() => openModal("career")}
          >
            Create New
          </Button>
        }
      />
   
      <ContentCardList items={demoData} />
    </>
  );
}
