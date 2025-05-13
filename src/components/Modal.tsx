'use client'
import React, { useEffect, useCallback, useState } from "react";
import { useModal } from "../hooks/useModal";

type ModalVariants = "small" | "large";

const Modal = ({
  tag,
  children,
  heading,
  modalClass,
  closable = true,
  closeButton = true,
  variant = "small",
  fixedHeight = false,
}: {
  tag: string;
  children: React.ReactNode;
  heading: string;
  modalClass?: string;
  closable?: boolean;
  closeButton?: boolean;
  variant?: ModalVariants;
  fixedHeight?: boolean;
}) => {
  const { isOpen, closeModal } = useModal();
  // Track animation state separately from modal visibility
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  const close = useCallback(() => {
    if (closable) {
      // Start closing animation
      setIsVisible(false);
      // Delay actual closing to allow animation to complete
      setTimeout(() => {
        closeModal(tag);
      }, 300); // Animation duration
    } else {
      console.error("Modal is not closable");
    }
  }, [closable, closeModal, tag]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen(tag)) {
        close();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup event listener when component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [close, isOpen, tag]);

  // Control the render status and animation based on isOpen
  useEffect(() => {
    if (isOpen(tag)) {
      setShouldRender(true);
      // Small delay to allow DOM to update before starting animation
      setTimeout(() => {
        setIsVisible(true);
      }, 10);
    } else {
      setIsVisible(false);
      // Remove from DOM after animation completes
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, tag]);

  if (!shouldRender) return null;

  const headingId = `modal-heading-${tag}`;
  const contentId = `modal-content-${tag}`;

  const modalSizeClass = variant === "small" ? "min-w-[320px] sm:min-w-[480px]" : "min-w-[480px] sm:min-w-[960px]";

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[rgba(0,0,0,0.8)] text-[var(--color-foreground-light)] dark:text-[var(--color-foreground-dark)] transition-opacity duration-300 ease-in-out ${isVisible ? "opacity-100" : "opacity-0"
        }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={headingId}
      aria-describedby={contentId}
      onClick={closable ? close : undefined}
    >
      {/* Modal */}
      <article
        className={`rounded-lg z-50 max-h-full overflow-y-auto bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)] text-[var(--color-foreground-light)] dark:text-[var(--color-foreground-dark)] border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] transition-all duration-300 ease-in-out ${modalSizeClass} ${isVisible
          ? "opacity-100 scale-100 translate-y-0"
          : "opacity-0 scale-95 translate-y-4"
          } ${fixedHeight ? "h-screen" : "h-auto"}`}
        itemScope
        itemType="https://schema.org/WebPageElement"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Modal header with border bottom */}
        <header className="border-b border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] py-5 px-5">
          <div className="flex items-center justify-between">
            <h2
              id={headingId}
              className="text-xl sm:text-2xl font-semibold text-[var(--color-foreground-light)] dark:text-[var(--color-foreground-dark)] px-2"
              itemProp="name"
            >
              {heading}
            </h2>
            {closeButton && closable && (
              <button
                onClick={close}
                className="text-center ml-4  text-red-400 flex items-center justify-center w-7 h-7 rounded-full hover:bg-[var(--color-border-light)] dark:hover:bg-[var(--color-border-dark)] transition-colors"
                aria-label="Close modal"
                type="button"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>
        </header>

        {/* Modal content */}
        <section
          id={contentId}
          className={`p-6 sm:p-8 ${modalClass || ''}`}
          itemProp="mainContentOfPage"
        >
          {children}
        </section>
      </article>
    </div>
  );
};

export default Modal;