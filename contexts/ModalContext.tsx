import React, { createContext, useState, useContext, useCallback } from 'react';
import { Modal } from '../components/Modal';
import { ToastContainer } from '../components/ui/Toast';

interface ModalContextType {
  showModal: (title: string, content: React.ReactNode) => void;
  hideModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{ title: string; content: React.ReactNode }>({ title: '', content: null });

  const showModal = useCallback((title: string, content: React.ReactNode) => {
    setModalContent({ title, content });
    setIsOpen(true);
  }, []);

  const hideModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      <Modal isOpen={isOpen} onClose={hideModal} title={modalContent.title}>
        {modalContent.content}
      </Modal>
      <ToastContainer />
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};