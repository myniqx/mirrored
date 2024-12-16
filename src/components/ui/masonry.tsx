import { FC } from 'react'

import { Box, BoxProps } from '@chakra-ui/react'

export const MasonryGrid: FC<BoxProps> = ({
  columnCount = { base: 1, md: 2 },
  gap = 4,
  ...rest
}) => {
  return (
    <Box
      columnCount={columnCount}
      columnGap={gap}
      w={'full'}
      css={{
        '& > div': {
          breakInside: 'avoid-column',
          mb: gap,
        },
      }}
      {...rest}
    />
  )
}
