import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'

type FlowerType =
  | 'tulip'
  | 'daisy'
  | 'sunflower'
  | 'cherry-blossom'
  | 'rose'
  | 'lavender'
  | 'babys-breath'
  | 'peony'
  | 'hydrangea'
type LetterFlowerType = FlowerType | 'rose' | 'lily'

type Flower = {
  id: number
  type: FlowerType
  col: number
  row: number
}

type DailyLetter = {
  date: string
  content: string
  flowerType: LetterFlowerType
}

const FLOWER_INFO: Record<
  FlowerType,
  { name: string; color: string }
> = {
  tulip: { name: 'ทิวลิปสีชมพู', color: '#f28eae' },
  daisy: { name: 'เดซี่แสนหวาน', color: '#fff3df' },
  sunflower: { name: 'ทานตะวัน', color: '#ffc857' },
  'cherry-blossom': {
    name: 'ซากุระ',
    color: '#ffb7d5',
  },
  rose: { name: 'กุหลาบ', color: '#e85d75' },
  lavender: { name: 'ลาเวนเดอร์', color: '#a98be8' },
  'babys-breath': {
    name: 'ยิปโซ',
    color: '#fff9f0',
  },
  peony: { name: 'โบตั๋น', color: '#f18ac2' },
  hydrangea: { name: 'ไฮเดรนเยีย', color: '#8c9ff2' },
}

const LETTER_FLOWER_INFO: Record<
  LetterFlowerType,
  { name: string; emoji: string }
> = {
  tulip: { name: 'ทิวลิปสีชมพู', emoji: '🌷' },
  daisy: { name: 'เดซี่แสนหวาน', emoji: '🌼' },
  sunflower: { name: 'ทานตะวัน', emoji: '🌻' },
  'cherry-blossom': { name: 'ซากุระ', emoji: '🌸' },
  rose: { name: 'กุหลาบ', emoji: '🌹' },
  lavender: { name: 'ลาเวนเดอร์', emoji: '💜' },
  'babys-breath': { name: 'ยิปโซ', emoji: '🤍' },
  peony: { name: 'โบตั๋น', emoji: '🌺' },
  hydrangea: { name: 'ไฮเดรนเยีย', emoji: '💠' },
  lily: { name: 'ดอกลิลลี่', emoji: '💮' },
}

function drawDiamond(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(x, y - height / 2)
  ctx.lineTo(x + width / 2, y)
  ctx.lineTo(x, y + height / 2)
  ctx.lineTo(x - width / 2, y)
  ctx.closePath()
  ctx.fill()
}

function drawPixelFlower(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  type: FlowerType,
  time: number,
) {
  const colors = FLOWER_INFO[type]
  const sway = Math.sin(time / 600 + x) * 1.5
  const petal = colors.color

  // เงาใต้ดอกไม้
  ctx.fillStyle = 'rgba(74, 85, 54, 0.18)'
  ctx.fillRect(x - 7, y + 1, 15, 4)

  // ก้าน
  ctx.fillStyle = '#4c8c59'
  ctx.fillRect(x - 1, y - 13, 3, 15)

  // ใบไม้
  ctx.fillStyle = '#5da66a'
  ctx.fillRect(x - 7, y - 7, 7, 4)
  ctx.fillRect(x + 1, y - 11, 7, 4)

  ctx.fillStyle = '#37734a'
  ctx.fillRect(x - 7, y - 4, 5, 2)
  ctx.fillRect(x + 3, y - 8, 5, 2)

  const flowerY = y - 17
  const offset = Math.round(sway)

 
  if (type === 'tulip') {
    ctx.fillStyle = petal
    ctx.fillRect(x - 5 + offset, flowerY - 3, 5, 8)
    ctx.fillRect(x + offset, flowerY - 7, 6, 12)
    ctx.fillRect(x + 5 + offset, flowerY - 3, 4, 8)

    ctx.fillStyle = '#d85c8a'
    ctx.fillRect(x + offset, flowerY - 6, 3, 7)
  } else if (type === 'cherry-blossom') {
    // ซากุระ: กลีบชมพู 5 กลีบ
    ctx.fillStyle = '#ffb7d5'
    ctx.fillRect(x - 2 + offset, flowerY - 9, 5, 5)
    ctx.fillRect(x - 8 + offset, flowerY - 5, 5, 5)
    ctx.fillRect(x + 4 + offset, flowerY - 5, 5, 5)
    ctx.fillRect(x - 6 + offset, flowerY + 1, 5, 5)
    ctx.fillRect(x + 2 + offset, flowerY + 1, 5, 5)

    ctx.fillStyle = '#ffe8f2'
    ctx.fillRect(x - 1 + offset, flowerY - 6, 4, 5)

    ctx.fillStyle = '#d96b9b'
    ctx.fillRect(x + offset, flowerY - 2, 3, 3)
  } else if (type === 'rose') {
    // กุหลาบ: กลีบซ้อนสีแดงชมพู
    ctx.fillStyle = '#e85d75'
    ctx.fillRect(x - 6 + offset, flowerY - 4, 6, 7)
    ctx.fillRect(x + 1 + offset, flowerY - 5, 7, 8)
    ctx.fillRect(x - 4 + offset, flowerY - 9, 9, 6)

    ctx.fillStyle = '#ff9aaf'
    ctx.fillRect(x - 2 + offset, flowerY - 7, 5, 4)

    ctx.fillStyle = '#b93659'
    ctx.fillRect(x + offset, flowerY - 4, 3, 4)
  } else if (type === 'lavender') {
    // ลาเวนเดอร์: ช่อดอกสีม่วง
    ctx.fillStyle = '#8066c9'
    ctx.fillRect(x - 2 + offset, flowerY - 13, 5, 4)
    ctx.fillRect(x - 6 + offset, flowerY - 10, 5, 4)
    ctx.fillRect(x + 3 + offset, flowerY - 10, 5, 4)
    ctx.fillRect(x - 3 + offset, flowerY - 7, 5, 4)
    ctx.fillRect(x + 2 + offset, flowerY - 5, 5, 4)

    ctx.fillStyle = '#c4a7ff'
    ctx.fillRect(x - 1 + offset, flowerY - 12, 3, 3)
    ctx.fillRect(x - 4 + offset, flowerY - 9, 3, 3)
  } else if (type === 'babys-breath') {
    // ยิปโซ: ดอกเล็กสีขาวหลายดอก
    ctx.fillStyle = '#fff9f0'
    ctx.fillRect(x - 7 + offset, flowerY - 7, 4, 4)
    ctx.fillRect(x - 1 + offset, flowerY - 11, 4, 4)
    ctx.fillRect(x + 4 + offset, flowerY - 6, 4, 4)
    ctx.fillRect(x - 4 + offset, flowerY, 4, 4)
    ctx.fillRect(x + 2 + offset, flowerY - 1, 4, 4)

    ctx.fillStyle = '#f2d8e8'
    ctx.fillRect(x - 6 + offset, flowerY - 6, 2, 2)
    ctx.fillRect(x + offset, flowerY - 10, 2, 2)
  } else if (type === 'peony') {
    // โบตั๋น: ดอกใหญ่กลีบฟู
    ctx.fillStyle = '#f18ac2'
    ctx.fillRect(x - 7 + offset, flowerY - 5, 6, 7)
    ctx.fillRect(x - 4 + offset, flowerY - 9, 6, 7)
    ctx.fillRect(x + 1 + offset, flowerY - 9, 6, 7)
    ctx.fillRect(x + 4 + offset, flowerY - 4, 6, 7)
    ctx.fillRect(x - 3 + offset, flowerY, 7, 4)

    ctx.fillStyle = '#ffc1e0'
    ctx.fillRect(x - 2 + offset, flowerY - 6, 5, 5)
    ctx.fillRect(x + offset, flowerY - 2, 4, 3)
  } else if (type === 'hydrangea') {
    // ไฮเดรนเยีย: ช่อกลมสีน้ำเงินม่วง
    ctx.fillStyle = '#7589e8'
    ctx.fillRect(x - 7 + offset, flowerY - 7, 5, 5)
    ctx.fillRect(x - 2 + offset, flowerY - 10, 5, 5)
    ctx.fillRect(x + 3 + offset, flowerY - 7, 5, 5)
    ctx.fillRect(x - 6 + offset, flowerY - 2, 5, 5)
    ctx.fillRect(x - 1 + offset, flowerY - 4, 5, 5)
    ctx.fillRect(x + 4 + offset, flowerY - 2, 5, 5)

    ctx.fillStyle = '#b6c5ff'
    ctx.fillRect(x - 1 + offset, flowerY - 8, 3, 3)
    ctx.fillRect(x - 5 + offset, flowerY - 5, 3, 3)
    ctx.fillRect(x + 3 + offset, flowerY - 4, 3, 3)
  } else {
    // เดซี่และทานตะวัน: คงรูปแบบดอกไม้เดิม
    const petals = [
      [-4, -5],
      [0, -8],
      [4, -5],
      [-5, 0],
      [5, 0],
      [-3, 4],
      [3, 4],
    ]

    ctx.fillStyle = petal

    for (const [px, py] of petals) {
      ctx.fillRect(x + px + offset, flowerY + py, 5, 5)
    }

    ctx.fillStyle = type === 'sunflower' ? '#a96528' : '#f5c64d'
    ctx.fillRect(x - 2 + offset, flowerY - 2, 6, 6)

    if (type === 'sunflower') {
      ctx.fillStyle = '#754a2c'
      ctx.fillRect(x + offset, flowerY, 2, 2)
    }

  }

  // ไฮไลต์เล็ก ๆ
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(x - 3 + offset, flowerY - 4, 2, 2)
}

function drawFence(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  vertical: boolean,
) {
  ctx.fillStyle = '#b77d58'

  if (vertical) {
    ctx.fillRect(x, y - 12, 5, 23)
    ctx.fillRect(x - 2, y - 14, 9, 4)
    ctx.fillRect(x - 2, y - 2, 9, 4)
  } else {
    ctx.fillRect(x - 8, y - 3, 16, 5)
    ctx.fillRect(x - 8, y - 11, 5, 15)
    ctx.fillRect(x + 4, y - 11, 5, 15)
    ctx.fillRect(x - 9, y - 12, 7, 4)
    ctx.fillRect(x + 3, y - 12, 7, 4)
  }

  ctx.fillStyle = '#e4b17c'
  ctx.fillRect(x + 1, y - (vertical ? 10 : 9), 2, vertical ? 16 : 10)
}

function drawGarden(
  canvas: HTMLCanvasElement,
  flowers: Flower[],
  time: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const rect = canvas.getBoundingClientRect()
  if (!rect.width || !rect.height) return

  const dpr = Math.min(window.devicePixelRatio || 1, 2)

  canvas.width = Math.round(rect.width * dpr)
  canvas.height = Math.round(rect.height * dpr)

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, rect.width, rect.height)

  // ท้องฟ้าสีพาสเทล
  const sky = ctx.createLinearGradient(0, 0, 0, rect.height)
  sky.addColorStop(0, '#d8eaff')
  sky.addColorStop(0.6, '#fff0f3')
  sky.addColorStop(1, '#fce2e9')

  ctx.fillStyle = sky
  ctx.fillRect(0, 0, rect.width, rect.height)

  // เมฆแบบพิกเซล
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'

  for (let i = 0; i < 5; i++) {
    const x = ((i * 173 + 25) % (rect.width + 100)) - 30
    const y = 35 + (i % 3) * 35

    ctx.fillRect(x, y, 32, 10)
    ctx.fillRect(x + 8, y - 7, 24, 10)
    ctx.fillRect(x + 22, y + 2, 22, 8)
  }

  const tileW = Math.min(rect.width / 12, 43)
  const tileH = tileW / 2
  const cols = 9
  const rows = 12

  const gardenWidth = (cols + rows) * tileW / 2
  const gardenHeight = (cols + rows) * tileH / 2

  const scale = Math.min(
    1,
    (rect.width * 0.96) / gardenWidth,
    (rect.height * 0.88) / gardenHeight,
  )

  const offsetX = (rect.width - gardenWidth * scale) / 2
  const offsetY = Math.max(
    25,
    (rect.height - gardenHeight * scale) / 2 + 5,
  )

  ctx.save()
  ctx.translate(offsetX, offsetY)
  ctx.scale(scale, scale)

  const originX = gardenWidth / 2
  const originY = 20

  const iso = (col: number, row: number) => ({
    x: originX + (col - row) * tileW / 2,
    y: originY + (col + row) * tileH / 2,
  })

  // ด้านข้างของเกาะ
  ctx.fillStyle = '#b87970'
  ctx.beginPath()

  const right = iso(cols, 0)
  const bottom = iso(cols, rows)
  const left = iso(0, rows)

  ctx.moveTo(left.x, left.y)
  ctx.lineTo(bottom.x, bottom.y)
  ctx.lineTo(bottom.x, bottom.y + 15)
  ctx.lineTo(left.x, left.y + 15)
  ctx.closePath()
  ctx.fill()

  ctx.beginPath()
  ctx.moveTo(right.x, right.y)
  ctx.lineTo(bottom.x, bottom.y)
  ctx.lineTo(bottom.x, bottom.y + 15)
  ctx.lineTo(right.x, right.y + 15)
  ctx.closePath()
  ctx.fill()

  // พื้นหญ้าแบบ Isometric
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const p = iso(col, row)

      drawDiamond(
        ctx,
        p.x,
        p.y,
        tileW,
        tileH,
        (col + row) % 2 === 0 ? '#a8d58b' : '#9dce83',
      )

      if ((col * 3 + row * 7) % 9 === 0) {
        ctx.fillStyle = '#e3e6a0'
        ctx.fillRect(p.x - 2, p.y - 1, 3, 2)
      }
    }
  }

  // แปลงดิน
  const plotCells = [
    { col: 3, row: 2 },
    { col: 5, row: 2 },
    { col: 2, row: 3 },
    { col: 4, row: 3 },
    { col: 6, row: 3 },
    { col: 3, row: 4 },
    { col: 5, row: 4 },
    { col: 2, row: 5 },
    { col: 4, row: 5 },
    { col: 6, row: 5 },
    { col: 3, row: 6 },
    { col: 5, row: 6 },
    { col: 4, row: 7 },
    { col: 1, row: 4 },
    { col: 7, row: 4 },
    { col: 1, row: 6 },
    { col: 7, row: 6 },
    { col: 2, row: 7 },
    { col: 6, row: 7 },
    { col: 3, row: 8 },
    { col: 5, row: 8 },
    { col: 4, row: 9 },
    { col: 2, row: 9 },
    { col: 6, row: 9 },
    { col: 1, row: 8 },
    { col: 7, row: 8 },
    { col: 3, row: 10 },
    { col: 5, row: 10 },
    { col: 2, row: 11 },
    { col: 6, row: 11 },
  ]

  for (const plot of plotCells) {
    const p = iso(plot.col, plot.row)
    drawDiamond(ctx, p.x, p.y, tileW * 0.85, tileH * 0.8, '#ae7957')
    drawDiamond(ctx, p.x, p.y - 1, tileW * 0.76, tileH * 0.67, '#bd8963')

    ctx.fillStyle = '#d8a276'
    ctx.fillRect(p.x - 3, p.y - 1, 3, 2)
    ctx.fillRect(p.x + 7, p.y + 1, 2, 2)
  }

  // รั้วด้านหลัง
  for (let col = 0; col <= cols; col++) {
    const p = iso(col, 0)
    drawFence(ctx, p.x, p.y - 5, false)
  }

  for (let row = 0; row <= rows; row++) {
    const p = iso(0, row)
    drawFence(ctx, p.x, p.y - 5, true)
  }

  // ต้นไม้พิกเซล
  const tree = iso(2, 2)

  ctx.fillStyle = '#855b45'
  ctx.fillRect(tree.x - 5, tree.y - 40, 12, 43)

  ctx.fillStyle = '#6a9b5d'
  ctx.fillRect(tree.x - 25, tree.y - 58, 25, 22)
  ctx.fillRect(tree.x - 12, tree.y - 72, 29, 28)
  ctx.fillRect(tree.x + 7, tree.y - 58, 23, 22)

  ctx.fillStyle = '#91c77a'
  ctx.fillRect(tree.x - 7, tree.y - 68, 14, 7)
  ctx.fillRect(tree.x - 19, tree.y - 54, 11, 6)

  // ม้านั่ง
  const bench = iso(2, 5)

  ctx.fillStyle = '#986b4b'
  ctx.fillRect(bench.x - 20, bench.y - 9, 40, 8)
  ctx.fillRect(bench.x - 17, bench.y - 17, 34, 7)
  ctx.fillRect(bench.x - 16, bench.y - 1, 4, 12)
  ctx.fillRect(bench.x + 12, bench.y - 1, 4, 12)

  ctx.fillStyle = '#e6b67f'
  ctx.fillRect(bench.x - 18, bench.y - 15, 36, 4)
  ctx.fillRect(bench.x - 17, bench.y - 7, 34, 4)

  // เรียงดอกไม้ตามตำแหน่งเพื่อให้มีมิติ
  // วาดเฉพาะดอกไม้ที่อยู่บนแปลงปลูกจริง
  const validPlotKeys = new Set(
    plotCells.map((plot) => `${plot.col},${plot.row}`),
  )

  const sortedFlowers = flowers
    .filter((flower) =>
      validPlotKeys.has(`${flower.col},${flower.row}`),
    )
    .sort((a, b) => a.col + a.row - (b.col + b.row))

  for (const flower of sortedFlowers) {
    const p = iso(flower.col, flower.row)
    drawPixelFlower(ctx, p.x, p.y, flower.type, time)
  }

  // หินตกแต่ง
  for (const [col, row] of [[1, 5], [7, 9], [2, 10]]) {
    const p = iso(col, row)

    ctx.fillStyle = '#a9a8b8'
    ctx.fillRect(p.x - 6, p.y - 6, 12, 7)
    ctx.fillRect(p.x - 3, p.y - 9, 7, 5)

    ctx.fillStyle = '#d4d1df'
    ctx.fillRect(p.x - 3, p.y - 7, 4, 2)
  }

  // ประกายดาวเล็ก ๆ
  ctx.fillStyle = '#fff8d8'

  for (let i = 0; i < 7; i++) {
    const x = ((i * 97 + Math.floor(time / 80)) % gardenWidth)
    const y = 35 + ((i * 47) % Math.max(50, gardenHeight - 35))

    ctx.fillRect(x, y, 3, 3)
  }

  ctx.restore()
}

function GardenCanvas({ flowers }: { flowers: Flower[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const flowersRef = useRef(flowers)

  useEffect(() => {
    flowersRef.current = flowers
  }, [flowers])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let animationId = 0

    const render = (time: number) => {
      drawGarden(canvas, flowersRef.current, time)
      animationId = window.requestAnimationFrame(render)
    }

    const resizeObserver = new ResizeObserver(() => {
      drawGarden(canvas, flowersRef.current, performance.now())
    })

    resizeObserver.observe(canvas)
    animationId = window.requestAnimationFrame(render)

    return () => {
      window.cancelAnimationFrame(animationId)
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="garden-canvas"
      aria-label="สวนพิกเซล Isometric ของเรา"
      role="img"
    />
  )
}

function App() {
  const [flowers, setFlowers] = useState<Flower[]>([])

  const [showLetter, setShowLetter] = useState(false)
  const [dailyLetter, setDailyLetter] = useState<DailyLetter | null>(null)
  const [isLoadingLetter, setIsLoadingLetter] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isClaiming, setIsClaiming] = useState(false)
  const [claimedToday, setClaimedToday] = useState(false)
  const [apiError, setApiError] = useState('')
  const [letterError, setLetterError] = useState('')

  // โหลดเฉพาะข้อมูลสวนและสถานะรับดอกไม้
  const loadGarden = useCallback(async () => {
    setApiError('')

    const [flowersResponse, claimResponse] = await Promise.all([
      fetch('/api/flowers'),
      fetch('/api/daily-flower-claims/today'),
    ])

    if (!flowersResponse.ok) {
      throw new Error(`โหลดดอกไม้ไม่สำเร็จ (HTTP ${flowersResponse.status})`)
    }

    if (!claimResponse.ok) {
      throw new Error(
        `โหลดสถานะรับดอกไม้ไม่สำเร็จ (HTTP ${claimResponse.status})`,
      )
    }

    const loadedFlowers = (await flowersResponse.json()) as Flower[]
    const claimStatus = (await claimResponse.json()) as {
      claimedToday: boolean
    }

    setFlowers(loadedFlowers)
    setClaimedToday(claimStatus.claimedToday)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function initializeGarden() {
      setIsLoading(true)

      try {
        await loadGarden()
      } catch (error) {
        if (cancelled) return

        console.error('โหลดข้อมูลสวนไม่สำเร็จ:', error)
        setApiError(
          'เชื่อมต่อสวนออนไลน์ไม่ได้ กรุณาตรวจสอบว่า Backend กำลังทำงานอยู่',
        )
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void initializeGarden()

    return () => {
      cancelled = true
    }
  }, [loadGarden])

  // อ่านจดหมายประจำวันจาก Backend โดยไม่เพิ่มดอกไม้
  const openDailyLetter = useCallback(async () => {
    if (isLoadingLetter) return

    setIsLoadingLetter(true)
    setLetterError('')

    try {
      const response = await fetch('/api/daily-letters/today')

      const result = (await response.json().catch(() => ({}))) as {
        date?: string
        content?: string
        flowerType?: string
        message?: string
      }

      if (!response.ok) {
        throw new Error(
          result.message ?? `โหลดจดหมายไม่สำเร็จ (HTTP ${response.status})`,
        )
      }

      const supportedFlowerTypes: LetterFlowerType[] = [
        'tulip',
        'daisy',
        'sunflower',
        'cherry-blossom',
        'rose',
        'lavender',
        'babys-breath',
        'peony',
        'hydrangea',
        'lily',
      ]

      if (
        typeof result.date !== 'string' ||
        typeof result.content !== 'string' ||
        typeof result.flowerType !== 'string' ||
        !supportedFlowerTypes.includes(result.flowerType as LetterFlowerType)
      ) {
        throw new Error('ข้อมูลจดหมายจาก Backend ไม่ถูกต้อง')
      }

      setDailyLetter({
        date: result.date,
        content: result.content,
        flowerType: result.flowerType as LetterFlowerType,
      })

      setShowLetter(true)
    } catch (error) {
      console.error('โหลดจดหมายไม่สำเร็จ:', error)
      setLetterError(
        error instanceof Error
          ? error.message
          : 'โหลดจดหมายไม่สำเร็จ กรุณาลองใหม่',
      )
    } finally {
      setIsLoadingLetter(false)
    }
  }, [isLoadingLetter])

  // รับดอกไม้ผ่าน API ตามระบบเดิม โดยไม่เปิดจดหมายอัตโนมัติ
  const plantFlower = useCallback(async () => {
    if (claimedToday || isLoading || isClaiming) return

    setIsClaiming(true)
    setApiError('')

    try {
      const response = await fetch('/api/daily-flower-claims', {
        method: 'POST',
      })

      const result = (await response.json().catch(() => ({}))) as {
        message?: string
        claimedToday?: boolean
        flower?: Flower
      }

      if (response.status === 409) {
        if (result.claimedToday) {
          setClaimedToday(true)

          // ซิงก์สวน กรณีอีกเครื่องรับดอกไม้ไปก่อนแล้ว
          const flowersResponse = await fetch('/api/flowers')

          if (flowersResponse.ok) {
            setFlowers((await flowersResponse.json()) as Flower[])
          }
        }

        window.alert(
          result.message ?? 'วันนี้สวนของเราได้รับดอกไม้แล้วนะ ♡',
        )
        return
      }

      if (!response.ok) {
        throw new Error(
          result.message ?? `รับดอกไม้ไม่สำเร็จ (HTTP ${response.status})`,
        )
      }

      await loadGarden()
    } catch (error) {
      console.error('รับดอกไม้ไม่สำเร็จ:', error)
      setApiError(
        'รับดอกไม้ไม่สำเร็จ กรุณาตรวจสอบการเชื่อมต่อแล้วลองใหม่',
      )
      window.alert(
        'ยังรับดอกไม้ไม่ได้ครับ ตรวจสอบว่า Backend เปิดอยู่แล้วลองใหม่อีกครั้ง',
      )
    } finally {
      setIsClaiming(false)
    }
  }, [claimedToday, isLoading, isClaiming, loadGarden])

  const validPlotKeys = new Set([
  '3,2', '5,2', '2,3', '4,3', '6,3',
  '3,4', '5,4', '2,5', '4,5', '6,5',
  '3,6', '5,6', '4,7', '1,4', '7,4',
  '1,6', '7,6', '2,7', '6,7', '3,8',
  '5,8', '4,9', '2,9', '6,9', '1,8',
  '7,8', '3,10', '5,10', '2,11', '6,11',
])

const flowerCount = flowers.filter((flower) =>
  validPlotKeys.has(`${flower.col},${flower.row}`),
).length
  const progress = Math.min((flowerCount / 30) * 100, 100)

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="Our Little Garden">
          <span className="brand-flower">✿</span>
          <span>Our Little Garden</span>
          <span className="brand-heart">♥</span>
        </a>

        <div className="flower-counter">
          <span className="counter-icon">🌷</span>
          <div>
            <strong>{flowerCount}</strong>
            <span>ดอกไม้ในสวน</span>
          </div>
        </div>
      </header>

      <section className="welcome-section" id="home">
        <p className="eyebrow">A LITTLE GARDEN FOR SOMEONE SPECIAL</p>
        <h1>สวนดอกไม้ให้หยิน</h1>
        <p className="welcome-description">
          จะมีดอกไม้ให้ทุกวันครับ
        </p>

        {isLoading && <p role="status">กำลังโหลดสวนออนไลน์...</p>}
        {apiError && <p role="alert">{apiError}</p>}
      </section>

      <section className="garden-card" aria-label="สวนของเรา">
        <div className="garden-heading">
          <div>
            <span className="section-kicker">OUR SHARED DREAM</span>
            <h2>พื้นที่ของเบ้บหยิน</h2>
          </div>

          <span className="garden-status">
            <span className="status-dot" />
            กำลังเติบโต
          </span>
        </div>

        <div className="garden-scene">
          <GardenCanvas flowers={flowers} />
          <div className="scene-label">
            <span>♡</span> made with love
          </div>
          <div className="scene-count">
            <span>🌼</span>
            {flowerCount} ดอก
          </div>
        </div>

        <div className="garden-progress">
          <div className="progress-label">
            <span>การเติบโตของสวน</span>
            <strong>{flowerCount} / 30 ดอก</strong>
          </div>

          <div
            className="progress-track"
            role="progressbar"
            aria-valuenow={flowerCount}
            aria-valuemin={0}
            aria-valuemax={30}
          >
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="milestones">
            <span>🌱 เริ่มต้น</span>
            <span>🌻 30 ดอก</span>
          </div>
        </div>
      </section>

      <section className="gift-card">
        <div className="gift-art" aria-hidden="true">
          <span>🌷</span>
          <span className="gift-sparkle sparkle-one">✦</span>
          <span className="gift-sparkle sparkle-two">✧</span>
        </div>

        <div className="gift-copy">
          <p className="eyebrow">A LITTLE GIFT FOR YOU</p>
          <h2>ดอกไม้สำหรับเธอ</h2>
          <p>
            วันนี้อยากให้ดอกไม้เธออีกหนึ่งดอก
            ให้สวนค่อยๆโตไปครับ
          </p>
        </div>

        <button
          className="button button-primary"
          onClick={() => void plantFlower()}
          disabled={claimedToday || isLoading || isClaiming}
        >
          <span aria-hidden="true">{claimedToday ? '♡' : '✿'}</span>
          {isClaiming
            ? 'กำลังรับดอกไม้...'
            : claimedToday
              ? 'รับดอกไม้วันนี้แล้ว ♡'
              : 'รับดอกไม้'}
        </button>

      </section>

      <section className="garden-actions">
        <button
          className="button button-secondary"
          onClick={() => void openDailyLetter()}
          disabled={isLoadingLetter}
        >
          <span aria-hidden="true">✉</span>
          {isLoadingLetter ? 'กำลังเปิดจดหมาย...' : 'อ่านจดหมาย'}
        </button>


        {letterError && (
          <p role="alert" className="helper-text">
            {letterError}
          </p>
        )}
      </section>

      <footer className="app-footer">
        <span>🌱</span>
        <p>ดอกไม้ทุกดอก ทำให้สวนของเราอบอุ่นขึ้นนะ</p>
        <span>♡</span>
      </footer>

      {showLetter && dailyLetter && (
        <div
          className="modal-backdrop"
          onClick={() => setShowLetter(false)}
          role="presentation"
        >
          <section
            className="letter-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="letter-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setShowLetter(false)}
              aria-label="ปิดจดหมาย"
            >
              ×
            </button>

            <div className="letter-stamp">💌</div>
            <p className="eyebrow">A LETTER JUST FOR YOU</p>
            <h2 id="letter-title">ถึงเธอคนพิเศษ ♡</h2>

            <div className="letter-flower">
              {LETTER_FLOWER_INFO[dailyLetter.flowerType].emoji}
            </div>

            <p className="letter-flower-name">
              {LETTER_FLOWER_INFO[dailyLetter.flowerType].name}
            </p>

            <p className="letter-message">{dailyLetter.content}</p>

            <p className="helper-text">
              จดหมายประจำวันที่ {dailyLetter.date}
            </p>

            <p className="letter-signature">
              แปลงดอกไม้ให้หยิน <span>♡</span>
            </p>

            <button
              className="button button-primary letter-button"
              onClick={() => setShowLetter(false)}
            >
              เก็บไว้ในใจ ♡
            </button>
          </section>
        </div>
      )}
    </main>
  )
}

export default App