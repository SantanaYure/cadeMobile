/**
 * Eventos do app nomeados explicitamente (programação orientada a eventos).
 * Nesta primeira versão não há um barramento pub/sub: as constantes documentam
 * o fluxo e `notifyAppEvent` registra os eventos em modo de desenvolvimento.
 */
export const AppEventName = {
  FILES_SELECTED: "FILES_SELECTED",
  SAMPLE_FILES_LOADED: "SAMPLE_FILES_LOADED",
  FILES_SCANNED: "FILES_SCANNED",
  FILES_CLEARED: "FILES_CLEARED",
  AI_SUGGESTION_CREATED: "AI_SUGGESTION_CREATED",
  DUPLICATE_DETECTED: "DUPLICATE_DETECTED",
  CATEGORY_CHANGED: "CATEGORY_CHANGED",
  SEARCH_CHANGED: "SEARCH_CHANGED",
  FILE_RENAME_REQUESTED: "FILE_RENAME_REQUESTED",
  FILE_DELETE_REQUESTED: "FILE_DELETE_REQUESTED",
  AI_SUGGESTION_ACCEPTED: "AI_SUGGESTION_ACCEPTED",
  AI_SUGGESTION_IGNORED: "AI_SUGGESTION_IGNORED",
  USER_CONFIRMATION_REQUIRED: "USER_CONFIRMATION_REQUIRED",
  USER_ACTION_CONFIRMED: "USER_ACTION_CONFIRMED",
  USER_ACTION_CANCELLED: "USER_ACTION_CANCELLED",
} as const;

export type AppEventName = (typeof AppEventName)[keyof typeof AppEventName];

export function notifyAppEvent(
  name: AppEventName,
  payload?: Record<string, unknown>,
): void {
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log(`[event] ${name}`, payload ?? "");
  }
}
