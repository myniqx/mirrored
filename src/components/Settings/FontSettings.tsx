"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useQuranContext } from "@/providers/QuranProvider"
import { arabicFonts } from "./arabicFonts"

export const FontSettings = () => {
  const { arabicFont, setArabicFont } = useQuranContext()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">Change Arabic Font</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {arabicFonts.map((font) => (
          <DropdownMenuItem
            key={font.name}
            onSelect={() => {
              setArabicFont(font.name)
              setIsOpen(false)
            }}
          >
            {font.displayName}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

