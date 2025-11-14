'use client'

import type React from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { useChangeParams } from '@/hooks/useChangeParam'
import { useLayoutContext } from '@/providers/LayoutProvider'
import { useQuranContext } from '@/providers/QuranProvider'
import {
  LucideArrowLeft,
  LucideArrowLeftCircle,
  LucideArrowRightCircle,
  LucideEyeOff,
  LucideSearch,
  LucideX,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { NavbarMenu } from './NavbarMenu'
import { BookmarkDialog } from './BookmarkDialog'
import { QuickJumpDialog } from './QuickJumpDialog'
import { BookmarkManager } from './BookmarkManager'
import { getPageInfo } from '@/utils/pageInfo'

interface NavbarProps {
  webName: string
  pageTitle: string
  onBackClick?: () => void
  icon1?: React.ReactElement
  icon2?: React.ReactElement
}

const Navbar: React.FC<NavbarProps> = () => {
  const { setVisibleHeader, headerContent, searchText } = useLayoutContext()
  const { getParams, changeParams } = useChangeParams()
  const { setBookmark } = useQuranContext()
  const page = +getParams<number>('page', 0)
  const prevPage = Math.max(page - 1, 0)
  const nextPage = Math.min(page + 1, 604)
  const [showSearch, setShowSearch] = useState(false)
  const [searchValue, setSearchValue] = useState(searchText ?? '')

  // Get page info (surah, juz)
  const pageInfo = getPageInfo(page)

  // Sync search value with context
  useEffect(() => {
    setSearchValue(searchText ?? '')
  }, [searchText])

  // Handle back button: Save current page as default bookmark
  const handleBack = () => {
    setBookmark(page, 1) // id=1 for default bookmark
    changeParams({ page: 0 }) // Go to home/main page
  }

  // Handle search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)

    // Update URL param for search
    changeParams({ q: value || undefined })
  }

  // Clear search
  const handleClearSearch = () => {
    setSearchValue('')
    changeParams({ q: undefined })
  }

  return (
    <>
      {/* Main Header */}
      <div className="flex items-center justify-between py-2 px-6 absolute left-0 right-0 top-0 h-16 bg-gray-100 dark:bg-gray-800 shadow-md z-50">
        {/* Left section: Logo and back button */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link href="/?page=0" className="flex items-center">
            <Image
              width={32}
              height={32}
              alt="Mirrored Logo"
              src="/icon.png"
              className="cursor-pointer"
            />
          </Link>
          <Button variant="ghost" size="icon" onClick={handleBack} title="Ana sayfaya dön ve yer imi kaydet">
            <LucideArrowLeft />
          </Button>
          <div className="hidden md:block">{headerContent}</div>
        </div>

        {/* Center section: Page navigation with info */}
        <div className="flex-grow flex items-center justify-center">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              disabled={prevPage === page}
              onClick={() => changeParams({ page: prevPage })}
              title="Önceki sayfa"
            >
              <LucideArrowLeftCircle />
            </Button>

            {/* Page info */}
            <div className="flex flex-col items-center min-w-[140px]">
              <div className="text-sm text-muted-foreground whitespace-nowrap">
                {pageInfo.surahName} • Cüz {pageInfo.juz}
              </div>
              <div className="font-semibold text-lg">Sayfa {page}</div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              disabled={nextPage === page}
              onClick={() => changeParams({ page: nextPage })}
              title="Sonraki sayfa"
            >
              <LucideArrowRightCircle />
            </Button>
          </div>
        </div>

        {/* Right section: Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {showSearch && (
            <div className="relative">
              <Input
                value={searchValue}
                onChange={handleSearchChange}
                placeholder={page > 0 ? "Bu sayfada ara..." : "Sure, cüz ara..."}
                className="w-48 pr-8"
                autoFocus
              />
              {searchValue && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full w-8"
                  onClick={handleClearSearch}
                >
                  <LucideX className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSearch(!showSearch)}
            title="Ara"
          >
            <LucideSearch />
          </Button>

          <BookmarkDialog currentPage={page} />
          <BookmarkManager />
          <QuickJumpDialog />

          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setVisibleHeader(false)}
            title="Header'ı gizle"
          >
            <LucideEyeOff />
          </Button>
          <NavbarMenu />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute left-0 right-0 top-16 h-1 bg-gray-200 dark:bg-gray-700 z-40">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${(page / 604) * 100}%` }}
        />
      </div>
    </>
  )
}

export default Navbar
