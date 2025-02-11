'use client'
import { useCallback, useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { ParsedUrlQuery } from 'querystring'

function isEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true
  if (a === null || b === null) return false

  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a as object)
    const keysB = Object.keys(b as object)

    if (keysA.length !== keysB.length) return false

    for (const key of keysA) {
      if (
        !isEqual(
          (a as object)[key as keyof object],
          (b as object)[key as keyof object],
        )
      )
        return false
    }

    return true
  }

  return false
}

const isEmptyValues = (value: unknown): boolean => {
  try {
    if (value === undefined) return true
    if (value === null) return true
    if (Number.isNaN(value)) return true
    if (typeof value === 'object' && Object.keys(value).length === 0)
      return true
    if (typeof value === 'string' && value.trim().length === 0) return true
  } catch (error) {
    console.error(error)
  }

  return false
}

type ChangeParamArgs = Record<string, string | string[] | number | undefined>
const ARRAY_INDICATOR = '-'
const ARRAY_SEPARATOR = '|'

export const useChangeParams = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [defaultValues] = useState<Record<string, unknown>>({})

  const changeParams = useCallback(
    (args: ChangeParamArgs) => {
      const sanitizeArgs = (args: ChangeParamArgs) => {
        const sanitizedArgs: ChangeParamArgs = {}

        for (const key in args) {
          const param = args[key]

          if (
            !isEmptyValues(param) &&
            defaultValues[key] !== (Array.isArray(param) ? param[0] : param)
          ) {
            if (Array.isArray(param)) {
              const filtered = param.filter((p) => !!p)

              if (filtered.length) {
                sanitizedArgs[key] =
                  ARRAY_INDICATOR +
                  filtered.map(encodeURIComponent).join(ARRAY_SEPARATOR)
              }
            } else {
              sanitizedArgs[key] = param
            }
          }
        }

        return sanitizedArgs
      }

      const sanitizeQuery = (
        searchParams: URLSearchParams,
        args: ChangeParamArgs,
      ) => {
        const sanitizedParams = new URLSearchParams(searchParams)

        for (const key in args) {
          const param = args[key]

          if (
            isEmptyValues(param) ||
            defaultValues[key] === (Array.isArray(param) ? param[0] : param)
          ) {
            sanitizedParams.delete(key)
          }
        }

        return sanitizedParams
      }

      const sanitizedParams = sanitizeQuery(searchParams, args)
      const sanitizedArgs = sanitizeArgs(args)

      for (const key in sanitizedArgs) {
        const value = sanitizedArgs[key]
        sanitizedParams.set(key, value as string)
      }

      /*
      const shouldRemovePage =
        Object.keys(sanitizedArgs).some((key) => key !== 'page') &&
        sanitizedParams.has('page') &&
        !('page' in sanitizedArgs)

      if (shouldRemovePage) {
        sanitizedParams.delete('page')
      }
      */

      if (
        isEqual(
          Array.from(searchParams.entries()),
          Array.from(sanitizedParams.entries()),
        )
      ) {
        return
      }

      router.push(`?${sanitizedParams.toString()}`, { scroll: false })
    },
    [searchParams, router, defaultValues],
  )

  const changeSearch = useCallback(
    (search?: string) => {
      changeParams({ q: search })
    },
    [changeParams],
  )

  function getQuery<T = string | undefined>(key: string, defaultValue?: T): T {
    if (defaultValue) defaultValues[key] = defaultValue as T
    const value = searchParams.get(key) as T | null
    const isArray = (value as string)?.startsWith(ARRAY_INDICATOR)

    if (isArray) {
      return (value as string)
        ?.slice(ARRAY_INDICATOR.length)
        .split(ARRAY_SEPARATOR)
        .map(decodeURIComponent) as T
    }

    return (value ?? defaultValue) as T
  }

  const memoizedGetQuery = useCallback(getQuery, [searchParams, defaultValues])

  function getQueryAsArray<T = string | undefined>(
    key: string,
    defaultValue?: T,
  ): T[] {
    const value = memoizedGetQuery(key, defaultValue)
    if (!value) return [] as T[]

    return (Array.isArray(value) ? value : [value]) as T[]
  }

  const memoizedGetQueryAsArray = useCallback(getQueryAsArray, [
    memoizedGetQuery,
  ])

  return {
    changeParams,
    changeSearch,
    getParams: memoizedGetQuery,
    getParamsAsArray: memoizedGetQueryAsArray,
  }
}
