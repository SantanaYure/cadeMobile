import { useMemo } from "react";
import { AiSuggestion } from "../types";
import { useFiles } from "./useFiles";

type UseAiSuggestionsResult = {
  suggestions: AiSuggestion[];
  pendingSuggestions: AiSuggestion[];
  acceptSuggestion: (suggestion: AiSuggestion) => void;
  ignoreSuggestion: (suggestionId: string) => void;
};

/**
 * Acesso conveniente às sugestões da IA e às ações de aceitar/ignorar.
 */
export function useAiSuggestions(): UseAiSuggestionsResult {
  const { suggestions, acceptSuggestion, ignoreSuggestion } = useFiles();

  const pendingSuggestions = useMemo(
    () => suggestions.filter((suggestion) => suggestion.status === "pending"),
    [suggestions],
  );

  return { suggestions, pendingSuggestions, acceptSuggestion, ignoreSuggestion };
}
