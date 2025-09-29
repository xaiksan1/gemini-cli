/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { act, renderHook } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, type Mock } from 'vitest';
import { useInputHistoryStore } from './useInputHistoryStore.js';
import { retrieveInputHistory } from '../../context/contextManager.js';

vi.mock('../../context/contextManager.js', () => ({
  retrieveInputHistory: vi.fn(),
}));

const mockedRetrieveInputHistory = retrieveInputHistory as Mock;

describe('useInputHistoryStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with empty input history', () => {
    const { result } = renderHook(() => useInputHistoryStore());

    expect(result.current.inputHistory).toEqual([]);
  });

  it('should add input to history', () => {
    const { result } = renderHook(() => useInputHistoryStore());

    act(() => {
      result.current.addInput('test message 1');
    });

    expect(result.current.inputHistory).toEqual(['test message 1']);

    act(() => {
      result.current.addInput('test message 2');
    });

    expect(result.current.inputHistory).toEqual([
      'test message 1',
      'test message 2',
    ]);
  });

  it('should not add empty or whitespace-only inputs', () => {
    const { result } = renderHook(() => useInputHistoryStore());

    act(() => {
      result.current.addInput('');
    });

    expect(result.current.inputHistory).toEqual([]);

    act(() => {
      result.current.addInput('   ');
    });

    expect(result.current.inputHistory).toEqual([]);
  });

  it('should deduplicate consecutive identical messages', () => {
    const { result } = renderHook(() => useInputHistoryStore());

    act(() => {
      result.current.addInput('test message');
    });

    act(() => {
      result.current.addInput('test message'); // Same as previous
    });

    expect(result.current.inputHistory).toEqual(['test message']);

    act(() => {
      result.current.addInput('different message');
    });

    act(() => {
      result.current.addInput('test message'); // Same as first, but not consecutive
    });

    expect(result.current.inputHistory).toEqual([
      'test message',
      'different message',
      'test message',
    ]);
  });

  it('should initialize from context manager successfully', async () => {
    mockedRetrieveInputHistory.mockResolvedValue([
      'newest',
      'middle',
      'oldest',
    ]);

    const { result } = renderHook(() => useInputHistoryStore());

    await act(async () => {
      await result.current.initializeHistory();
    });

    // Should reverse the order to oldest first
    expect(result.current.inputHistory).toEqual(['oldest', 'middle', 'newest']);
    expect(mockedRetrieveInputHistory).toHaveBeenCalledTimes(1);
  });

  it('should handle initialization failure gracefully', async () => {
    mockedRetrieveInputHistory.mockRejectedValue(
      new Error('Context manager error'),
    );

    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { result } = renderHook(() => useInputHistoryStore());

    await act(async () => {
      await result.current.initializeHistory();
    });

    expect(result.current.inputHistory).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to initialize input history from Context Manager:',
      expect.any(Error),
    );

    consoleSpy.mockRestore();
  });

  it('should initialize only once', async () => {
    mockedRetrieveInputHistory.mockResolvedValue(['message1', 'message2']);

    const { result } = renderHook(() => useInputHistoryStore());

    // Call initializeHistory twice
    await act(async () => {
      await result.current.initializeHistory();
    });

    await act(async () => {
      await result.current.initializeHistory();
    });

    // Should be called only once
    expect(mockedRetrieveInputHistory).toHaveBeenCalledTimes(1);
    expect(result.current.inputHistory).toEqual(['message2', 'message1']);
  });

  it('should trim input before adding to history', () => {
    const { result } = renderHook(() => useInputHistoryStore());

    act(() => {
      result.current.addInput('  test message  ');
    });

    expect(result.current.inputHistory).toEqual(['test message']);
  });
});
