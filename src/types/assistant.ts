export interface ChatHistoryItem {
  role: "user" | "assistant";
  content: string;
}

import type { TripEntity } from "@/types/map";

export interface ChatResponse {
  type: "plan" | "answer";
  text: string;
  plan_id?: number;
  input?: Record<string, any>;
  suggestions?: string[];
  cached?: boolean;
  entities?: TripEntity[]; 
  panel_title?: string; 
}

export interface ChatMessageItem {
  id: string;
  role: "user" | "assistant";
  kind: "text" | "plan";
  text: string;
  planId?: number;
  suggestions?: string[];
}