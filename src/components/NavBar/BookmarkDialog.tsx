'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useQuranContext } from '@/providers/QuranProvider'
import { LucideBookmark } from 'lucide-react'
import { useRef } from 'react'

type BookmarkDialogProps = {
  currentPage: number
}

export const BookmarkDialog: React.FC<BookmarkDialogProps> = ({
  currentPage,
}) => {
  const { setBookmark, bookmarks = [] } = useQuranContext()
  const inputRef = useRef<HTMLInputElement>(null)

  // Check if current page is already bookmarked
  const existingBookmark = bookmarks.find((b) => b.page === currentPage)

  const handleSave = () => {
    const name = inputRef.current?.value || `Sayfa ${currentPage}`
    setBookmark(currentPage, existingBookmark?.id)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={existingBookmark ? 'default' : 'ghost'}
          size="icon"
          title="Yer imi ekle"
        >
          <LucideBookmark
            className={existingBookmark ? 'fill-current' : ''}
          />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Yer İmi Ekle</DialogTitle>
          <DialogDescription>
            Sayfa {currentPage} için bir isim verin
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bookmark-name" className="text-right">
              İsim
            </Label>
            <Input
              id="bookmark-name"
              ref={inputRef}
              defaultValue={`Sayfa ${currentPage}`}
              className="col-span-3"
              placeholder="Örn: Bakara sonu"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              İptal
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" onClick={handleSave}>
              Kaydet
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
