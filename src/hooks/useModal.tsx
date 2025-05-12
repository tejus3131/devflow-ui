'use client';
import { useContext } from "react";
import { ModalContextType, ModalContext } from "@/context/ModalContext";

export const useModal = (): ModalContextType => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("useModal must be used within a ModalProvider");
    }
    return context;
};
