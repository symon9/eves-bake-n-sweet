"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import Modal from "@/components/Modal";

type ModalContent = {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
};

type ModalContextType = {
  showModal: (content: ModalContent) => void;
  hideModal: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ModalContent | null>(null);

  const showModal = (content: ModalContent) => {
    setModalContent(content);
    setIsOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
    // Add a small delay to allow the exit animation to complete before clearing content
    setTimeout(() => {
      setModalContent(null);
    }, 300);
  };

  const handleConfirm = () => {
    if (modalContent?.onConfirm) {
      modalContent.onConfirm();
    }
    hideModal();
  };

  const handleCancel = () => {
    if (modalContent?.onCancel) {
      modalContent.onCancel();
    }
    hideModal();
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      {modalContent && (
        <Modal
          isOpen={isOpen}
          onClose={handleCancel}
          title={modalContent.title}
        >
          <p className="text-gray-600 mb-6">{modalContent.message}</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold"
            >
              {modalContent.cancelText || "Cancel"}
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 text-white font-semibold"
            >
              {modalContent.confirmText || "Confirm"}
            </button>
          </div>
        </Modal>
      )}
    </ModalContext.Provider>
  );
};
