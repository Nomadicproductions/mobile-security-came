import React, { useState, useEffect } from 'react'
import { useMotionDetection } from '@/hooks/use-motion-detection'
import { useKV } from '@github/spark/hooks'
import { CameraPreview } from '@/components/camera-preview'
import { ControlPanel } from '@/components/control-panel'
import { PhotoGallery, type CapturedPhoto } from '@/components/photo-gallery'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Info } from '@phosphor-icons/react'
import { toast } from 'sonner'

function App() {
  const [sensitivity, setSensitivity] = useKV('motion-sensitivity', 0.05)
  const [photos, setPhotos] = useKV<CapturedPhoto[]>('captured-photos', [])
  const [showGallery, setShowGallery] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)

  const motionDetection = useMotionDetection({
    sensitivity,
    cooldownMs: 2000
  })

  // Auto-capture when motion is detected
  useEffect(() => {
    if (motionDetection.motionDetected && motionDetection.isActive) {
      const photoData = motionDetection.capturePhoto()
      if (photoData) {
        const newPhoto: CapturedPhoto = {
          id: Date.now().toString(),
          dataUrl: photoData,
          timestamp: Date.now()
        }
        
        setPhotos(currentPhotos => [newPhoto, ...currentPhotos])
        toast.success('Motion detected - Photo captured!')
      }
    }
  }, [motionDetection.motionDetected, motionDetection.isActive, motionDetection.capturePhoto, setPhotos])

  const handleSensitivityChange = (value: number[]) => {
    setSensitivity(value[0])
  }

  const handleToggleMonitoring = () => {
    if (motionDetection.isActive) {
      motionDetection.stopMonitoring()
      toast.info('Monitoring stopped')
    } else {
      motionDetection.startMonitoring()
      toast.success('Monitoring started')
      setShowWelcome(false)
    }
  }

  const handleDeletePhoto = (id: string) => {
    setPhotos(currentPhotos => currentPhotos.filter(photo => photo.id !== id))
    toast.success('Photo deleted')
  }

  const handleClearAllPhotos = () => {
    setPhotos([])
    toast.success('All photos cleared')
  }

  if (showGallery) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setShowGallery(false)}
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Monitor
            </Button>
            <h1 className="text-2xl font-bold">Photo Gallery</h1>
          </div>
          
          <PhotoGallery
            photos={photos}
            onDeletePhoto={handleDeletePhoto}
            onClearAll={handleClearAllPhotos}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Security Monitor</h1>
          <p className="text-muted-foreground">
            AI-powered motion detection for your personal security
          </p>
        </div>

        {showWelcome && (
          <Alert>
            <Info size={16} />
            <AlertDescription>
              This app uses your device's camera to detect motion and capture photos. 
              You'll need to grant camera permission when prompted. For security monitoring, 
              keep this tab open and active.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Camera Preview */}
          <div className="lg:col-span-2">
            <Card className="p-4">
              <CameraPreview
                videoRef={motionDetection.videoRef}
                canvasRef={motionDetection.canvasRef}
                isActive={motionDetection.isActive}
                motionDetected={motionDetection.motionDetected}
                hasPermission={motionDetection.hasPermission}
                className="aspect-video"
              />
            </Card>
          </div>

          {/* Control Panel */}
          <div>
            <ControlPanel
              isActive={motionDetection.isActive}
              sensitivity={sensitivity}
              capturedCount={photos.length}
              onToggleMonitoring={handleToggleMonitoring}
              onSensitivityChange={handleSensitivityChange}
              onShowGallery={() => setShowGallery(true)}
              hasPermission={motionDetection.hasPermission}
            />
          </div>
        </div>

        {/* Recent Photos Preview */}
        {photos.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Captures</h3>
            <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
              {photos.slice(0, 12).map((photo) => (
                <img
                  key={photo.id}
                  src={photo.dataUrl}
                  alt="Recent capture"
                  className="aspect-square object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setShowGallery(true)}
                />
              ))}
              {photos.length > 12 && (
                <div 
                  className="aspect-square bg-muted rounded flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={() => setShowGallery(true)}
                >
                  <span className="text-xs font-medium">+{photos.length - 12}</span>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

export default App