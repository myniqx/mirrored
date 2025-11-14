'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MarkdownRenderer } from '@/components/MealEditor/MarkdownRenderer'
import { convertMealText, previewConversion, type VerseData } from '@/utils/mealConverter'
import meals from '@/constants/meal/meal.json'
import pageContents from '@/constants/quran/pageContents.json'
import { getSurahDetails } from '@/providers/QuranProvider'
import { getPageInfo } from '@/utils/pageInfo'
import {
  LucideSave,
  LucideRefreshCw,
  LucideChevronLeft,
  LucideChevronRight,
  LucideBold,
  LucideItalic,
  LucideSparkles,
  LucideZap,
  LucideAlertTriangle,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'

export default function MealEditorPage() {
  // State
  const [selectedMeal, setSelectedMeal] = useState(meals[0]?.id || '')
  const [selectedPage, setSelectedPage] = useState(1)
  const [selectedVerse, setSelectedVerse] = useState<[number, number] | null>(null)

  const [textValue, setTextValue] = useState('')
  const [subtextValue, setSubtextValue] = useState('')
  const [originalData, setOriginalData] = useState<VerseData | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // Bulk conversion state
  const [isConverting, setIsConverting] = useState(false)
  const [convertStats, setConvertStats] = useState<{
    totalVerses: number
    convertedVerses: number
    skippedVerses: number
  } | null>(null)

  // Get page verses
  const pageVerses = pageContents[selectedPage] || []
  const pageInfo = getPageInfo(selectedPage)

  // Load verse data when selection changes
  useEffect(() => {
    if (!selectedVerse || !selectedMeal) return

    const [surah, ayah] = selectedVerse

    // Load from JSON
    import(`@/constants/meal/${selectedMeal}.json`)
      .then((module) => {
        const data = module.default[surah]?.[ayah]
        if (data) {
          setTextValue(data.text || '')
          setSubtextValue(data.subtext || '')
          setOriginalData(data)
        }
      })
      .catch((err) => console.error('Error loading verse:', err))
  }, [selectedVerse, selectedMeal])

  // Auto-select first verse when page changes
  useEffect(() => {
    const firstVerse = pageVerses.find((v) => v[1] !== 0) // Skip surah headers
    if (firstVerse) {
      setSelectedVerse([firstVerse[0], firstVerse[1]])
    }
  }, [selectedPage])

  // Handle save
  const handleSave = async () => {
    if (!selectedVerse) return

    const confirmed = window.confirm(
      `Bu ayeti kaydetmek istediğinizden emin misiniz?\n\nSure: ${selectedVerse[0]}, Ayet: ${selectedVerse[1]}\n\nDosya: ${selectedMeal}.json`,
    )

    if (!confirmed) return

    setIsSaving(true)
    setSaveStatus('idle')

    try {
      const response = await fetch('/api/dev/meal/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mealId: selectedMeal,
          surah: selectedVerse[0].toString(),
          ayah: selectedVerse[1].toString(),
          data: {
            text: textValue,
            subtext: subtextValue || null,
          },
        }),
      })

      if (response.ok) {
        setSaveStatus('success')
        setOriginalData({
          text: textValue,
          subtext: subtextValue || null,
        })
        setTimeout(() => setSaveStatus('idle'), 2000)
      } else {
        setSaveStatus('error')
      }
    } catch (error) {
      console.error('Save error:', error)
      setSaveStatus('error')
    } finally {
      setIsSaving(false)
    }
  }

  // Handle convert
  const handleConvert = (field: 'text' | 'subtext') => {
    const value = field === 'text' ? textValue : subtextValue
    const converted = convertMealText(value)

    if (field === 'text') {
      setTextValue(converted)
    } else {
      setSubtextValue(converted)
    }
  }

  // Bulk conversion
  const handleBulkConvert = async (scope: 'page' | 'all', dryRun = false) => {
    const confirmMessage = dryRun
      ? `Preview conversion for ${scope === 'page' ? `page ${selectedPage}` : 'all meals'}?`
      : `Are you sure you want to convert ${scope === 'page' ? `all verses on page ${selectedPage}` : 'ALL verses in this meal'}?\n\nThis will modify the JSON file directly.\n\nA backup will be created automatically.`

    if (!window.confirm(confirmMessage)) return

    setIsConverting(true)
    setConvertStats(null)

    try {
      const response = await fetch('/api/dev/meal/convert-bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mealId: selectedMeal,
          scope,
          pageNumber: scope === 'page' ? selectedPage : undefined,
          dryRun,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setConvertStats(result.stats)

        if (!dryRun) {
          // Reload current verse data if on the affected page
          if (selectedVerse) {
            const [surah, ayah] = selectedVerse
            import(`@/constants/meal/${selectedMeal}.json`)
              .then((module) => {
                const data = module.default[surah]?.[ayah]
                if (data) {
                  setTextValue(data.text || '')
                  setSubtextValue(data.subtext || '')
                  setOriginalData(data)
                }
              })
              .catch((err) => console.error('Error reloading verse:', err))
          }

          alert(
            `Conversion completed!\n\nTotal: ${result.stats.totalVerses}\nConverted: ${result.stats.convertedVerses}\nSkipped: ${result.stats.skippedVerses}`,
          )
        } else {
          alert(
            `Preview:\n\nTotal verses: ${result.stats.totalVerses}\nWould convert: ${result.stats.convertedVerses}\nWould skip: ${result.stats.skippedVerses}`,
          )
        }
      } else {
        alert('Conversion failed. Check console for details.')
      }
    } catch (error) {
      console.error('Conversion error:', error)
      alert('Conversion error: ' + error)
    } finally {
      setIsConverting(false)
    }
  }

  // Navigation
  const goToPrevVerse = () => {
    if (!selectedVerse) return
    const currentIndex = pageVerses.findIndex(
      (v) => v[0] === selectedVerse[0] && v[1] === selectedVerse[1],
    )
    if (currentIndex > 0) {
      const prev = pageVerses[currentIndex - 1]
      if (prev[1] !== 0) {
        // Skip surah headers
        setSelectedVerse([prev[0], prev[1]])
      } else if (currentIndex > 1) {
        const prevPrev = pageVerses[currentIndex - 2]
        setSelectedVerse([prevPrev[0], prevPrev[1]])
      }
    }
  }

  const goToNextVerse = () => {
    if (!selectedVerse) return
    const currentIndex = pageVerses.findIndex(
      (v) => v[0] === selectedVerse[0] && v[1] === selectedVerse[1],
    )
    if (currentIndex < pageVerses.length - 1) {
      const next = pageVerses[currentIndex + 1]
      if (next[1] !== 0) {
        setSelectedVerse([next[0], next[1]])
      } else if (currentIndex < pageVerses.length - 2) {
        const nextNext = pageVerses[currentIndex + 2]
        setSelectedVerse([nextNext[0], nextNext[1]])
      }
    }
  }

  // Check if modified
  const isModified =
    originalData &&
    (textValue !== originalData.text || subtextValue !== (originalData.subtext || ''))

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-orange-600 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Meal Editör</h1>
            <p className="text-sm opacity-90">Development Tool - Meal JSON Editor</p>
          </div>
          <Badge variant="destructive" className="text-lg px-4 py-2">
            DEV ONLY
          </Badge>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-100 dark:bg-gray-800 px-6 py-3 flex items-center gap-4 border-b">
        <div className="flex items-center gap-2">
          <Label>Meal:</Label>
          <Select value={selectedMeal} onValueChange={setSelectedMeal}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {meals.map((meal) => (
                <SelectItem key={meal.id} value={meal.id}>
                  {meal.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label>Sayfa:</Label>
          <Input
            type="number"
            min={1}
            max={604}
            value={selectedPage}
            onChange={(e) => setSelectedPage(parseInt(e.target.value) || 1)}
            className="w-20"
          />
          <span className="text-sm text-muted-foreground">
            {pageInfo.surahName} • Cüz {pageInfo.juz}
          </span>
        </div>

        {isModified && (
          <Badge variant="outline" className="ml-auto">
            Değişiklikler kaydedilmedi
          </Badge>
        )}
      </div>

      {/* Bulk Conversion Section */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LucideZap className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <span className="font-semibold text-sm">Toplu Dönüştürme</span>
          </div>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={isConverting}>
                  <LucideSparkles className="h-4 w-4 mr-2" />
                  Bu Sayfayı Dönüştür
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <LucideAlertTriangle className="h-5 w-5 text-yellow-600" />
                    Sayfa {selectedPage} - Toplu Dönüştürme
                  </DialogTitle>
                  <DialogDescription>
                    Bu sayfadaki tüm ayetler ({pageVerses.filter((v) => v[1] !== 0).length} adet)
                    dönüştürülecek. HTML → Markdown, Allah/Peygamber isimleri formatlanacak.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <LucideAlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold">Önce önizleme yapın!</p>
                      <p className="text-muted-foreground mt-1">
                        Değişiklikleri görmek için önce &quot;Önizle&quot; butonuna tıklayın.
                      </p>
                    </div>
                  </div>
                  {convertStats && (
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm">
                      <p>
                        <strong>Toplam:</strong> {convertStats.totalVerses}
                      </p>
                      <p>
                        <strong>Dönüştürülecek:</strong> {convertStats.convertedVerses}
                      </p>
                      <p>
                        <strong>Atlanacak:</strong> {convertStats.skippedVerses}
                      </p>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => handleBulkConvert('page', true)}
                    disabled={isConverting}
                  >
                    Önizle
                  </Button>
                  <DialogClose asChild>
                    <Button onClick={() => handleBulkConvert('page', false)} disabled={isConverting}>
                      {isConverting ? 'Dönüştürülüyor...' : 'Dönüştür'}
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={isConverting}>
                  <LucideZap className="h-4 w-4 mr-2" />
                  Tümünü Dönüştür
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-red-600">
                    <LucideAlertTriangle className="h-5 w-5" />
                    TEHLİKELİ: Tüm Meal&apos;i Dönüştür
                  </DialogTitle>
                  <DialogDescription>
                    <strong className="text-red-600">
                      DİKKAT: Bu işlem {selectedMeal} meal&apos;inin TÜM ayetlerini dönüştürecek!
                    </strong>
                    <br />
                    <br />
                    Otomatik yedekleme oluşturulacak, ancak bu işlem geri alınamaz.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <LucideAlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-red-600">Önce mutlaka önizleme yapın!</p>
                      <p className="text-muted-foreground mt-1">
                        Birkaç sayfa üzerinde test edin, sonra tümünü dönüştürün.
                      </p>
                    </div>
                  </div>
                  {convertStats && (
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm">
                      <p>
                        <strong>Toplam:</strong> {convertStats.totalVerses}
                      </p>
                      <p>
                        <strong>Dönüştürülecek:</strong> {convertStats.convertedVerses}
                      </p>
                      <p>
                        <strong>Atlanacak:</strong> {convertStats.skippedVerses}
                      </p>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => handleBulkConvert('all', true)}
                    disabled={isConverting}
                  >
                    Önizle
                  </Button>
                  <DialogClose asChild>
                    <Button
                      variant="destructive"
                      onClick={() => handleBulkConvert('all', false)}
                      disabled={isConverting}
                    >
                      {isConverting ? 'Dönüştürülüyor...' : 'Tümünü Dönüştür'}
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Main Layout: Two Columns */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Verse List */}
        <div className="w-80 border-r overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="p-4 space-y-2">
            <h3 className="font-semibold mb-4">
              Sayfa {selectedPage} Ayetleri ({pageVerses.filter((v) => v[1] !== 0).length})
            </h3>
            {pageVerses.map(([surah, ayah], index) => {
              if (ayah === 0) return null // Skip surah headers

              const isSelected =
                selectedVerse &&
                selectedVerse[0] === surah &&
                selectedVerse[1] === ayah

              const surahDetails = getSurahDetails(surah)

              return (
                <Card
                  key={`${surah}-${ayah}`}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'border-primary bg-primary/10'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setSelectedVerse([surah, ayah])}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">
                        {surahDetails.name} {ayah}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {surah}:{ayah}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Right Panel: Editor */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedVerse ? (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Verse Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>
                      {getSurahDetails(selectedVerse[0]).name} - Ayet {selectedVerse[1]}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToPrevVerse}
                        disabled={
                          pageVerses.findIndex(
                            (v) => v[0] === selectedVerse[0] && v[1] === selectedVerse[1],
                          ) === 0
                        }
                      >
                        <LucideChevronLeft className="h-4 w-4" />
                        Önceki
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToNextVerse}
                        disabled={
                          pageVerses.findIndex(
                            (v) => v[0] === selectedVerse[0] && v[1] === selectedVerse[1],
                          ) ===
                          pageVerses.length - 1
                        }
                      >
                        Sonraki
                        <LucideChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
              </Card>

              {/* Text Editor */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Metin (Text)</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleConvert('text')}
                    >
                      <LucideSparkles className="h-4 w-4 mr-2" />
                      Convert
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={textValue}
                    onChange={(e) => setTextValue(e.target.value)}
                    rows={6}
                    className="font-mono"
                    placeholder="Ayet metni..."
                  />
                  <div>
                    <Label className="text-xs text-muted-foreground">Preview:</Label>
                    <div className="mt-2 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
                      <MarkdownRenderer className="text-sm">
                        {textValue}
                      </MarkdownRenderer>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Subtext Editor */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Alt Metin (Subtext)</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleConvert('subtext')}
                    >
                      <LucideSparkles className="h-4 w-4 mr-2" />
                      Convert
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={subtextValue}
                    onChange={(e) => setSubtextValue(e.target.value)}
                    rows={4}
                    className="font-mono"
                    placeholder="Alt metin (opsiyonel)..."
                  />
                  {subtextValue && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Preview:</Label>
                      <div className="mt-2 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
                        <MarkdownRenderer className="text-sm text-muted-foreground">
                          {subtextValue}
                        </MarkdownRenderer>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Save Button */}
              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (originalData) {
                      setTextValue(originalData.text)
                      setSubtextValue(originalData.subtext || '')
                    }
                  }}
                  disabled={!isModified}
                >
                  <LucideRefreshCw className="h-4 w-4 mr-2" />
                  Sıfırla
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!isModified || isSaving}
                  className={
                    saveStatus === 'success'
                      ? 'bg-green-600 hover:bg-green-700'
                      : saveStatus === 'error'
                        ? 'bg-red-600 hover:bg-red-700'
                        : ''
                  }
                >
                  {isSaving ? (
                    <>
                      <LucideRefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Kaydediliyor...
                    </>
                  ) : saveStatus === 'success' ? (
                    '✓ Kaydedildi'
                  ) : saveStatus === 'error' ? (
                    '✗ Hata'
                  ) : (
                    <>
                      <LucideSave className="h-4 w-4 mr-2" />
                      Kaydet
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Bir ayet seçin
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
