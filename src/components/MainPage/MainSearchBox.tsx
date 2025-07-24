'use client'

import { useChangeParams } from '@/hooks/useChangeParam'
import { Input } from '@/components/ui/input'
import { MdClose, MdSearch } from 'react-icons/md'
import { Button } from '@/components/ui/button'
import { useLayoutContext } from '@/providers/LayoutProvider'
import { useRef } from 'react'

export const MainSearchBox = () => {
  const { getParams, changeParams } = useLayoutContext();
  const q = getParams('q');
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="flex-1 flex flex-row items-center gap-2 w-full relative">

      <MdSearch size={24} className="absolute left-2" />
      <Input
        ref={ref}
        placeholder="Search"
        defaultValue={q}
        className="rounded-lg placeholder-whiteAlpha-500 flex-1 px-10"
        onChange={(e) => changeParams({ q: e.target.value })}
      />
      <Button
        size="sm"
        disabled={!q}
        aria-label="Search"
        variant="ghost"
        className="absolute right-2"
        onClick={() => {
          changeParams({ q: undefined })
          ref.current!.value = ''
        }}
      >
        <MdClose />
      </Button>
    </div>
  );
}
