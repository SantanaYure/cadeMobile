# CADÊ? MVP SCOPE

## Product Vision

Cadê? is a mobile app for smart file management.

The goal of the MVP is to help users find, view, categorize, and review files with AI assistance, reducing wasted time, messy organization, duplicated versions, and location difficulties.

The AI should act as an assistant. It analyzes and suggests, but the user always decides before any actual changes are made.

## Validated Problem

Users have recurring difficulties finding important files, even when trying to keep folders organized.

The main pain points are:

* Files saved in the wrong locations
* Clutter accumulating in the Downloads folder
* Lack of standardized file names
* Duplicated or similar versions
* Wasted time searching for documents
* Uncertainty about which file is the most recent

Version and duplicate control is a major pain point, as 83.3% of surveyed users reported issues with different versions of the same file.

## Primary Persona

Carlos, the Overwhelmed Professional.

Carlos uses a computer daily, works with documents, spreadsheets, and reports, searches for files almost every day, and wants to find any file in seconds without having to remember where he saved it.

He values:

* Fast search
* Simple interface
* Automatic or semi-automatic organization
* Version and duplicate control
* Minimal manual effort

## MVP Objective

Create a functional first version that allows users to:

1. Select files
2. List files in the app
3. Search files quickly
4. Categorize files
5. Display important metadata
6. Detect similar names
7. Show potential duplicates
8. Display simulated or initial AI suggestions
9. Allow user review before any sensitive action

## Features Within the MVP

### 1. Home Screen

The home screen must show:

* Prominent search field
* Category chips
* List of recent or added files
* AI suggestions area
* Potential duplicates area

Visual priority:

1. Search
2. Categories
3. AI suggestions
4. Recent files
5. Potential duplicates

### 2. File Selection

The user must be able to select files using the device's native file picker.

The MVP must allow selecting files such as:

* PDF
* DOCX
* TXT
* CSV
* Images
* Spreadsheets, if supported by the file picker

In this first version, selecting an entire folder is not mandatory.

### 3. File Listing

Each file must appear in a card featuring:

* File type icon
* File name
* Type
* Category
* Size
* Update date
* AI status, when applicable
* Potential duplicate alert, when applicable

### 4. Search

The search feature must allow finding files by:

* Name
* Type
* Category
* Simple terms related to the file
* AI suggestions, when applicable

Placeholder:

```txt
Search files, categories, or AI suggestions

```

### 5. Initial Categories

The MVP must use fixed categories:

* All
* Work
* Academic
* Personal
* Financial
* Documents
* Images
* Duplicates
* AI Suggestions

Custom categories are out of scope for the MVP.

### 6. Manual Categorization

The user must be able to manually change a file's category.

Full automatic categorization is out of scope for the MVP, but the app can display a category suggested by the AI.

### 7. AI Suggestions

In the MVP, the AI can suggest:

* Probable category
* Better potential name
* Potential duplicate
* Potential newer version
* Short justification

Every suggestion must have a status:

* Pending
* Accepted
* Ignorated

The AI must never apply changes without confirmation.

### 8. Similar Name Detection

The MVP must detect files with similar names.

Example:

```txt
relatorio_final.docx
relatorio_final_v2.docx
relatorio_FINAL_agora_vai.docx

```

The app must show a warning like:

```txt
We found files with very similar names.

```

### 9. Potential Duplicates

The MVP must identify potential duplicates using simple criteria:

* Similar name
* Same size
* Same type
* Close dates
* Same extension

Automatic deletion of duplicates is out of scope for the MVP.

### 10. File Details

The user must be able to open a screen or modal featuring:

* Name
* Type
* Size
* Category
* Creation date, if available
* Update date
* AI suggestions
* Related potential duplicates

### 11. Confirmation of Sensitive Actions

The following actions always require confirmation:

* Rename
* Move
* Delete
* Replace
* Apply batch AI suggestions

Before confirming, the app must show:

* What will change
* Which file will be affected
* Whether the action can be undone or not

## Primary User Flow

1. User opens the app
2. User selects files
3. App lists the files
4. App identifies metadata
5. App organizes by categories
6. User uses search or filters
7. App shows potential duplicates
8. App shows AI suggestions
9. User reviews suggestions
10. User accepts, ignores, or edits manually

## Out of Scope for the MVP

Do not include in this first version:

* Automatic organization without review
* Automatic deletion of duplicates
* Real-time monitoring of the Downloads folder
* Full folder selection, if it requires high native complexity
* Full version history
* Cloud backup
* Login and registration
* Cross-device synchronization
* Custom categories
* PWA
* Drag-and-drop
* Advanced inline previewing of PDFs, images, or spreadsheets
* Integration with Google Drive, OneDrive, or Dropbox
* Full backend
* Web dashboard

## AI Rules in the MVP

The AI must be assistive, not automatic.

It can say:

* “Suggestion”
* “Potential duplicate”
* “This looks like a financial document”
* “This might be the latest version”
* “You can review this before applying”

It must not say:

* “File automatically fixed”
* “The AI decided to move this file”
* “This file is wrong”
* “Organization completed without review”

## Minimum File Data

Each file must have, at a minimum:

```ts
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

```

## Minimum AI Suggestion Data

```ts
type AiSuggestion = {
  id: string;
  fileId: string;
  suggestedCategory?: FileCategory;
  suggestedName?: string;
  possibleDuplicateIds?: string[];
  confidence?: number;
  reason: string;
  status: "pending" | "accepted" | "ignored";
};

```

## MVP Success Criteria

The MVP will be considered successful if the user can:

* Add files to the app
* Find files using search
* Filter by category
* View important file information
* Identify similar files
* Review AI suggestions
* Clearly understand the outcome before any sensitive action

## Recommended Implementation Order

1. Create theme tokens
2. Create base visual components
3. Create home screen
4. Create file selection
5. Create file listing
6. Create search
7. Create categories
8. Create file details
9. Create simple similar name detection
10. Create AI suggestions area with mocked data
11. Create confirmation for sensitive actions
12. Persist data locally
13. Integrate real AI only after the interface is validated

## Final MVP Rule

The MVP must prove the core flow before trying to automate everything.

First, Cadê? must help the user see, search, and review their files.

Later, in future versions, the app can automate organization, folder monitoring, and advanced version control.