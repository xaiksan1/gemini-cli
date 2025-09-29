/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from 'react';
import { retrieveInputHistory } from '../../context/contextManager.js';

export interface UseInputHistoryStoreReturn {
  inputHistory: string[];
  addInput: (input: string) => void;
  initializeHistory: () => Promise<void>;
}

/**
 * Hook for independently managing input history.
 * Completely separated from chat history and unaffected by /clear commands.
 * It now uses the central ContextManager to load initial history.
 */
export function useInputHistoryStore(): UseInputHistoryStoreReturn {
  const [inputHistory, setInputHistory] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  /**
   * Initialize input history from the context manager.
   * Executed only once at app startup.
   */
  const initializeHistory = useCallback(async () => {
    if (isInitialized) return;

    try {
      // Retrieve history from the new "living database" (via the mock manager)
      const pastMessages = await retrieveInputHistory(); // Returns newest first
      // The useInputHistory hook expects oldest first for navigation
      setInputHistory(pastMessages.reverse());
      setIsInitialized(true);
    } catch (error) {
      console.warn(
        'Failed to initialize input history from Context Manager:',
        error,
      );
      setInputHistory([]);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  /**
   * Add new input to history for the current session.
   * This is for immediate feedback (arrow keys). The persistence is handled
   * by the context manager when the conversation turn is saved.
   */
  const addInput = useCallback((input: string) => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    // Add to the end (making it the most recent), removing previous occurrences.
    setInputHistory((prevHistory) => {
      const newHistory = prevHistory.filter((item) => item !== trimmedInput);
      newHistory.push(trimmedInput);
      return newHistory;
    });
  }, []);

  return {
    inputHistory,
    addInput,
    initializeHistory,
  };
}
