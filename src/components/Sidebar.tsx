"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import GitHubAuthButton from "./GitHubAuthButton";
import {
  Compass,
  FileText,
  Database,
  BookOpen,
  MessageSquareTextIcon,
} from "lucide-react";
import { useUser } from "../hooks/useUser";
import { ThemeSwitch } from "./ThemeToggle";

const Sidebar: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();

  const nav_links = [
    { href: "/", label: "Discover", icon: <Compass className="w-5 h-5" /> },
    {
      href: "/messages",
      label: "Messages",
      icon: <MessageSquareTextIcon className="w-5 h-5" />,
    },
    {
      href: "/repository",
      label: "Repository",
      icon: <Database className="w-5 h-5" />,
    },
    { href: "/blogs", label: "Blogs", icon: <BookOpen className="w-5 h-5" /> },
    { href: "/docs", label: "Docs", icon: <FileText className="w-5 h-5" /> },
  ];

  useEffect(() => {
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.style.marginLeft = expanded ? "16rem" : "4rem"; // Adjust margin dynamically
    }
  }, [expanded]);

  return (
    <aside
      className={`fixed top-0 left-0 h-full shadow-md z-50 transition-all duration-300 bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)] ${
      expanded ? "w-64" : "w-16"
      }`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="flex flex-col h-full">
      {/* Logo with fixed positioning */}
      <div className="flex items-center h-16 border-b border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] relative">
        <Link href="/" className="flex items-center">
        <div className="w-16 flex justify-center items-center">
          <Image
          src="/logo.png"
          alt="Logo"
          width={32}
          height={32}
          className="h-8 w-8"
          />
        </div>
        <span
          className={`font-semibold text-[var(--color-foreground-light)] dark:text-[var(--color-foreground-dark)] absolute left-16 transition-opacity duration-300 ${
          expanded ? "opacity-100" : "opacity-0"
          }`}
        >
          DevFlow
        </span>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 flex flex-col space-y-2">
        {nav_links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`flex items-center px-3 py-3 mx-2 rounded-md transition-colors duration-200 hover:bg-[var(--color-surface-light)] dark:hover:bg-[var(--color-surface-dark)] group ${
          pathname === link.href
            ? "text-[var(--color-primary-light)] dark:text-[var(--color-primary-dark)] bg-[var(--color-muted-light)] dark:bg-[var(--color-muted-dark)]"
            : "text-[var(--color-on-muted-light)] dark:text-[var(--color-on-muted-dark)] hover:text-[var(--color-foreground-light)] dark:hover:text-[var(--color-foreground-dark)]"
          }`}
        >
          <div className="flex items-center justify-center">
          {link.icon}
          </div>
          <span
          className={`ml-4 font-medium text-sm whitespace-nowrap transition-opacity duration-300 ${
            expanded ? "opacity-100" : "opacity-0"
          }`}
          >
          {link.label}
          </span>
        </Link>
        ))}
      </div>

      {/* Search and Auth at bottom with fixed positioning */}
      <div className="py-4 px-3 relative">
        
        {expanded ? <ThemeSwitch /> : <></>}
        <div className="flex items-center mt-2">
        <div
          className="flex items-center w-full cursor-pointer"
          onClick={() =>
          document.getElementById("github-auth-button")?.click()
          }
        >
          <div className="flex justify-center items-center min-w-[40px]">
          <GitHubAuthButton id="github-auth-button" />
          </div>
          <div
          className={`ml-2 transition-opacity duration-300 whitespace-nowrap overflow-hidden text-[var(--color-foreground-light)] dark:text-[var(--color-foreground-dark)] ${
            expanded ? "opacity-100" : "opacity-0"
          }`}
          >
          {user === null ? "Continue with GitHub" : user.user_name}
          </div>
        </div>
        </div>
      </div>
      </div>
    </aside>
  );
};

export default Sidebar;
