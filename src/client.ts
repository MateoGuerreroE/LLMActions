import { GeminiInterface } from "./IGemini";
import { LLMActionsArgs } from "./types";

export class LLMActions {
  model;
  constructor(args: LLMActionsArgs) {
    switch (args.provider) {
      case "gemini":
        this.model = new GeminiInterface(args.providerOptions);
        break;
      default:
        throw new Error(`Unsupported provider: ${args.provider}`);
    }
  }
}
