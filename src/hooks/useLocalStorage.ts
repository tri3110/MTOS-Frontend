import { useState, useCallback } from "react";

export const useLocalStorage = <T,>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] => {
  // State to store our value
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === "undefined") {
            return initialValue;
        }

        try {
        const item = window.localStorage.getItem(key);
        if (item === null) return initialValue;

        // Try to parse as JSON first, fallback to raw string
        try {
            return JSON.parse(item);
        } catch {
            // If JSON.parse fails, return as string (for simple values like "en", "vi")
            return item as T;
        }
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // Return a wrapped version of useState's setter function that
    // persists the new value to localStorage
    const setValue = useCallback((value: T | ((val: T) => T)) => {
        try {
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);

            if (typeof window !== "undefined") {
                // Store as JSON if it's an object/array, otherwise as string
                const storageValue = typeof valueToStore === 'string'
                ? valueToStore
                : JSON.stringify(valueToStore);
                window.localStorage.setItem(key, storageValue);
            }
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, storedValue]);

    return [storedValue, setValue];
};
