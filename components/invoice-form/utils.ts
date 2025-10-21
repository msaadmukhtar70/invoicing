import { v4 as uuidv4 } from "uuid";

export const createItemId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return uuidv4();
};

export const sanitizeNumber = (value: unknown): number => {
  // Coerce potentially undefined or invalid numeric inputs to a safe default.
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
};
