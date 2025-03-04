"use client"

import { useChangeParams } from "@/hooks/useChangeParam"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

export const MainSearchBox = () => {
  const { getParams, changeParams } = useChangeParams()
  const q = getParams("q")

  return (
    <div className="flex items-center relative w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search"
        defaultValue={q}
        className="pl-10 pr-10"
        onChange={(e) => changeParams({ q: e.target.value })}
      />
      {q && (
        <Button
          size="sm"
          variant="ghost"
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
          onClick={() => changeParams({ q: undefined })}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

