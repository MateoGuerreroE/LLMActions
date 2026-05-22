import z from "zod";
import { GeminiInterfaceOptions } from "./IGemini";

type BaseTextInputArgs = {
  input: string;
  throwOnError?: boolean;
  defaultOutput?: unknown;
};

export type LLMProviderOptions = GeminiInterfaceOptions;

export type LLMActionsArgs = {
  provider: "gemini";
  providerOptions: LLMProviderOptions;
};

export type ACTION = "SUMMARIZE" | "EXTRACT" | "PROCESS" | "VALIDATE";

export type SummarizeActionArgs = BaseTextInputArgs & {
  instructions?: string;
  desiredAvgTokenLength?: number;
};

export type ExtractActionArgs = BaseTextInputArgs & {
  extractionContext?: string;
  desiredOutput: z.ZodObject;
  confidenceScoreThreshold?: number;
  defaultAttributeValue?: unknown;
  errorOnExtractionFailed?: boolean;
};

export type ProcessActionArgs = BaseTextInputArgs & {
  instructions: string;
  processingContext?: string;
  desiredOutput: z.ZodObject;
};

export type ValidateActionArgs = BaseTextInputArgs & {
  validation: string;
  validationContext?: string;
};

export type GenerateTextActionArgs = {
  prompt: string;
  systemPrompt: string;
  throwOnError?: boolean;
};

export abstract class LLMActionsInterface {
  abstract summarize(args: SummarizeActionArgs): Promise<string>;
  abstract extract<T>(args: ExtractActionArgs): Promise<T>;
  abstract process<T>(args: ProcessActionArgs): Promise<T>;
  abstract validate(args: ValidateActionArgs): Promise<boolean>;
  abstract generateText(args: GenerateTextActionArgs): Promise<string>;
}

export class ParsingOutputError extends Error {
  generatedOutput: string;
  constructor(message: string, generatedOutput: string) {
    super(message);
    this.generatedOutput = generatedOutput;
  }
}

export const BooleanParseSchema = z.object({
  value: z.boolean(),
});
