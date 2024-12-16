'use client'

import { useChangeParams } from '@/hooks/useChangeParam'
import { IconButton, Input } from '@chakra-ui/react'
import { InputGroup } from '@chakra/input-group'
import { MdClose, MdSearch } from 'react-icons/md'

export const MainSearchBox = () => {
  const { getParams, changeParams } = useChangeParams()
  const q = getParams('q')

  return (
    <InputGroup
      flex={1}
      startElement={<MdSearch />}
      endElement={
        <IconButton
          size="sm"
          disabled={!q}
          aria-label="Search"
          variant={'ghost'}
          onClick={() => changeParams({ q: undefined })}
        >
          <MdClose />
        </IconButton>
      }
    >
      <Input
        placeholder="Search"
        defaultValue={q}
        bg={'gray.700'}
        borderRadius={'lg'}
        _placeholder={{ color: 'whiteAlpha.500' }}
        onChange={(e) => changeParams({ q: e.target.value })}
      />
    </InputGroup>
  )
}
