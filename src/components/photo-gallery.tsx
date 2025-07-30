import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Trash2, Download } from '@phosphor-icons/react'
import { format } from 'date-fns'

export interface CapturedPhoto {
  id: string
  dataUrl: string
  timestamp: number
}

interface PhotoGalleryProps {
  photos: CapturedPhoto[]
  onDeletePhoto: (id: string) => void
  onClearAll: () => void
}

export function PhotoGallery({ photos, onDeletePhoto, onClearAll }: PhotoGalleryProps) {
  const downloadPhoto = (photo: CapturedPhoto) => {
    const link = document.createElement('a')
    link.href = photo.dataUrl
    link.download = `security-${format(photo.timestamp, 'yyyy-MM-dd-HH-mm-ss')}.jpg`
    link.click()
  }

  if (photos.length === 0) {
    return (
      <Card className="p-8 text-center">
        <h3 className="text-lg font-semibold mb-2">No Photos Captured</h3>
        <p className="text-muted-foreground">
          Start monitoring to automatically capture photos when motion is detected
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Captured Photos ({photos.length})
        </h3>
        {photos.length > 0 && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onClearAll}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 size={16} className="mr-2" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <Dialog key={photo.id}>
            <DialogTrigger asChild>
              <Card className="p-2 cursor-pointer hover:shadow-md transition-shadow">
                <img
                  src={photo.dataUrl}
                  alt="Security capture"
                  className="w-full aspect-video object-cover rounded"
                />
                <p className="text-xs text-muted-foreground mt-2 px-1">
                  {format(photo.timestamp, 'MMM d, HH:mm:ss')}
                </p>
              </Card>
            </DialogTrigger>
            
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>
                  Photo captured on {format(photo.timestamp, 'MMMM d, yyyy at HH:mm:ss')}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <img
                  src={photo.dataUrl}
                  alt="Security capture"
                  className="w-full rounded-lg"
                />
                
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => downloadPhoto(photo)}
                  >
                    <Download size={16} className="mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => onDeletePhoto(photo.id)}
                  >
                    <Trash2 size={16} className="mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  )
}