import type React from 'react'
import { getSurahDetails } from '@/providers/QuranProvider'
import Image from 'next/image'
import { HeaderAspectRatio } from './types'

type SurahHeaderProps = {
  surah: number
}

export const SurahHeader: React.FC<SurahHeaderProps> = (props) => {
  const surah = getSurahDetails(props.surah)
  return (
    <div
      className="w-full border border-gray-600 flex items-center justify-around relative shadow-lg"
      style={{ aspectRatio: HeaderAspectRatio }}
    >
      <img
        src="/ornament-left.png"
        width={'12%'}
        height={100}
        className="absolute left-0 top-0 bottom-0 h-full dark:invert"
        alt="Mirrored Logo"
      />
      <img
        src="/ornament-right.png"
        width={'12%'}
        height={100}
        className="absolute right-0 top-0 bottom-0 h-full dark:invert"
        alt="Mirrored Logo"
      />
      <h2 className="text-2xl">{surah.name}</h2>
      <h2 className="text-2xl">{surah.totalAyahs} verses</h2>
    </div>
  )
}
