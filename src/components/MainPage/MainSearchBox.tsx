'use client'

import { useChangeParams } from '@/hooks/useChangeParam'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { LucideSearch, LucideX } from 'lucide-react'

export const MainSearchBox = () => {
  const { getParams, changeParams } = useChangeParams()
  const q = getParams('q')

  return (
    <div className="flex-1 flex flex-row w-full p-2">
      <LucideSearch />
      <Input
        placeholder="Search"
        defaultValue={q}
        className="bg-gray-700 rounded-lg placeholder-whiteAlpha-500"
        onChange={(e) => changeParams({ q: e.target.value })}
      />
      <Button
        size="sm"
        disabled={!q}
        aria-label="Search"
        variant="ghost"
        onClick={() => changeParams({ q: undefined })}
      >
        <LucideX />
      </Button>
    </div>
  )
}
