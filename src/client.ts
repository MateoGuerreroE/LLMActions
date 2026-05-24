import { GeminiInterface } from "./IGemini";
import { LLMActionClientArgs, LLMActionsInterface } from "./types";

export class LLMActions {
  private interface: LLMActionsInterface;
  constructor(args: LLMActionClientArgs) {
    switch (args.provider) {
      case "gemini":
        this.interface = new GeminiInterface({
          client: args.client,
          model: args.model,
        });
        break;
      default:
        throw new Error(`Unsupported provider: ${args.provider}`);
    }
  }
}
