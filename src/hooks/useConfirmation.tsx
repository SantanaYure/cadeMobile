import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AppEventName, notifyAppEvent } from "../events/appEvents";
import { ConfirmationRequest } from "../types";

type ConfirmationContextValue = {
  pendingConfirmation: ConfirmationRequest | null;
  requestConfirmation: (request: ConfirmationRequest) => void;
  confirm: () => void;
  cancel: () => void;
};

const ConfirmationContext = createContext<ConfirmationContextValue | null>(null);

/**
 * Centraliza o fluxo de confirmação de ações sensíveis.
 * Qualquer ação destrutiva ou que altere arquivos deve passar por aqui.
 */
export function ConfirmationProvider({ children }: { children: ReactNode }) {
  const [pendingConfirmation, setPendingConfirmation] =
    useState<ConfirmationRequest | null>(null);

  const requestConfirmation = useCallback((request: ConfirmationRequest) => {
    setPendingConfirmation(request);
    notifyAppEvent(AppEventName.USER_CONFIRMATION_REQUIRED, {
      title: request.title,
    });
  }, []);

  const confirm = useCallback(() => {
    setPendingConfirmation((current) => {
      if (current) {
        current.onConfirm();
        notifyAppEvent(AppEventName.USER_ACTION_CONFIRMED, {
          title: current.title,
        });
      }
      return null;
    });
  }, []);

  const cancel = useCallback(() => {
    setPendingConfirmation((current) => {
      if (current) {
        notifyAppEvent(AppEventName.USER_ACTION_CANCELLED, {
          title: current.title,
        });
      }
      return null;
    });
  }, []);

  const value = useMemo<ConfirmationContextValue>(
    () => ({ pendingConfirmation, requestConfirmation, confirm, cancel }),
    [pendingConfirmation, requestConfirmation, confirm, cancel],
  );

  return (
    <ConfirmationContext.Provider value={value}>
      {children}
    </ConfirmationContext.Provider>
  );
}

export function useConfirmation(): ConfirmationContextValue {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error("useConfirmation deve ser usado dentro de ConfirmationProvider");
  }
  return context;
}
