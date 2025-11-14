'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useQuranContext } from '@/providers/QuranProvider'
import { LucideDownload, LucideUpload, LucideBookMarked } from 'lucide-react'
import { useRef } from 'react'

/**
 * Bookmark Manager: Export/Import bookmarks as JSON
 * This provides offline-compatible bookmark sync without requiring OAuth
 */
export const BookmarkManager = () => {
  const { bookmarks, setBookmark } = useQuranContext()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Export bookmarks as JSON file
  const handleExport = () => {
    const dataStr = JSON.stringify(bookmarks, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `kuran-yerimler-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Import bookmarks from JSON file
  const handleImport = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string)
        if (Array.isArray(imported)) {
          // Import each bookmark
          imported.forEach((bm: any) => {
            if (bm.id && bm.page) {
              setBookmark(bm.page, bm.id)
            }
          })
          alert(`${imported.length} yer imi içe aktarıldı!`)
        }
      } catch (error) {
        alert('Geçersiz dosya formatı!')
      }
    }
    reader.readAsText(file)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" title="Yer imleri yönet">
            <LucideBookMarked />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleExport}>
            <LucideDownload className="mr-2 h-4 w-4" />
            Yer İmlerini Dışa Aktar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleImport}>
            <LucideUpload className="mr-2 h-4 w-4" />
            Yer İmlerini İçe Aktar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>
            <span className="text-xs text-muted-foreground">
              {bookmarks.length} yer imi
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleFileChange}
      />
    </>
  )
}
