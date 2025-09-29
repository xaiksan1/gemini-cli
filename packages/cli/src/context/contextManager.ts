/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Note: This is a mock implementation for the "Théorie du Ménage" context manager.
// It simulates the future backend (Firestore + Cloud Functions) by keeping data in memory.
// This allows us to refactor the UI without a live backend.

/**
 * Represents a single entry in the conversation, aligned with what the Gemini API expects.
 */
export interface Message {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

// In-memory database to mock Firestore.
const mockConversationStore: Message[] = [];

/**
 * Simulates saving a new conversation entry to the backend.
 * In this mock, it just adds the entry to an in-memory array.
 *
 * @param prompt The user's prompt.
 * @param response The model's response.
 */
export async function saveConversationEntry(
  prompt: string,
  response: string,
): Promise<void> {
  console.log('[ContextManager-Mock] Saving entry...');
  mockConversationStore.push({
    role: 'user',
    parts: [{ text: prompt }],
  });
  mockConversationStore.push({
    role: 'model',
    parts: [{ text: response }],
  });
  console.log(
    `[ContextManager-Mock] Store size is now ${mockConversationStore.length} messages.`,
  );
}

/**
 * Simulates retrieving the most relevant context from the backend.
 * In this mock, it performs a very simple "semantic" search (keyword matching)
 * and returns the most recent messages if no match is found.
 *
 * @param currentPrompt The current user prompt to find relevant context for.
 * @returns A promise that resolves to an array of relevant messages.
 */
export async function retrieveContext(
  currentPrompt: string,
): Promise<Message[]> {
  console.log(
    `[ContextManager-Mock] Retrieving context for prompt: "${currentPrompt}"`,
  );

  const keywords = currentPrompt.toLowerCase().split(/\s+/);
  const relevantMessages = mockConversationStore.filter((message) => {
    const messageText = message.parts[0].text.toLowerCase();
    return keywords.some((keyword) => messageText.includes(keyword));
  });

  if (relevantMessages.length > 0) {
    console.log(
      `[ContextManager-Mock] Found ${relevantMessages.length} relevant messages via keyword search.`,
    );
    return relevantMessages;
  }

  // Fallback: return the last 10 messages if no context is found.
  console.log(
    '[ContextManager-Mock] No specific context found, returning recent history.',
  );
  const recentHistory = mockConversationStore.slice(-10);
  return recentHistory;
}

/**
 * Simulates retrieving the user's input history from the backend.
 * In this mock, it filters the in-memory store for user messages.
 *
 * @returns A promise that resolves to an array of user inputs.
 */
export async function retrieveInputHistory(): Promise<string[]> {
  console.log('[ContextManager-Mock] Retrieving input history...');
  const inputs = mockConversationStore
    .filter((message) => message.role === 'user')
    .map((message) => message.parts[0].text)
    .reverse(); // Newest first

  // Deduplicate consecutive identical messages
  const deduplicated: string[] = [];
  if (inputs.length > 0) {
    deduplicated.push(inputs[0]);
    for (let i = 1; i < inputs.length; i++) {
      if (inputs[i] !== inputs[i - 1]) {
        deduplicated.push(inputs[i]);
      }
    }
  }

  console.log(
    `[ContextManager-Mock] Found ${deduplicated.length} unique inputs.`,
  );
  return deduplicated;
}
