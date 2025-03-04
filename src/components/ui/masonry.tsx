import type { FC } from "react"

export const MasonryGrid: FC<{ columnCount?: { base?: number; md?: number }; gap?: number }> = ({
  columnCount = { base: 1, md: 2 },
  gap = 4,
  ...rest
}) => {
  return (
    <div
      className={`grid grid-cols-${columnCount.base} md:grid-cols-${columnCount.md} gap-${gap} w-full`}
      style={{ gridAutoFlow: "row dense" }}
      {...rest}
    />
  )
}

