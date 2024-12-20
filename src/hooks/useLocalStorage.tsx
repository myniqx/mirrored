"use client"
import { useState, useEffect, Dispatch, SetStateAction } from "react"

export const useLocalStorage = <T = string>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(initialValue)

  useEffect(() => {
    // Tarayıcı ortamında kontrol
    const storedValue = localStorage.getItem(key)
    if (storedValue !== null) {
      setValue(JSON.parse(storedValue))
    }
  }, [key])

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [value, key])

  return [value, setValue]
}
