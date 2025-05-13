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
  User,
  Menu,
  X,
} from "lucide-react";
import { useUser } from "../hooks/useUser";
import { ThemeSwitch } from "./ThemeToggle";

const Sidebar: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();

  const nav_links = [
    { href: "/", label: "Discover", icon: <Compass className="w-5 h-5" /> },
    {
      href: `/${user?.user_name}/chats`,
      label: "Messages",
      icon: <MessageSquareTextIcon className="w-5 h-5" />,
    },
    {
      href: `/${user?.user_name}/repositories`,
      label: "Repositories",
      icon: <Database className="w-5 h-5" />,
    },
    { href: `/${user?.user_name}/blogs`, label: "Blogs", icon: <BookOpen className="w-5 h-5" /> },
    { href: "/docs", label: "Docs", icon: <FileText className="w-5 h-5" /> },
  ];

  useEffect(() => {
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      // On desktop, adjust margin based on sidebar state
      if (window.innerWidth > 768) {
        mainContent.style.marginLeft = expanded ? "16rem" : "4rem";
      } else {
        // On mobile, remove margin completely
        mainContent.style.marginLeft = "0";
      }
    }

    // Handle body scroll when mobile menu is open
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [expanded, mobileOpen]);

  // Add window resize listener to handle responsive layout changes
  useEffect(() => {
    const handleResize = () => {
      const mainContent = document.getElementById("main-content");
      if (mainContent) {
        if (window.innerWidth > 768) {
          mainContent.style.marginLeft = expanded ? "16rem" : "4rem";
        } else {
          mainContent.style.marginLeft = "0";
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [expanded]);

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed   top-2 left-2 z-[60] p-2 rounded-md bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] md:hidden shadow-md"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 w-full  bg-background-light dark:bg-background-dark bg-opacity-50 z-[55] md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full shadow-md z-[55] transition-all duration-300 bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)]
          ${mobileOpen ? "w-full" : "w-16"} 
          ${expanded && !mobileOpen ? "w-80 " : ""} 
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0`}
        onMouseEnter={() => window.innerWidth > 768 && setExpanded(true)}
        onMouseLeave={() => window.innerWidth > 768 && setExpanded(false)}
      >
        <div className="flex flex-col h-full  ">
          {/* Logo section */}
          <div className="flex items-center  h-16 border-b border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] relative">
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
                className={`font-semibold text-[var(--color-foreground-light)] dark:text-[var(--color-foreground-dark)] absolute left-16 transition-opacity duration-300 ${expanded || mobileOpen ? "opacity-100" : "opacity-0"
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
                onClick={() => mobileOpen && setMobileOpen(false)}
                className={`flex items-center px-3 py-3 mx-2 rounded-md transition-colors duration-200 hover:bg-[var(--color-surface-light)] dark:hover:bg-[var(--color-surface-dark)] group ${pathname === link.href
                  ? "text-[var(--color-primary-light)] dark:text-[var(--color-primary-dark)] bg-[var(--color-muted-light)] dark:bg-[var(--color-muted-dark)]"
                  : "text-[var(--color-on-muted-light)] dark:text-[var(--color-on-muted-dark)] hover:text-[var(--color-foreground-light)] dark:hover:text-[var(--color-foreground-dark)]"
                  }`}
              >
                <div className="flex items-center justify-center">
                  {link.icon}
                </div>
                <span
                  className={`ml-4 font-medium text-sm whitespace-nowrap transition-opacity duration-300 ${expanded || mobileOpen ? "opacity-100" : "opacity-0"
                    }`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Bottom section */}
          <div className="py-4 px-3 relative">
            <div className="flex justify-center mb-2">
              {(expanded || mobileOpen) && <ThemeSwitch />}
            </div>

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
                  className={`ml-2 transition-opacity duration-300 whitespace-nowrap overflow-hidden text-[var(--color-foreground-light)] dark:text-[var(--color-foreground-dark)] ${expanded || mobileOpen ? "opacity-100" : "opacity-0"
                    }`}
                >
                  {user === null ? "Continue with GitHub" : user.user_name}
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
