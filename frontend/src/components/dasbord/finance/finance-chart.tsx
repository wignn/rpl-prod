"use client"

import { useEffect, useRef } from "react"
import type { FinanceDetailsResponse } from "@/types/finance"

type TimePeriod = "day" | "week" | "month" | "year" | "all"

interface FinanceChartProps {
  data: FinanceDetailsResponse[]
  timePeriod: TimePeriod
}

export function FinanceChart({ data, timePeriod }: FinanceChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    const now = new Date()

    const filteredData = data.filter((item) => {
      const itemDate = new Date(item.created_at)

      switch (timePeriod) {
        case "day":
          return (
            itemDate.getDate() === now.getDate() &&
            itemDate.getMonth() === now.getMonth() &&
            itemDate.getFullYear() === now.getFullYear()
          )
        case "week":
          const oneWeekAgo = new Date()
          oneWeekAgo.setDate(now.getDate() - 6)
          oneWeekAgo.setHours(0, 0, 0, 0)
          return itemDate >= oneWeekAgo && itemDate <= now
        case "month":
          return (
            itemDate.getMonth() === now.getMonth() &&
            itemDate.getFullYear() === now.getFullYear()
          )
        case "year":
          return itemDate.getFullYear() === now.getFullYear()
        default:
          return true
      }
    })

    const groupedData: Record<string, { income: number; outcome: number }> = {}
    let labels: string[] = []
    let keys: string[] = []

    switch (timePeriod) {
      case "day": {
        for (let i = 0; i < 24; i++) {
          const hour = i.toString().padStart(2, "0")
          groupedData[hour] = { income: 0, outcome: 0 }
          labels.push(`${hour}:00`)
        }

        filteredData.forEach((item) => {
          const date = new Date(item.created_at)
          const hour = date.getHours().toString().padStart(2, "0")

          if (item.type === "INCOME") groupedData[hour].income += item.amount
          else groupedData[hour].outcome += item.amount
        })

        keys = labels.map((label) => label.slice(0, 2))
        break
      }

      case "week": {
        const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]
        const dateMap = new Map<string, string>()

        for (let i = 6; i >= 0; i--) {
          const date = new Date(now)
          date.setDate(now.getDate() - i)
          date.setHours(0, 0, 0, 0)

          const dateKey = date.toISOString().split("T")[0]
          const label = `${dayNames[date.getDay()]} ${date.getDate()}`

          dateMap.set(dateKey, label)
          groupedData[dateKey] = { income: 0, outcome: 0 }
        }

        filteredData.forEach((item) => {
          const date = new Date(item.created_at)
          date.setHours(0, 0, 0, 0)
          const dateKey = date.toISOString().split("T")[0]

          if (groupedData[dateKey]) {
            if (item.type === "INCOME") groupedData[dateKey].income += item.amount
            else groupedData[dateKey].outcome += item.amount
          }
        })

        keys = Array.from(dateMap.keys())
        labels = Array.from(dateMap.values())
        break
      }

      case "month": {
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()

        for (let i = 1; i <= daysInMonth; i++) {
          const key = i.toString()
          groupedData[key] = { income: 0, outcome: 0 }
          labels.push(key)
        }

        filteredData.forEach((item) => {
          const day = new Date(item.created_at).getDate().toString()
          if (item.type === "INCOME") groupedData[day].income += item.amount
          else groupedData[day].outcome += item.amount
        })

        keys = labels
        break
      }

      case "year":
      default: {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

        monthNames.forEach((month, idx) => {
          groupedData[idx.toString()] = { income: 0, outcome: 0 }
        })

        filteredData.forEach((item) => {
          const month = new Date(item.created_at).getMonth().toString()
          if (item.type === "INCOME") groupedData[month].income += item.amount
          else groupedData[month].outcome += item.amount
        })

        keys = monthNames.map((_, idx) => idx.toString())
        labels = monthNames
        break
      }
    }

    const differenceData = keys.map(
      (key) => groupedData[key]?.income - groupedData[key]?.outcome || 0
    )

    const width = canvasRef.current.width
    const height = canvasRef.current.height
    const padding = 40
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2
    const maxValue = Math.max(...differenceData) || 1

    ctx.clearRect(0, 0, width, height)

    ctx.beginPath()
    ctx.strokeStyle = "#e5e7eb"
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    ctx.beginPath()
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 2

    keys.forEach((_, i) => {
      const x = padding + (i * chartWidth) / (keys.length - 1 || 1)
      const y = height - padding - (differenceData[i] / maxValue) * chartHeight
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Labels
    ctx.fillStyle = "#6b7280"
    ctx.font = "10px Arial"
    ctx.textAlign = "center"
    const labelStep = Math.ceil(labels.length / 12)

    labels.forEach((label, i) => {
      if (i % labelStep === 0 || i === labels.length - 1) {
        const x = padding + (i * chartWidth) / (labels.length - 1 || 1)
        ctx.fillText(label, x, height - padding + 15)
      }
    })

    let highlightIndex = -1
    if (timePeriod === "day") highlightIndex = now.getHours()
    else if (timePeriod === "week") highlightIndex = keys.length - 1
    else if (timePeriod === "month") highlightIndex = now.getDate() - 1
    else if (timePeriod === "year") highlightIndex = now.getMonth()

    if (highlightIndex >= 0 && highlightIndex < keys.length) {
      const drawPoint = (value: number, color: string) => {
        const x = padding + (highlightIndex * chartWidth) / (keys.length - 1 || 1)
        const y = height - padding - (value / maxValue) * chartHeight

        ctx.beginPath()
        ctx.fillStyle = color
        ctx.arc(x, y, 5, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = "rgba(255,255,255,0.9)"
        ctx.fillRect(x - 40, y - 30, 80, 20)
        ctx.strokeStyle = color
        ctx.strokeRect(x - 40, y - 30, 80, 20)

        ctx.fillStyle = color
        ctx.textAlign = "center"
        ctx.fillText(`Rp ${value.toLocaleString()}`, x, y - 15)
      }

      if (differenceData[highlightIndex] > 0) {
        drawPoint(differenceData[highlightIndex], "#3b82f6")
      }
    }
  }, [data, timePeriod])

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} width={800} height={300} className="w-full h-full" />
      {data.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-500">Tidak ada data untuk periode ini</p>
        </div>
      )}
    </div>
  )
}