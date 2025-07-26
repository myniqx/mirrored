import { ArabicLineAspectRatio } from './types'

export const Besmele = ({ fontSize }: { fontSize: number }) => {
  const words = ['بِسْمِ', 'اللَّهِ', 'الرَّحْمَنِ', 'الرَّحِيمِ']

  return (
    <div
      className="flex justify-between w-full px-[20%] flex-row-reverse"
      style={{ aspectRatio: ArabicLineAspectRatio }}
    >
      {words.map((word, index) => (
        <p key={index} className="font-arabic font-bold" style={{ fontSize }}>
          {word}
        </p>
      ))}
    </div>
  )
}
