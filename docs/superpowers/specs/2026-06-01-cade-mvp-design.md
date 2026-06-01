# Spec de Design — MVP do Cadê?

- **Data:** 2026-06-01
- **Status:** Aprovado
- **Stack:** Expo SDK 56, React Native 0.85, React 19.2, TypeScript (strict)
- **Documentos-fonte:** `.claude/cade-design-guide.md`, `.claude/cade-architecture.md`, `.claude/cade-product-scope.md`, `CLAUDE.md`

## 1. Objetivo

Entregar a primeira versão funcional do Cadê?, provando o fluxo principal do MVP:
abrir o app → selecionar arquivos → listar → buscar → filtrar por categoria → detectar
nomes parecidos → mostrar duplicatas → mostrar sugestões simuladas da IA → revisar
sugestões → confirmar antes de ações sensíveis.

Sem backend. Sem IA real. Sem chaves privadas. Código em inglês; textos de UI em PT-BR.

## 2. Decisões aprovadas

- **Navegação:** tela única (`HomeScreen`) + modais controlados por estado. Sem `expo-router`.
- **Dados:** botão "Carregar exemplos" (mock com duplicatas/versões) + seleção real via picker.
- **Persistência:** estado em memória (React Context). Sem persistência nesta versão.
- **Detalhes do arquivo:** modal/bottom sheet sobre a Home.
- **Estrutura:** `src/screens/` em vez de `src/app/` (não usamos Expo Router).
- **Estado global:** React Context mínimo (`FilesProvider`).
- **Regras de negócio:** serviços e utils puros, sem dependência de UI.
- **Event-driven:** constantes de evento tipadas + funções `handle*`, sem pub/sub completo.
- **Fontes:** Inter + Nunito Sans via `expo-font` + `@expo-google-fonts`, carregadas no boot e
  consumidas apenas via tokens de tipografia.

## 3. Dependências

Instalar via `npx expo install` (compatível com SDK 56):

| Lib | Para quê | Justificativa |
|-----|----------|---------------|
| `expo-document-picker` | Seleção nativa de arquivos | Feature central do MVP |
| `expo-font` | Carregar fontes no boot | Tipografia do design guide |
| `@expo-google-fonts/inter` | Fonte Inter | Títulos, botões, labels, cards, busca |
| `@expo-google-fonts/nunito-sans` | Fonte Nunito Sans | Textos de apoio, descrições, mensagens da IA |

- **Já embutido (sem instalar):** `@expo/vector-icons` para ícones.
- **Descartado:** `expo-file-system` (o `getDocumentAsync` já retorna `size` e `lastModified`),
  libs de estado/persistência/IA.

Carregamento das fontes centralizado em `App.tsx` via `useFonts`. Enquanto não carregadas,
renderiza um estado de carregamento simples (sem `expo-splash-screen` para evitar dependência extra).

## 4. Estrutura de pastas

```
src/
  components/
    ui/      Button, SearchInput, CategoryChip, EmptyState, LoadingSkeleton, ConfirmModal
    files/   FileCard, FileList, DuplicateWarning
    ai/      AiSuggestionCard, AiSuggestionBadge
    layout/  Screen, SectionHeader
  constants/ categories.ts, sampleFiles.ts
  events/    appEvents.ts
  hooks/     useFiles, useFileSearch, useAiSuggestions, useConfirmation
  screens/   HomeScreen, FileDetailsSheet
  services/
    files/   fileMetadataService, fileSimilarityService
    ai/      mockAiSuggestionService
  theme/     colors, typography, spacing, radius, shadows, index
  types/     file, category, ai, error, events, index
  utils/     formatFileSize, formatDate, normalizeFileName, calculateNameSimilarity
```

`App.tsx` carrega fontes → envolve a árvore no `FilesProvider` → renderiza `HomeScreen`.

## 5. Tokens de tema (`src/theme/`)

Valores extraídos do design guide. Proibido hardcode em componentes.

- **colors.ts**
  - `background: "#FEFEFE"`
  - `textPrimary: "#511E01"`
  - `textSecondary: "#7A6F66"`
  - `primary: "#FED809"` (botões/CTA principais)
  - `aiAccent: "#D3E601"` (status positivo / sugestões da IA)
  - `neutral: "#E5E2DC"` (bordas, divisores, inputs, cards suaves)
  - `danger: "#D92D20"`, `warning: "#F79009"`, `success: "#12B76A"`
- **typography.ts** — famílias `Inter_700Bold`, `Inter_600SemiBold`, `Inter_500Medium`,
  `NunitoSans_400Regular`. Estilos: `title` (28/Bold), `sectionTitle` (22/SemiBold),
  `cardTitle` (16/SemiBold), `button` (15/SemiBold), `label` (14/Medium),
  `body` (15/Regular), `support` (14/Regular), `emptyState` (16/Regular), `caption` (12/Regular).
- **spacing.ts** — `xs:4, sm:8, smd:12, md:16, lg:24, xl:32`.
- **radius.ts** — `card:16, button:12, input:14, chip:999, modal:20`.
- **shadows.ts** — sombra suave para cards (compatível Android: `elevation`).

## 6. Tipos (`src/types/`)

```ts
type FileCategory =
  | "all" | "work" | "academic" | "personal"
  | "financial" | "documents" | "images" | "duplicates" | "aiSuggestions";

type FileType = "pdf" | "docx" | "txt" | "csv" | "image" | "spreadsheet" | "other";

type FileItem = {
  id: string;
  name: string;
  uri: string;
  size: number;
  mimeType: string;
  type: FileType;
  category: FileCategory;
  updatedAt: string;   // ISO
  createdAt?: string;
};

type AiSuggestionKind =
  | "category" | "rename" | "duplicate" | "newerVersion";

type AiSuggestion = {
  id: string;
  fileId: string;
  kind: AiSuggestionKind;
  suggestedCategory?: FileCategory;
  suggestedName?: string;
  possibleDuplicateIds?: string[];
  confidence?: number;
  reason: string;      // PT-BR
  status: "pending" | "accepted" | "ignored";
};

type SimilarGroup = { id: string; fileIds: string[] };
type DuplicateGroup = { id: string; fileIds: string[]; reason: string };

type AppError = { userMessage: string; technicalMessage?: string; code?: string };

type ConfirmationRequest = {
  title: string;
  message: string;           // o que muda + qual arquivo + reversibilidade
  confirmLabel: string;
  variant: "default" | "danger";
  onConfirm: () => void;
};
```

`events.ts`: união `AppEvent` (nomes + payloads) usada para tipar os handlers.

## 7. Eventos (`src/events/appEvents.ts`)

Constantes tipadas (`as const`), sem barramento:
`FILES_SELECTED`, `SAMPLE_FILES_LOADED`, `FILES_SCANNED`, `AI_SUGGESTION_CREATED`,
`DUPLICATE_DETECTED`, `CATEGORY_CHANGED`, `SEARCH_CHANGED`, `FILE_RENAME_REQUESTED`,
`FILE_DELETE_REQUESTED`, `AI_SUGGESTION_ACCEPTED`, `AI_SUGGESTION_IGNORED`,
`USER_CONFIRMATION_REQUIRED`, `USER_ACTION_CONFIRMED`, `USER_ACTION_CANCELLED`.

## 8. Serviços (`src/services/`)

Puros, sem UI, retorno previsível.

### fileMetadataService (files)
- `fromPickerAsset(asset): FileItem` — mapeia `DocumentPickerAsset` → `FileItem`
  (gera `id`, deriva `type` e `category`, `updatedAt` a partir de `lastModified`).
- `getFileType(name, mimeType): FileType` — por extensão/MIME.
- `inferCategory(name, mimeType): FileCategory` — regra simples: imagens→`images`,
  pdf/doc/txt/csv→`documents`, senão `personal`.

### fileSimilarityService (files)
- `findSimilarGroups(files): SimilarGroup[]` — agrupa por `calculateNameSimilarity` acima de um limiar.
- `findPotentialDuplicates(files): DuplicateGroup[]` — duplicata = nome parecido **+**
  mesma extensão **+** (mesmo `size` **ou** datas próximas). `reason` em PT-BR.

### mockAiSuggestionService (ai)
- `generateSuggestions(files): AiSuggestion[]` — regras locais:
  - palavras-chave no nome → categoria provável (ex.: "nota/fatura/boleto"→`financial`,
    "relatorio/contrato/proposta"→`work`, "tcc/trabalho/aula/artigo"→`academic`);
  - nomes versionados (`v2`, `final`, `agora_vai`) → possível versão mais recente;
  - grupos de duplicata → possível duplicata;
  - nome "bagunçado" (maiúsculas/espaços/ruído) → sugestão de nome melhor.
  - Cada sugestão: `reason` em PT-BR, `confidence`, `status: "pending"`.

## 9. Utils (`src/utils/`)

- `formatFileSize(bytes): string` — pt-BR (ex.: "1,2 MB").
- `formatDate(iso): string` — pt-BR (dd/mm/aaaa).
- `normalizeFileName(name): string` — minúsculas, sem acento, sem extensão, sem marcadores de versão/separadores.
- `calculateNameSimilarity(a, b): number` — 0–1 sobre nomes normalizados.

## 10. Hooks (`src/hooks/`)

- `useFiles()` — consome `FilesProvider`: `files`, `loading`, `error`, e handlers
  (`handleFilesSelected`, `handleSampleFilesLoaded`, `handleFileRenameRequested`,
  `handleFileDeleteRequested`).
- `useFileSearch(files)` — aplica categoria ativa + busca (nome, tipo, categoria, texto da sugestão), memoizado.
- `useAiSuggestions(files)` — memoiza `generateSuggestions` + status (accept/ignore).
- `useConfirmation()` — `requestConfirmation(request)`, `confirm()`, `cancel()`.

## 11. Componentes

- **ui:** `Button` (variantes primary/secondary/danger, altura mín. 48), `SearchInput`
  (altura 48, placeholder "Buscar arquivos, categorias ou sugestões da IA"),
  `CategoryChip` (raio 999, estado ativo), `EmptyState`, `LoadingSkeleton` (cards, não spinner),
  `ConfirmModal`.
- **files:** `FileCard` (ícone do tipo, nome, tipo, categoria, tamanho, data de atualização,
  alerta de duplicata, status da IA), `FileList` (`FlatList`), `DuplicateWarning`.
- **ai:** `AiSuggestionCard` (fundo suave com destaque `#D3E601`, `reason`, ações revisar),
  `AiSuggestionBadge`.
- **layout:** `Screen` (safe area + padding lateral 16), `SectionHeader`.

Linguagem da IA: assistiva ("Sugestão", "Possível duplicata", "Você pode revisar antes de
aplicar"). Nunca autoritativa.

## 12. HomeScreen

Uma `FlatList` (arquivos recentes); as demais seções vão no `ListHeaderComponent` para
evitar lista virtualizada aninhada. Ordem por prioridade visual:

1. Título "Cadê?"
2. `SearchInput` (destaque)
3. Chips de categoria (scroll horizontal)
4. Botões: **Selecionar arquivos** (primário) / **Carregar exemplos** (secundário)
5. Sugestões da IA (`AiSuggestionCard`)
6. Arquivos recentes (`FileList`)
7. Duplicatas (`DuplicateWarning`)
8. Barra de ações em lote

Estados: vazio (`EmptyState`), carregando (`LoadingSkeleton`), erro (mensagem do `AppError`).

## 13. FileDetailsSheet (modal)

Mostra metadados completos, sugestões da IA do arquivo, duplicatas relacionadas e ações
(renomear, excluir, aceitar sugestão) — todas roteadas pela confirmação.

## 14. Ações sensíveis (sempre confirmação)

`ConfirmModal` exibe o que muda, qual arquivo e se é reversível. Cobre: aceitar/ignorar
sugestão, renomear, excluir, aplicar em lote. Nesta versão a mutação é **simulada** no
estado em memória (excluir remove; renomear troca o nome; aceitar aplica categoria/nome e
marca `accepted`).

## 15. Erros e validação

- Picker e geração de sugestões em `try/catch` → `AppError` com `userMessage` claro
  (ex.: "Não foi possível selecionar os arquivos. Tente novamente.").
- Sem runner de testes (não pedido / não configurado). Funções puras ficam isoladas para
  teste futuro.
- Validação: `npx tsc --noEmit` e `npx expo start`.

## 16. Critério de conclusão

É possível abrir o app, selecionar/carregar arquivos, ver a lista, buscar, filtrar por
categoria, ver duplicatas, ver sugestões simuladas da IA e passar por uma etapa de
confirmação antes de ações sensíveis.

## 17. Fora de escopo nesta versão

Persistência real, IA real, seleção de pasta completa, automação sem revisão, exclusão
automática de duplicatas, monitoramento de pasta, login/sync/nuvem, categorias customizadas,
preview avançado, backend.
