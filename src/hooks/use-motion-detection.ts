import { useRef, useEffect, useState, useCallback } from 'react'

export interface MotionDetectionConfig {
  sensitivity: number
  cooldownMs: number
}

export function useMotionDetection(config: MotionDetectionConfig) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const previousFrameRef = useRef<ImageData | null>(null)
  const lastDetectionRef = useRef<number>(0)
  
  const [isActive, setIsActive] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [motionDetected, setMotionDetected] = useState(false)

  const onMotionDetected = useCallback(() => {
    const now = Date.now()
    if (now - lastDetectionRef.current < config.cooldownMs) return
    
    lastDetectionRef.current = now
    setMotionDetected(true)
    setTimeout(() => setMotionDetected(false), 1000)
  }, [config.cooldownMs])

  const detectMotion = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isActive) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    if (!ctx || video.videoWidth === 0) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const currentFrame = ctx.getImageData(0, 0, canvas.width, canvas.height)
    
    if (previousFrameRef.current) {
      let diffPixels = 0
      const totalPixels = currentFrame.data.length / 4
      
      for (let i = 0; i < currentFrame.data.length; i += 4) {
        const rDiff = Math.abs(currentFrame.data[i] - previousFrameRef.current.data[i])
        const gDiff = Math.abs(currentFrame.data[i + 1] - previousFrameRef.current.data[i + 1])
        const bDiff = Math.abs(currentFrame.data[i + 2] - previousFrameRef.current.data[i + 2])
        
        if (rDiff + gDiff + bDiff > 50) {
          diffPixels++
        }
      }
      
      const changePercentage = diffPixels / totalPixels
      if (changePercentage > config.sensitivity) {
        onMotionDetected()
      }
    }
    
    previousFrameRef.current = currentFrame
  }, [isActive, config.sensitivity, onMotionDetected])

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      
      setStream(mediaStream)
      setHasPermission(true)
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error('Camera access denied:', error)
      setHasPermission(false)
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setIsActive(false)
    previousFrameRef.current = null
  }, [stream])

  const startMonitoring = useCallback(() => {
    if (hasPermission) {
      setIsActive(true)
    } else {
      startCamera()
    }
  }, [hasPermission, startCamera])

  const stopMonitoring = useCallback(() => {
    setIsActive(false)
    previousFrameRef.current = null
  }, [])

  const capturePhoto = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current) return null
    
    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    if (!ctx || video.videoWidth === 0) return null
    
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    
    return canvas.toDataURL('image/jpeg', 0.8)
  }, [])

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(detectMotion, 100)
      return () => clearInterval(interval)
    }
  }, [isActive, detectMotion])

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [stream])

  return {
    videoRef,
    canvasRef,
    isActive,
    hasPermission,
    motionDetected,
    startCamera,
    stopCamera,
    startMonitoring,
    stopMonitoring,
    capturePhoto
  }
}