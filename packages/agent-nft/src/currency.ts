/**
 * @file Manages a simple in-memory currency system for Agent-NFTs.
 */

/**
 * Represents a user's wallet, holding their balance.
 */
export interface Wallet {
  userId: string;
  balance: number;
}

// In-memory store for wallets, mapping user IDs to their wallets.
const wallets = new Map<string, Wallet>();

/**
 * Creates a new wallet for a user with a starting balance of 0.
 *
 * @param userId The unique identifier for the user.
 * @returns `true` if the wallet was created successfully, `false` if it already exists.
 */
export const createWallet = (userId: string): boolean => {
  if (wallets.has(userId)) {
    return false; // Wallet already exists
  }
  wallets.set(userId, { userId, balance: 0 });
  return true;
};

/**
 * Retrieves a user's wallet.
 *
 * @param userId The user's ID.
 * @returns The user's `Wallet` object, or `undefined` if not found.
 */
export const getWallet = (userId: string): Wallet | undefined => {
  return wallets.get(userId);
};

/**
 * Gets the current balance for a user.
 *
 * @param userId The user's ID.
 * @returns The user's balance, or `null` if the wallet doesn't exist.
 */
export const getBalance = (userId: string): number | null => {
  const wallet = getWallet(userId);
  return wallet ? wallet.balance : null;
};

/**
 * Adds a specified amount to a user's balance.
 *
 * @param userId The user's ID.
 * @param amount The amount to add. Must be a positive number.
 * @returns The new balance, or `null` if the wallet doesn't exist or the amount is invalid.
 */
export const addToBalance = (userId: string, amount: number): number | null => {
  if (amount <= 0) {
    return null; // Can only add a positive amount
  }
  const wallet = getWallet(userId);
  if (!wallet) {
    return null; // Wallet not found
  }
  wallet.balance += amount;
  return wallet.balance;
};

/**
 * Subtracts a specified amount from a user's balance.
 *
 * @param userId The user's ID.
 * @param amount The amount to subtract. Must be a positive number.
 * @returns The new balance, or `null` if the wallet doesn't exist, the amount is invalid, or funds are insufficient.
 */
export const subtractFromBalance = (userId: string, amount: number): number | null => {
  if (amount <= 0) {
    return null; // Can only subtract a positive amount
  }
  const wallet = getWallet(userId);
  if (!wallet) {
    return null; // Wallet not found
  }
  if (wallet.balance < amount) {
    return null; // Insufficient funds
  }
  wallet.balance -= amount;
  return wallet.balance;
};
