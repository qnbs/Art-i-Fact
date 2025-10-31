import React, { createContext, useState, useContext, useCallback } from 'react';

interface ModalContextType {
  showModal: (title: string, content: React.ReactNode, onCloseCallback?: () => void) => void;
  hideModal: () => void;
  isOpen: boolean;
  modalContent: { title: string; content: React.ReactNode };
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{ title: string; content: React.ReactNode }>({ title: '', content: null });
  const [onCloseAction, setOnCloseAction] = useState<(() => void) | null>(null);

  const showModal = useCallback((title: string, content: React.ReactNode, onCloseCallback?: () => void) => {
    setModalContent({ title, content });
    if (onCloseCallback) {
      setOnCloseAction(() => onCloseCallback);
    }
    setIsOpen(true);
  }, []);

  const hideModal = useCallback(() => {
    if (onCloseAction) {
      onCloseAction();
    }
    setOnCloseAction(null);
    setIsOpen(false);
  }, [onCloseAction]);

  return (
    <ModalContext.Provider value={{ showModal, hideModal, isOpen, modalContent }}>
      {children}
      {/* 
        The Modal component is no longer rendered here.
        It is now rendered in AppLayout.tsx, which is a descendant of AppProvider.
        This ensures that any content rendered inside the modal has access to AppContext.
       */}
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
