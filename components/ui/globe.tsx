"use client"

import { useEffect, useRef } from "react"
import createGlobe, { COBEOptions } from "cobe"
import { useMotionValue, useSpring } from "motion/react"

import { cn } from "@/lib/utils"

const MOVEMENT_DAMPING = 1400

const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1],
  markerColor: [137 / 255, 207 / 255, 240 / 255],
  glowColor: [1, 1, 1],
  markers: [
    { location: [28.6139, 77.209], size: 0.06 }, // Delhi
    { location: [19.076, 72.8777], size: 0.06 }, // Mumbai
    { location: [12.9716, 77.5946], size: 0.05 }, // Bengaluru
    { location: [17.385, 78.4867], size: 0.045 }, // Hyderabad
    { location: [13.0827, 80.2707], size: 0.04 }, // Chennai
    { location: [22.5726, 88.3639], size: 0.04 }, // Kolkata
    { location: [18.5204, 73.8567], size: 0.04 }, // Pune
    { location: [23.0225, 72.5714], size: 0.035 }, // Ahmedabad
    { location: [6.5244, 3.3792], size: 0.05 }, // Lagos
    { location: [9.0765, 7.3986], size: 0.035 }, // Abuja
    { location: [-1.2921, 36.8219], size: 0.04 }, // Nairobi
    { location: [30.0444, 31.2357], size: 0.045 }, // Cairo
    { location: [31.2001, 29.9187], size: 0.03 }, // Alexandria
    { location: [-26.2041, 28.0473], size: 0.05 }, // Johannesburg
    { location: [-33.9249, 18.4241], size: 0.04 }, // Cape Town
    { location: [24.8607, 67.0011], size: 0.04 }, // Karachi
    { location: [33.6844, 73.0479], size: 0.03 }, // Islamabad
    { location: [14.5995, 120.9842], size: 0.045 }, // Manila
    { location: [-6.2088, 106.8456], size: 0.05 }, // Jakarta
    { location: [13.7563, 100.5018], size: 0.03 }, // Bangkok
    { location: [3.139, 101.6869], size: 0.03 }, // Kuala Lumpur
    { location: [1.3521, 103.8198], size: 0.03 }, // Singapore
    { location: [23.8103, 90.4125], size: 0.04 }, // Dhaka
    { location: [16.8409, 96.1735], size: 0.03 }, // Yangon
    { location: [41.0082, 28.9784], size: 0.035 }, // Istanbul
    { location: [52.52, 13.405], size: 0.03 }, // Berlin
    { location: [51.5072, -0.1276], size: 0.03 }, // London
    { location: [40.4168, -3.7038], size: 0.03 }, // Madrid
    { location: [50.4501, 30.5234], size: 0.03 }, // Kyiv
    { location: [-23.5505, -46.6333], size: 0.045 }, // Sao Paulo
    { location: [-34.6037, -58.3816], size: 0.03 }, // Buenos Aires
    { location: [19.4326, -99.1332], size: 0.04 }, // Mexico City
    { location: [4.711, -74.0721], size: 0.03 }, // Bogota
    { location: [40.7128, -74.006], size: 0.03 }, // New York
    { location: [34.0522, -118.2437], size: 0.03 }, // Los Angeles
    { location: [43.6532, -79.3832], size: 0.03 }, // Toronto
    { location: [35.6762, 139.6503], size: 0.04 }, // Tokyo
    { location: [37.5665, 126.978], size: 0.03 }, // Seoul
    { location: [39.9042, 116.4074], size: 0.04 }, // Beijing
    { location: [31.2304, 121.4737], size: 0.04 }, // Shanghai
    { location: [22.3193, 114.1694], size: 0.03 }, // Hong Kong
    { location: [25.2048, 55.2708], size: 0.03 }, // Dubai
    { location: [-33.8688, 151.2093], size: 0.03 }, // Sydney
  ],
}

export function Globe({
  className,
  config = GLOBE_CONFIG,
}: {
  className?: string
  config?: COBEOptions
}) {
  let phi = 0
  let width = 0
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<number | null>(null)
  const pointerInteractionMovement = useRef(0)

  const r = useMotionValue(0)
  const rs = useSpring(r, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  })

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab"
    }
  }

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current
      pointerInteractionMovement.current = delta
      r.set(r.get() + delta / MOVEMENT_DAMPING)
    }
  }

  useEffect(() => {
    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth
      }
    }

    window.addEventListener("resize", onResize)
    onResize()

    const globe = createGlobe(canvasRef.current!, {
      ...config,
      width: width * 2,
      height: width * 2,
      onRender: (state) => {
        if (!pointerInteracting.current) phi += 0.005
        state.phi = phi + rs.get()
        state.width = width * 2
        state.height = width * 2
      },
    })

    setTimeout(() => (canvasRef.current!.style.opacity = "1"), 0)
    return () => {
      globe.destroy()
      window.removeEventListener("resize", onResize)
    }
  }, [rs, config])

  return (
    <div
      className={cn(
        "absolute inset-0 mx-auto aspect-[1/1] w-full max-w-[600px]",
        className
      )}
    >
      <canvas
        className={cn(
          "size-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]"
        )}
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX
          updatePointerInteraction(e.clientX)
        }}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
    </div>
  )
}
