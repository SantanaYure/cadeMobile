# CADÊ? PROJECT INSTRUCTIONS

## Project Context

Cadê? is a mobile app built with Expo React Native and TypeScript for smart file management.

The app helps users find, organize, categorize, and review files with AI assistance, reducing clutter, duplicates, confusing versions, and wasted time.

The AI must act as an assistant. It can analyze and suggest, but the user must always review before any real change is applied to files.

## Core Documents

Before working on the project, use these documents as source of truth:

* `.claude/cade-design-guide.md`
* `.claude/cade-architecture.md`
* `.claude/cade-product-scope.md`

Use `CLAUDE.md` as the operating guide for how to work. Use the files above for product, design, and architecture decisions.

## Expo

Expo has changed.

Before writing, modifying, or suggesting any code related to Expo, read the versioned documentation for the SDK used in this project:

https://docs.expo.dev/versions/v56.0.0/

Do not use legacy Expo patterns without validating them in the correct versioned documentation.

## Design

Before creating or modifying any screen, visual component, color, font, spacing, border, shadow, button, card, input, chip, modal, or interface state, read and follow:

`.claude/cade-design-guide.md`

The design must convey:

* Simplicity
* Trust
* Organization
* User control

## Design Tokens Rule

Do not hardcode visual values directly into components.

Colors, fonts, sizes, spacing, borders, shadows, and visual states must come from centralized tokens.

Before using any visual value, check for or create tokens in:

* `src/theme/colors.ts`
* `src/theme/typography.ts`
* `src/theme/spacing.ts`
* `src/theme/radius.ts`
* `src/theme/shadows.ts`

Avoid this:

```typescript
backgroundColor: "#FED809"
fontSize: 16
borderRadius: 12
marginTop: 24
```

Prefer this:

```typescript
backgroundColor: colors.primary
fontSize: typography.cardTitle.fontSize
borderRadius: radius.button
marginTop: spacing.lg
```

If a token does not exist yet, create it in the correct file before using it.

## Architecture

Before creating or modifying folder structures, data flows, services, hooks, stores, navigation, AI integrations, or file logic, read and follow:

`.claude/cade-architecture.md`

Do not create new layers, folders, patterns, abstractions, or dependencies without checking the defined architecture first.

The project must follow:

* Clean Code
* SOLID principles
* Event-oriented programming
* Clear TypeScript types
* English names for variables, functions, files, folders, and code entities

User-facing texts may be written in Brazilian Portuguese.

## Product Scope

Before adding new features or expanding the MVP, read and follow:

`.claude/cade-product-scope.md`

Prioritize the MVP flow before adding advanced automation.

Prioritize:

* Fast search
* File listing
* Categories
* AI suggestions
* Similar name detection
* Potential duplicates
* Confirmation before sensitive actions

Avoid in the MVP, unless explicitly requested:

* Full automation without review
* Automatically deleting duplicates
* Real-time folder monitoring
* Complex cloud integrations
* Major architecture refactors
* Backend implementation
* Advanced file preview

## Visual Architecture

UI components must be reusable.

Avoid duplicating styles across screens.

Prefer creating components in:

* `src/components/ui/`
* `src/components/files/`
* `src/components/ai/`
* `src/components/layout/`

Examples:

* `Button`
* `SearchInput`
* `FileCard`
* `CategoryChip`
* `EmptyState`
* `LoadingSkeleton`
* `AiSuggestionCard`
* `ConfirmModal`

## Rules for Screens

When creating a screen:

1. Check the current project structure.
2. Reuse existing components.
3. Use theme tokens.
4. Create loading, error, and empty states.
5. Keep the screen simple and readable.
6. Avoid placing heavy business logic inside the screen.
7. Prioritize Android.
8. Do not add unnecessary dependencies.

## Rules for AI in the Product

The AI can suggest:

* Categories
* New names
* Potential duplicates
* Potential newer versions
* Folder organization
* Tags
* File content summaries

The AI must not apply changes automatically without user review.

Every action such as moving, renaming, deleting, or replacing files must request confirmation.

Use careful language:

* “Suggestion”
* “Potential duplicate”
* “This looks like a financial document”
* “You can review this before applying”
* “This might be the latest version”

Avoid authoritative language:

* “File automatically fixed”
* “The AI decided to move this file”
* “This file is wrong”
* “Organization completed without review”

## Implementation

Make small, clear, and verifiable changes.

Before editing multiple files, explain the plan.

Do not refactor the architecture unnecessarily.

Do not rewrite entire files if a small change solves the issue.

Do not install new libraries without justification.

When possible, run or provide validation commands.

## TypeScript

Use TypeScript with clear typing.

Avoid `any`, except when strictly justified.

Create reusable types for:

* Files
* Categories
* AI suggestions
* Analysis states
* User actions
* Events
* App errors

Prefer clear and readable names.

## Environment Variables

This is a front-mobile Expo project.

Do not add private keys, API secrets, database credentials, service role keys, or AI provider keys to the mobile app.

Only use public Expo variables with the `EXPO_PUBLIC_` prefix.

Never add these to the front-mobile `.env`:

* `GEMINI_API_KEY`
* `OPENAI_API_KEY`
* `DATABASE_URL`
* `SUPABASE_SERVICE_ROLE_KEY`
* Private tokens
* Passwords
* Secret credentials

The `.env` file must not be committed to GitHub.

Only `.env.example` should be committed.

## Dependencies

Before installing any new dependency:

1. Check if the project already has a solution.
2. Check compatibility with Expo SDK 56.
3. Justify why the dependency is necessary.
4. Prefer small, focused libraries.
5. Avoid heavy UI kits or unnecessary abstractions.

Do not add backend, cloud, or AI SDK dependencies to the mobile front unless explicitly requested.

## Action Safety

Since the app handles files, treat destructive actions with care.

These actions must always require confirmation:

* Deleting files
* Moving files
* Renaming files
* Replacing files
* Applying AI suggestions in batch

When in doubt, prefer preview or simulation before the actual action.

## Privacy

The app handles user files, so privacy must be treated as part of the product and architecture.

Do not send file content to AI without making clear what will be analyzed.

Prefer local analysis for simple metadata:

* File name
* Type
* Size
* Created date
* Updated date

Only analyze internal file content when it is necessary for better suggestions and when the user understands the action.

The AI should use the minimum amount of data necessary.

## Validation

After making changes, validate when possible.

Useful commands may include:

```bash
npx expo start
npx tsc --noEmit
npm run lint
```

Only suggest commands that match the actual project setup.

## Final Rule

Keep the project simple.

Do not over-engineer.

The MVP must prove the main user flow first:

1. Add or select files
2. List files
3. Search files
4. Filter by category
5. Detect similar names
6. Show potential duplicates
7. Show AI suggestions
8. Ask for confirmation before sensitive actions

The architecture should grow by real need, not by excessive planning.
