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

const ModalContext = createContext<((modal: ModalState | null) => void) | null>(
  null,
);

/**
 * Provides modal state and renders the active modal.
 * Wrap your app with this provider to enable the `useModal` hook.
 */
export function ModalProvider({ children }: PropsWithChildren) {
  const [modal, setModal] = useState<ModalState | null>(null);

  return (
    <ModalContext.Provider value={setModal}>
      <Dialog
        open={Boolean(modal)}
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

/**
 * Hook to open modals imperatively.
 * `show(render)` returns a Promise that resolves with:
 * - the value passed to `close(value)` from your dialog, or
 * - `null` if the modal is dismissed (ESC, click outside, close button).
 */
export function useModal() {
  const setModal = useModalContext();

  function show<T>(renderFn: (close: (value: T) => void) => React.ReactNode) {
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

  return {
    show,
  };
}

function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModalContext must be used within a ModalProvider");
  }
  return context;
}
