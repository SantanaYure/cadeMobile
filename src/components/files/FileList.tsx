import { type ReactElement } from "react";
import {
  FlatList,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { spacing } from "../../theme";
import { AiSuggestionStatus, FileItem } from "../../types";
import { FileCard } from "./FileCard";

type FileListProps = {
  files: FileItem[];
  onFilePress: (file: FileItem) => void;
  duplicateFileIds: Set<string>;
  suggestionStatusByFileId: Record<string, AiSuggestionStatus>;
  ListHeaderComponent?: ReactElement | null;
  ListFooterComponent?: ReactElement | null;
  ListEmptyComponent?: ReactElement | null;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

/**
 * Lista de arquivos performática (FlatList). As seções da Home (busca, chips,
 * sugestões, duplicatas) entram via header/footer para evitar listas aninhadas.
 */
export function FileList({
  files,
  onFilePress,
  duplicateFileIds,
  suggestionStatusByFileId,
  ListHeaderComponent,
  ListFooterComponent,
  ListEmptyComponent,
  contentContainerStyle,
}: FileListProps) {
  return (
    <FlatList
      data={files}
      keyExtractor={(file) => file.id}
      renderItem={({ item }) => (
        <FileCard
          file={item}
          onPress={onFilePress}
          isDuplicate={duplicateFileIds.has(item.id)}
          suggestionStatus={suggestionStatusByFileId[item.id]}
        />
      )}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      ListEmptyComponent={ListEmptyComponent}
      contentContainerStyle={[styles.content, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    />
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.smd,
    paddingBottom: spacing.xl,
  },
});
