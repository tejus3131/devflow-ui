'use client';

import { createContext, useContext, useState, ReactNode } from "react";

export interface ModalContextType {
  modals: Record<string, boolean>;
  isOpen: (modalName: string) => boolean;
  openModal: (modalName: string) => void;
  closeModal: (modalName: string) => void;
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modals, setModals] = useState<Record<string, boolean>>({});

  const openModal = (modalName: string) => {
    setModals((prev) => {
      const newModals = { ...prev, [modalName]: true };
      return newModals;
    });
  };

  const closeModal = (modalName: string) => {
    setModals((prev) => ({ ...prev, [modalName]: false }));
  };

  const isOpen = (modalName: string) => {
    return modals[modalName] || false;
  };

  return (
    <ModalContext.Provider value={{ modals, isOpen, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};