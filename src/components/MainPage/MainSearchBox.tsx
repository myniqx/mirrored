'use client'

import { useChangeParams } from '@/hooks/useChangeParam'
import { Input } from '@/components/ui/input'
import { MdClose, MdSearch } from 'react-icons/md'
import { Button } from '@/components/ui/button'

export const MainSearchBox = () => {
  const { getParams, changeParams } = useChangeParams();
  const q = getParams('q');

  return (
    <div className="flex-1 flex flex-row w-full p-2">
      <MdSearch />
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
        <MdClose />
      </Button>
    </div>
  );
}
