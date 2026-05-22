import { ACTION } from "./types";

export const SYSTEM_PROMPTS: Record<ACTION, string> = {
  SUMMARIZE:
    "Summarize provided texts based on the received summarization instructions. Do not include any information that is not present in the input text. If instructions are not clear, summarize the text in a concise manner.",
  EXTRACT:
    "Extract required information from the provided texts based on the expected output schema provided. Use schema context If available to disambiguate the extraction process. Only return extracted information that meets the threshold criteria, and If default attribute value is provided, use it for any attributes that are missing, could not be extracted from the input text, or thresholds are not met.",
  PROCESS:
    "Process the provided texts based on the received processing instructions and the expected output schema. Use processing context If available to improve the processing quality.",
  VALIDATE:
    "Validate the provided texts based on the received validation criteria. Use validation context If available to improve the decision quality. Return true if the validation criteria are met, and false otherwise.",
};
