import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import type { AyetMenuItemProps } from './types'

export const AyetMenuItem: React.FC<AyetMenuItemProps> = ({
  page,
  isMakkah,
  name,
  ayahNumber,
  matchedString,
}) => {
  return (
    <Link href={`/arabic?page=${page}`} className="w-full">
      <Card className="w-full hover:bg-gray-900 hover:border-gray-600 transition-colors">
        <CardContent className="flex flex-row gap-4 items-center p-4">
          <Image
            src={isMakkah ? '/mekki.jpg' : '/medeni.jpg'}
            width={50}
            height={50}
            className="rounded-full"
            alt="Mirrored Logo"
          />
          <div className="flex flex-col">
            <h3 className="text-lg font-medium">
              {matchedString ? (
                <span>
                  {name.split(matchedString).map((part, i, arr) => (
                    <React.Fragment key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <span className="bg-yellow-300 text-black">
                          {matchedString}
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </span>
              ) : (
                name
              )}
            </h3>
            <div className="flex flex-wrap gap-2 mt-1">
              <Badge color={isMakkah ? 'green' : 'red'}>
                {isMakkah ? 'Mekki' : 'Medeni'}
              </Badge>
              <Badge color="blue">Ayah: {ayahNumber}</Badge>
              <Badge color="blue">Page: {page}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
