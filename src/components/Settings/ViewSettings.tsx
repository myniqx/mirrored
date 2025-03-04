"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useQuranContext } from "@/providers/QuranProvider"
import { useLayoutContext } from "@/providers/LayoutProvider"

export const ViewSettings = () => {
  const { showMeal, setShowMeal, twoPageView, setTwoPageView } = useLayoutContext()

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch id="show-meal" checked={showMeal} onCheckedChange={setShowMeal} />
        <Label htmlFor="show-meal">Show Meal</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="two-page-view" checked={twoPageView} onCheckedChange={setTwoPageView} />
        <Label htmlFor="two-page-view">Two Page View</Label>
      </div>
    </div>
  )
}

