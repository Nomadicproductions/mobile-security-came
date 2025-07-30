import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Play, Pause, Settings, Images } from '@phosphor-icons/react'

interface ControlPanelProps {
  isActive: boolean
  sensitivity: number
  capturedCount: number
  onToggleMonitoring: () => void
  onSensitivityChange: (value: number[]) => void
  onShowGallery: () => void
  hasPermission: boolean | null
}

export function ControlPanel({
  isActive,
  sensitivity,
  capturedCount,
  onToggleMonitoring,
  onSensitivityChange,
  onShowGallery,
  hasPermission
}: ControlPanelProps) {
  const getSensitivityLabel = (value: number) => {
    if (value < 0.02) return 'Very Low'
    if (value < 0.05) return 'Low'
    if (value < 0.1) return 'Medium'
    if (value < 0.2) return 'High'
    return 'Very High'
  }

  return (
    <div className="space-y-4">
      {/* Main Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Security Monitor
            <Badge variant={isActive ? "default" : "secondary"}>
              {isActive ? "Active" : "Inactive"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={onToggleMonitoring}
            disabled={hasPermission === false}
            size="lg"
            className="w-full"
            variant={isActive ? "destructive" : "default"}
          >
            {isActive ? (
              <>
                <Pause size={20} className="mr-2" />
                Stop Monitoring
              </>
            ) : (
              <>
                <Play size={20} className="mr-2" />
                Start Monitoring
              </>
            )}
          </Button>

          {hasPermission === false && (
            <p className="text-sm text-muted-foreground text-center">
              Camera permission required to start monitoring
            </p>
          )}
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings size={20} className="mr-2" />
            Detection Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="sensitivity">Motion Sensitivity</Label>
              <Badge variant="outline">
                {getSensitivityLabel(sensitivity)}
              </Badge>
            </div>
            <Slider
              id="sensitivity"
              value={[sensitivity]}
              onValueChange={onSensitivityChange}
              min={0.01}
              max={0.3}
              step={0.01}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Adjust how sensitive motion detection should be
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Gallery Access */}
      <Card>
        <CardContent className="pt-6">
          <Button
            onClick={onShowGallery}
            variant="outline"
            className="w-full"
          >
            <Images size={20} className="mr-2" />
            View Gallery ({capturedCount} photos)
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}