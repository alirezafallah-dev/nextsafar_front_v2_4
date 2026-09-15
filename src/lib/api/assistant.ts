import type { ChatHistoryItem, ChatResponse } from "@/types/assistant";

export async function sendChatMessage(
  message: string,
  history: ChatHistoryItem[],
): Promise<ChatResponse> {
  const res = await fetch("/api/assistant/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "خطا در گفتگو");
  return data;
}