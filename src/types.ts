import z from "zod";

export type SummarizeActionArgs = {
  input: string;
  instructions?: string;
  desiredAvgTokenLength?: number;
};

export type ExtractActionArgs = {
  input: string;
  extractionContext?: string;
  desiredOutput: z.ZodObject;
  confidenceScoreThreshold?: number;
  defaultAttributeValue?: unknown;
  errorOnExtractionFailed?: boolean;
};

export type ProcessActionArgs = {
  input: string;
  instructions: string;
  processingContext?: string;
  desiredOutput: z.ZodObject;
};

export type ValidateActionArgs = {
  input: string;
  validation: string;
  validationContext?: string;
};

export type GenerateTextActionArgs = {
  prompt: string;
  systemPrompt: string;
};
