import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

const models = {
  openai: [
    "gpt-4-turbo",
    "gpt-4-turbo-2024-04-09",
    "gpt-4-turbo-preview",
    "gpt-4-0125-preview",
    "gpt-4-1106-preview",
    "gpt-4",
    "gpt-4-0613",
    "gpt-4-32k",
    "gpt-4-32k-0613",
    "gpt-3.5-turbo-0125",
    "gpt-3.5-turbo",
    "gpt-3.5-turbo-1106",
    "gpt-4o",
  ],
  anthropic: [
    "claude-3-opus-20240229",
    "claude-3-sonnet-20240229",
    "claude-3-haiku-20240307",
  ],
  google: ["gemini-1.5-pro", "gemini-1.0-pro"],
};

class LLMRequestManager {
  private openAiAPIKey = "";
  private openAiObject: OpenAI | null = null;
  private anthropicObject: Anthropic | null = null;

  private constructor() {
    this.anthropicObject = new Anthropic({
      apiKey: process.env["REACT_APP_ANTHROPIC_API_KEY"],
      dangerouslyAllowBrowser: true,
    });
  }

  public static shared = new LLMRequestManager();

  async requestOpenAIAPI(
    model: string,
    systemPrompt: string,
    userPrompt: string,
    max_tokens: number,
    temperature: number,
    n: number
  ) {
    if (this.openAiAPIKey === "" || this.openAiObject === null) {
      window.alert("You should update the API Key");
      return;
    }
    try {
      const response = await this.openAiObject.chat.completions.create({
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: max_tokens,
        temperature: temperature,
        n: n,
      });
      return response;
    } catch (err) {
      throw new Error(`OpenAI Request Error: ${err}`);
    }
  }

  async requestAnthropicAPI(
    systemPrompt: string,
    userPrompt: string,
    temperature: number
  ) {
    if (this.anthropicObject === null) {
      window.alert("Anthropic Object not initialized");
      return;
    }
    try {
      const response = await this.anthropicObject.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: userPrompt,
              },
            ],
          },
        ],
        temperature: temperature,
      });
      return response;
    } catch (err) {
      throw new Error(`Claude Request Error: ${err}`);
    }
  }
}

export default LLMRequestManager;
