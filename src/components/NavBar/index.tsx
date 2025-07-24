"use client"

import type React from "react"

import { useChangeParams } from "@/hooks/useChangeParam"
import { useLayoutContext } from "@/providers/LayoutProvider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ModeToggle } from "@/components/ui/mode-toggle"
import Image from "next/image"
import { useState } from "react"
import { IoMdEyeOff } from "react-icons/io"
import { IoChevronBackCircleOutline, IoChevronForwardCircleOutline } from "react-icons/io5"
import { MdArrowBack, MdSearch, MdMenu } from "react-icons/md"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { NavbarMenu } from "./NavbarMenu"

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
  const page = +getParams<number>("page", 0)
  const prevPage = Math.max(page - 1, 0)
  const nextPage = Math.min(page + 1, 604)
  const [showSearch, setShowSearch] = useState(false)

  return (
    <div className="flex items-center justify-between py-4 px-6 absolute left-0 right-0 top-0 h-14 bg-gray-100 dark:bg-gray-800 shadow-md">
      {/* Left section: Logo, back button, and header content */}
      <div className="flex items-center grow-0 flex-shrink-1">
        <Image width={32} height={32} alt="Mirrored Logo" src="/icon.png" />
        <Button variant="ghost" size="icon">
          <MdArrowBack />
        </Button>
        <div className="hidden md:block">{headerContent}</div>
      </div>

      {/* Center section: Page navigation */}
      <div className="grow flex-1 flex items-center justify-center text-center">
        <div className="flex items-center gap-4 justify-center">
          <Button
            variant="ghost"
            size="icon"
            disabled={prevPage === page}
            onClick={() => changeParams({ page: prevPage })}
          >
            <IoChevronBackCircleOutline />
          </Button>
          <span>{page}</span>
          <Button
            variant="ghost"
            size="icon"
            disabled={nextPage === page}
            onClick={() => changeParams({ page: nextPage })}
          >
            <IoChevronForwardCircleOutline />
          </Button>
        </div>
      </div>

      {/* Right section: Search, theme toggle, and menu */}
      <div className="flex items-center gap-2">
        {showSearch && <Input value={searchText ?? ""} placeholder="Type some names" className="mx-1.5" />}
        <Button variant="ghost" size="icon" onClick={() => setShowSearch(!showSearch)}>
          <MdSearch />
        </Button>
        <ModeToggle />
        <Button variant="ghost" size="icon" onClick={() => setVisibleHeader(false)}>
          <IoMdEyeOff />
        </Button>
        <NavbarMenu />
      </div>
    </div>
  )
}

export default Navbar

