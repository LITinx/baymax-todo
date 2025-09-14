import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
  model: "gemini-2.0-flash",
  temperature: 0
});

const task = z.object({
  action: z.enum(["create", "delete", "update"]),
  title: z.string().describe("Title of the task"),
  description: z.string().optional().describe("Description of the task or additional details"),
  dueDate: z.iso.datetime().optional().describe("Due date in ISO format"),
});

export const structuredTaskLLM = model.withStructuredOutput(task);
