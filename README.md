# llm-actions

A small TypeScript library that provides common LLM actions (summarize, extract, process, validate and generate text) with a thin adapter for Google Gemini visa the `@google/genai` client.

## Features

- High-level actions: `summarize`, `extract`, `process`, `validate`, `generateText`
- Schema-based extraction and processing using `zod` JSON schemas
- Opinionated system prompts for each action
- Pluggable provider adapter (currently: Gemini / `@google/genai`)

## Installation

This project is authored in TypeScript and uses `pnpm` for development.

Install dependencies and build:

```bash
pnpm install
pnpm build
```

Note: `@google/genai` is a peer dependency — include it in consuming projects when using the Gemini provider.

```bash
pnpm add @google/genai
```

## Quick Usage

Example using Google Gemini (`@google/genai`):

```ts
import { GoogleGenAI } from "@google/genai";
import { LLMActions } from "llm-actions";

const client = new GoogleGenAI({ apiKey: process.env.GENAI_API_KEY });
const actions = new LLMActions({
  provider: "gemini",
  client,
  model: "models/text-bison-001",
});

// Summarize
const summary = await actions.summarize({ input: "Long text to summarize" });

// Extract to a zod schema
// await actions.extract({ input, desiredOutput: myZodSchema, ... })

// Process and validate similarly
```

## API Overview

- `summarize(args: SummarizeActionArgs): Promise<string>`, concise summarization with optional instructions and length hints.
- `extract<T>(args: ExtractActionArgs): Promise<T>`, extracts structured JSON validated against a provided `zod` schema.
- `process<T>(args: ProcessActionArgs): Promise<T>`, process text into a structured output using a `zod` schema.
- `validate(args: ValidateActionArgs): Promise<boolean>`, returns `true`/`false` against validation criteria.
- `generateText(args: GenerateTextActionArgs): Promise<string>`, general text generation with a custom system prompt.

See `src/types.ts` for detailed TypeScript definitions.

## Development

- Build: `pnpm build` (runs `tsc`)
- Tests: none included

## Author & License

Author: MateoGuerreroE

License: ISC
