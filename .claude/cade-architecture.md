## CADÊ? ARCHITECTURE

### Goal of the Architecture

The architecture of Cadê? must be simple, organized, and easy to maintain.
The project must follow Clean Code, SOLID, and event-driven programming principles, keeping names clear, intuitive, and in English.
The priority is to allow new features to be added without cluttering screens, components, business logic, or AI integrations.

### General Principles

* Simple code before complex code
* Clear names before unnecessary comments
* Small functions with a single responsibility
* Reusable components
* Business logic kept outside of screens
* Explicit events for important actions
* Well-defined TypeScript types
* Variables, functions, files, and folders in English
* No hardcoded visual values in components
* No sensitive actions without user confirmation
* Global state only when absolutely necessary
* Privacy as part of the architecture

### Code Language

All code must use English.

**Correct examples:**

```typescript
const selectedFile = file;
const suggestedCategory = "work";
const duplicatedFiles = findSimilarFiles(files);
const handleFileSelection = () => {};

```

**Avoid:**

```typescript
const arquivoSelecionado = arquivo;
const categoriaSugerida = "trabalho";
const arquivosDuplicados = buscarArquivosParecidos(arquivos);
const lidarComSelecaoDeArquivo = () => {};

```

User-facing text may remain in Portuguese.

### Clean Code

The code must be readable without relying heavily on comments.

**Prefer:**

```typescript
const hasSimilarName = compareFileNames(currentFile.name, existingFile.name);

```

**Avoid:**

```typescript
const x = compare(a, b);

```

**Rules:**

* Use descriptive names
* Avoid long functions
* Avoid overly large components
* Avoid logic duplication
* Separate UI, business logic, and infrastructure
* Create helpers when a rule starts to repeat
* Do not mix AI logic directly into visual components

### SOLID

#### Single Responsibility Principle

Each file, function, hook, or component must have a clear responsibility.

* *Example:* `FileCard` displays a file, `useFiles` manages file state, `fileSimilarityService` compares names and duplicates, and `aiSuggestionService` generates suggestions using AI.

#### Open/Closed Principle

The code should allow extension without requiring unnecessary modifications to already stable parts.

* *Example:* It should be possible to add new categories to a configuration list without modifying multiple components.

#### Liskov Substitution Principle

Types and interfaces must be predictable. If a function expects a `FileItem`, any object matching that contract must work correctly.

#### Interface Segregation Principle

Avoid oversized types. Prefer smaller interfaces:

```typescript
type FileMetadata = {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  updatedAt: string;
};

type FileSuggestion = {
  fileId: string;
  suggestedCategory: FileCategory;
  suggestedName?: string;
  reason: string;
};

```

#### Dependency Inversion Principle

Screens and components must not depend directly on infrastructure details. Prefer relying on services, hooks, or interfaces.

**Example:**

```typescript
const suggestions = await aiSuggestionService.generateSuggestions(files);

```

Avoid calling SDKs, APIs, or heavy logic directly inside the screen.

### Event-Driven Programming

Important app actions must be treated as clear events.

**Examples of events:**

* FILE_SELECTED
* FOLDER_SELECTED
* FILES_SCANNED
* FILE_ANALYSIS_STARTED
* FILE_ANALYSIS_FINISHED
* AI_SUGGESTION_CREATED
* DUPLICATE_DETECTED
* FILE_RENAME_REQUESTED
* FILE_MOVE_REQUESTED
* FILE_DELETE_REQUESTED
* USER_CONFIRMATION_REQUIRED
* USER_ACTION_CONFIRMED
* USER_ACTION_CANCELLED

Events should be used to make the execution flow more explicit and easier to maintain.

**Example function names:**

* `handleFolderSelected()`
* `handleFileAnalysisStarted()`
* `handleAiSuggestionAccepted()`
* `handleFileRenameRequested()`
* `handleUserConfirmationCancelled()`

### Suggested Folder Structure

```text
src/
  app/
  components/
    ui/
    files/
    ai/
    layout/
  constants/
  events/
  hooks/
  services/
    files/
    ai/
    storage/
  theme/
  types/
  utils/

```

### Folder Responsibilities

#### src/app

Routes and main screens using Expo Router. Screens must be lightweight and coordinate components, hooks, and services.

#### src/components/ui

Generic, reusable components.

* *Examples:* Button, Input, SearchInput, Modal, Chip, EmptyState, LoadingSkeleton

#### src/components/files

Components related to files.

* *Examples:* FileCard, FileList, FileActionsMenu, FileMetadataView, DuplicateWarning

#### src/components/ai

Components related to AI suggestions.

* *Examples:* AiSuggestionCard, AiSuggestionBadge, AiAnalysisStatus, AiSuggestionReview

#### src/hooks

Reusable hooks for state and behavior.

* *Examples:* useFiles, useFileSearch, useFileSelection, useAiSuggestions, useConfirmationModal

#### src/services

Business rules, integrations, and processing logic.

* *Examples:* fileScannerService, fileSimilarityService, fileMetadataService, aiSuggestionService, localStorageService

#### src/events

App events and event types.

* *Examples:* fileEvents.ts, aiEvents.ts, userActionEvents.ts

#### src/theme

Visual tokens for the app.

* *Examples:* colors.ts, typography.ts, spacing.ts, radius.ts, shadows.ts

#### src/types

Global project types.

* *Examples:* file.ts, category.ts, ai.ts, events.ts

#### src/utils

Small, pure functions.

* *Examples:* formatFileSize, formatDate, normalizeFileName, calculateNameSimilarity

### Rules for Components

Components must:

* Have English names
* Be small and reusable
* Receive data via props
* Avoid direct service calls
* Avoid heavy business logic
* Use theme tokens
* Have clear states when necessary

**Example:**

```jsx
<FileCard
  file={file}
  suggestion={suggestion}
  onPress={handleFilePress}
  onRenameRequest={handleFileRenameRequested}
/>

```

### Rules for Services

Services must:

* Centralize business logic
* Have clear names
* Be testable
* Not depend on visual components
* Return predictable data
* Avoid hidden side effects

**Example:**

```typescript
const similarFiles = fileSimilarityService.findSimilarFiles({
  targetFile,
  files,
});

```

### Rules for Variables and Names

Use clear, purposeful names in English.

**Prefer:**

* selectedFile
* availableCategories
* similarFiles
* latestUpdatedFile
* pendingAiSuggestions
* confirmedUserAction

**Avoid:**

* data
* item
* obj
* temp
* res
* arr
* info

Generic names are only acceptable in very small, obvious contexts.

### Rules for TypeScript Types

Create explicit types for key entities.

**Examples:**

```typescript
type FileCategory =
  | "all"
  | "work"
  | "academic"
  | "personal"
  | "financial"
  | "documents"
  | "images"
  | "duplicates"
  | "aiSuggestions";

type FileItem = {
  id: string;
  name: string;
  uri: string;
  size: number;
  mimeType: string;
  category: FileCategory;
  updatedAt: string;
  createdAt?: string;
};

type AiSuggestion = {
  id: string;
  fileId: string;
  suggestedCategory?: FileCategory;
  suggestedName?: string;
  possibleDuplicateIds?: string[];
  confidence: number;
  reason: string;
  status: "pending" | "accepted" | "ignored";
};

```

### Global State

Avoid unnecessary global state. Use local state when data belongs exclusively to a single screen or component. Use hooks or a global store only for data shared across multiple parts of the app.

**Global state can be used for:**

* Loaded files
* Selected folder
* Active filters
* Current search
* AI suggestions
* Selected files
* Actions pending confirmation

**Avoid placing in the global state:**

* Local visual states
* Modals specific to a single screen
* Temporary input values
* Data that does not need to be shared

### Error Handling

Every error must have a clear message for the user and a separate technical detail for debugging. Never hide an error silently.

**Avoid generic messages like:**

* “Unexpected error”
* “Something went wrong”
* “Failure”

**Prefer more helpful messages:**

* “Could not analyze this folder. Please try again.”
* “We could not read this file.”
* “Unable to generate AI suggestions right now.”
* “This file cannot be renamed at the moment.”

Technical errors must be kept separate from the user-facing message.

```typescript
type AppError = {
  userMessage: string;
  technicalMessage?: string;
  code?: string;
};

```

### Rules for Sensitive Actions

The following actions always require confirmation:

* Deleting a file
* Moving a file
* Renaming a file
* Replacing a file
* Applying batch AI suggestions

Before executing the action, show:

* What will change
* Which file will be affected
* Whether the action can be undone or not
* Buttons to confirm or cancel

### AI Integration

AI must be isolated within its own services. Avoid AI logic inside screens or components.

**Prefer:**

```typescript
aiSuggestionService.generateFileSuggestions(files);

```

The AI can make suggestions, but it must not decide on its own. Every suggestion must include:

* Associated file
* Suggested action
* Short justification
* Confidence level, when applicable
* Status: pending, accepted, or ignored

### Testability

Business rules must live in services or utilities to make testing easier. Whenever possible, critical functions should be pure, predictable, and free of UI dependencies.

The following must be easy to test:

* Name normalization
* Name comparison
* Duplicate detection
* Categorization
* Sorting
* Filtering
* Searching
* Date formatting
* File size formatting

**Prefer:**

```typescript
const similarityScore = calculateNameSimilarity(fileA.name, fileB.name);

```

Avoid complex logic directly inside components.

### Performance

Avoid reprocessing large lists on every render. Use memoization when dealing with:

* Searching
* Filtering
* Sorting
* Comparing many files
* Grouping by category
* Duplicate detection
* Suggestion calculations

Screens should avoid rendering unnecessary content. For file lists, prefer React Native's native performance-oriented list components, such as `FlatList`.

**Avoid:**

* Filtering large lists directly inside the JSX
* Performing heavy calculations during render
* Recreating functions unnecessarily inside large lists
* Reprocessing files without actual data changes

### Privacy

Since Cadê? handles user files, privacy must be treated as a core part of the architecture. Do not send file content to the AI without making it clear what will be analyzed.

Before any external analysis, the user must understand:

* Which file will be analyzed
* What type of information will be read
* What the purpose of the analysis is
* If the content will be sent to an external service

Whenever possible, prefer local analysis for simple metadata, such as:

* File name
* Type
* Size
* Creation date
* Update date

Internal file content should only be analyzed when necessary to generate better suggestions. The AI must work with the minimum required data.

### Final Rule

Before creating a new folder, pattern, dependency, or abstraction, check if the current structure already solves the problem. The architecture should grow out of real necessity, not over-engineering.

## MVP Libraries

### Libraries

Before installing or suggesting any new library, read:

`.claude/cade-architecture.md`

Do not install dependencies without justifying the need, verifying compatibility with Expo SDK 56, and explaining exactly where the library will be used.