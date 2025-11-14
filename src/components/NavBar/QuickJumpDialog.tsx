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
import { useChangeParams } from '@/hooks/useChangeParam'
import { LucideHash } from 'lucide-react'
import { useRef } from 'react'

export const QuickJumpDialog: React.FC = () => {
  const { changeParams } = useChangeParams()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleJump = () => {
    const pageNum = parseInt(inputRef.current?.value || '0', 10)
    if (pageNum >= 1 && pageNum <= 604) {
      changeParams({ page: pageNum })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJump()
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Sayfaya git">
          <LucideHash />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sayfaya Git</DialogTitle>
          <DialogDescription>
            1-604 arası bir sayfa numarası girin
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="page-number" className="text-right">
              Sayfa
            </Label>
            <Input
              id="page-number"
              ref={inputRef}
              type="number"
              min={1}
              max={604}
              className="col-span-3"
              placeholder="Örn: 42"
              onKeyPress={handleKeyPress}
              autoFocus
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
            <Button type="button" onClick={handleJump}>
              Git
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
