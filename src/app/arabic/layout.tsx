import { LayoutProvider } from '@/providers/LayoutProvider'

const ArabicLayout = ({ children }: { children: React.ReactNode }) => {
  return <LayoutProvider>{children}</LayoutProvider>
}

export default ArabicLayout
