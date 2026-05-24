import { GoogleGenAI, GoogleGenAIOptions } from "@google/genai";
import {
  BooleanParseSchema,
  ExtractActionArgs,
  GenerateTextActionArgs,
  LLMActionsInterface,
  LLMGeminiProviderArgs,
  ParsingOutputError,
  ProcessActionArgs,
  SummarizeActionArgs,
  ValidateActionArgs,
} from "./types";
import { SYSTEM_PROMPTS } from "./constants";
import { z } from "zod";

export class GeminiInterface implements LLMActionsInterface {
  private llm: GoogleGenAI;
  private model: string;
  constructor(opts: Omit<LLMGeminiProviderArgs, "provider">) {
    const { model, client } = opts;
    this.llm = client;
    this.model = model;
  }

  async summarize(args: SummarizeActionArgs): Promise<string> {
    const defaultInstructions = `Make copntent clear, and around 50% of the original length.`;
    try {
      const response = await this.llm.models.generateContent({
        model: this.model,
        contents: `Input: "${args.input}"\n\nInstructions: "${args.instructions ?? defaultInstructions}"\n\n${args.desiredAvgTokenLength ? `Desired average token length: ${args.desiredAvgTokenLength}` : ""}`,
        config: {
          systemInstruction: SYSTEM_PROMPTS["SUMMARIZE"],
        },
      });

      return response.text ?? String(args.defaultOutput) ?? "";
    } catch (e) {
      if (args.throwOnError) {
        throw e;
      }
      return String(args.defaultOutput) ?? "";
    }
  }

  async extract<T>(args: ExtractActionArgs): Promise<T> {
    const {
      input,
      extractionContext,
      desiredOutput,
      confidenceScoreThreshold,
      defaultAttributeValue,
      errorOnExtractionFailed,
    } = args;

    try {
      const response = await this.llm.models.generateContent({
        model: this.model,
        contents: `Text to extract from: "${input}"\n\n${extractionContext ? `Extraction context: "${extractionContext}"\n\n` : ""}\n\n${confidenceScoreThreshold ? `Confidence score threshold: ${confidenceScoreThreshold}\n\n` : ""}${defaultAttributeValue ? `Default attribute value: ${defaultAttributeValue}\n\n` : ""}`,
        config: {
          systemInstruction: SYSTEM_PROMPTS["EXTRACT"],
          responseMimeType: "application/json",
          responseSchema: desiredOutput.toJSONSchema(),
        },
      });

      const generated = response.text ?? "{}";

      return this.validateGeneratedSchema<T>(generated, desiredOutput);
    } catch (e) {
      if (e instanceof ParsingOutputError) {
        if (errorOnExtractionFailed) {
          throw e;
        }
      }
      if (args.throwOnError) {
        throw e;
      }
      return {} as T;
    }
  }

  async process<T>(args: ProcessActionArgs): Promise<T> {
    const { input, instructions, processingContext, desiredOutput } = args;
    try {
      const response = await this.llm.models.generateContent({
        model: this.model,
        contents: `Text to process: "${input}"\n\nInstructions: "${instructions}"\n\n${processingContext ? `Processing context: "${processingContext}"\n\n` : ""}`,
        config: {
          systemInstruction: SYSTEM_PROMPTS["PROCESS"],
          responseMimeType: "application/json",
          responseSchema: desiredOutput.toJSONSchema(),
        },
      });

      const generated = response.text ?? "{}";
      return this.validateGeneratedSchema<T>(generated, desiredOutput);
    } catch (e) {
      if (args.throwOnError) {
        throw e;
      }
      return {} as T;
    }
  }

  async validate(args: ValidateActionArgs): Promise<boolean> {
    const { input, validation, validationContext } = args;
    try {
      const response = await this.llm.models.generateContent({
        model: this.model,
        contents: `Text to validate: "${input}"\n\nValidation criteria: "${validation}"\n\n${validationContext ? `Validation context: "${validationContext}"\n\n` : ""}`,
        config: {
          systemInstruction: SYSTEM_PROMPTS["VALIDATE"],
          responseMimeType: "application/json",
          responseSchema: BooleanParseSchema.toJSONSchema(),
        },
      });

      const generated = response.text ?? "false";
      const result = this.validateGeneratedSchema<
        z.infer<typeof BooleanParseSchema>
      >(generated, BooleanParseSchema);
      return result.value;
    } catch (e) {
      if (args.throwOnError) {
        throw e;
      }
      return false;
    }
  }

  async generateText(args: GenerateTextActionArgs): Promise<string> {
    const { prompt, systemPrompt } = args;
    try {
      const response = await this.llm.models.generateContent({
        model: this.model,
        contents: prompt,
        config: {
          systemInstruction: systemPrompt,
        },
      });

      return response.text ?? "";
    } catch (e) {
      if (args.throwOnError) {
        throw e;
      }
      return "";
    }
  }

  private validateGeneratedSchema<T>(
    generated: string,
    schema: z.ZodObject<any>,
  ): T {
    try {
      let cleanedOutput = generated.trim();
      const jsonMatch = cleanedOutput.match(/```(?:json)?\s*([\s\S]*?)\s*```/);

      if (jsonMatch) {
        cleanedOutput = jsonMatch[1].trim();
      }

      const parsed = JSON.parse(cleanedOutput);
      return schema.parse(parsed) as T;
    } catch (e) {
      throw new ParsingOutputError(
        `Failed to parse generated output as JSON. Error: ${e instanceof Error ? e.message : String(e)}. Generated output: ${generated}`,
        generated,
      );
    }
  }
}
