import React, { useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Camera } from '@phosphor-icons/react'

interface CameraPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement>
  canvasRef: React.RefObject<HTMLCanvasElement>
  isActive: boolean
  motionDetected: boolean
  hasPermission: boolean | null
  className?: string
}

export function CameraPreview({
  videoRef,
  canvasRef,
  isActive,
  motionDetected,
  hasPermission,
  className
}: CameraPreviewProps) {
  useEffect(() => {
    if (videoRef.current && hasPermission) {
      videoRef.current.play()
    }
  }, [hasPermission, videoRef])

  if (hasPermission === false) {
    return (
      <div className={cn(
        'relative flex items-center justify-center bg-muted rounded-lg overflow-hidden',
        'min-h-[300px] border-2 border-dashed border-border',
        className
      )}>
        <div className="text-center p-6">
          <Camera size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Camera Access Required</h3>
          <p className="text-sm text-muted-foreground">
            Please allow camera access to enable motion detection
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('relative rounded-lg overflow-hidden', className)}>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
      />
      <canvas
        ref={canvasRef}
        className="hidden"
      />
      
      {/* Status overlay */}
      <div className="absolute top-4 left-4 flex gap-2">
        <Badge 
          variant={isActive ? "default" : "secondary"}
          className={cn(
            "font-medium",
            isActive && "bg-primary text-primary-foreground animate-pulse"
          )}
        >
          {isActive ? "MONITORING" : "STANDBY"}
        </Badge>
        
        {motionDetected && (
          <Badge 
            variant="destructive"
            className="bg-accent text-accent-foreground animate-pulse"
          >
            MOTION DETECTED
          </Badge>
        )}
      </div>

      {/* Motion detection overlay */}
      {motionDetected && (
        <div className="absolute inset-0 border-4 border-accent animate-pulse" />
      )}
    </div>
  )
}