"use client";

import {
  createContext,
  type PropsWithChildren,
  useContext,
  useState,
} from "react";

import { Dialog } from "@/components/ui/dialog";

type ModalState = {
  renderContent: () => React.ReactNode;
  cancel: () => void;
};

const ModalContext = createContext<{
  modal: ModalState | null;
  setModal: (modal: ModalState | null) => void;
}>({
  modal: null,
  setModal: () => {},
});

export function ModalRoot({ children }: PropsWithChildren) {
  const [modal, setModal] = useState<ModalState | null>(null);

  return (
    <ModalContext.Provider value={{ modal, setModal }}>
      <Dialog
        open={Boolean(modal?.renderContent)}
        onOpenChange={() => {
          // resolve with `null` when the modal is closed by clicking outside, from the X button, or by pressing ESC
          modal?.cancel();
        }}
      >
        {modal ? modal.renderContent() : null}
      </Dialog>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const { setModal } = useModalContext();

  function showModal<T>(
    renderFn: (close: (value: T) => void) => React.ReactNode,
  ) {
    return new Promise<T | null>((resolve) => {
      const cancel = () => {
        setModal(null);
        resolve(null);
      };
      const close = (value: T) => {
        setModal(null);
        resolve(value);
      };
      setModal({ renderContent: () => renderFn(close), cancel });
    });
  }

  function closeModal() {
    setModal(null);
  }

  return {
    showModal,
    closeModal,
  };
}

function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModalContext must be used within a ModalProvider");
  }
  return context;
}
