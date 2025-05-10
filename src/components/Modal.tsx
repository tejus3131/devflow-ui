/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useEffect, useCallback } from "react";
import { useModalContext } from "../context/ModalContext";

const Modal = ({
  tag,
  children,
  heading,
  modalClass,
  closable = true,
}: {
  tag: string;
  children: React.ReactNode;
  heading: string;
  modalClass?: string;
  closable?: boolean;
}) => {

  const { modals, isOpen, closeModal } = useModalContext();

  const close = useCallback(() => {
    if (closable) {
      closeModal(tag);
    } else {
      console.error("Modal is not closable");
    }
  }, [closable, closeModal, tag]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    
    // Cleanup event listener when component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [close]);

  if (!isOpen(tag)) return null;

  const headingId = `modal-heading-${tag}`;
  const contentId = `modal-content-${tag}`;

  return (
    <div 
        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)] text-[var(--color-foreground-light)] dark:text-[var(--color-foreground-dark)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        aria-describedby={contentId}
    >
        {/* Modal */}
        <article 
            className="rounded-lg w-full max-w-4xl p-6 sm:p-8 z-50 relative max-h-full overflow-y-auto bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)] text-[var(--color-foreground-light)] dark:text-[var(--color-foreground-dark)] border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]"
            itemScope
            itemType="https://schema.org/WebPageElement"
        >
            <header className="flex items-center justify-between mb-4 relative">
                <h2 
                    id={headingId}
                    className="text-xl sm:text-3xl font-semibold w-full text-center text-[var(--color-foreground-light)] dark:text-[var(--color-foreground-dark)]"
                    itemProp="name"
                >
                    {heading}
                </h2>
                {closable && (
                    <button
                        onClick={close}
                        className="absolute right-0 text-2xl text-[var(--color-foreground-light)] dark:text-[var(--color-foreground-dark)]"
                        aria-label="Close modal"
                        type="button"
                    >
                        ✖
                    </button>
                )}
            </header>

            <section 
                id={contentId} 
                className={`${modalClass || ''}`}
                itemProp="mainContentOfPage"
            >
                {children}
            </section>
        </article>
    </div>
  );
};

export default Modal;
