# Security Monitor - Motion Detection Camera App

A browser-based security camera application that uses device camera and motion detection to capture photos when movement is detected, designed for authorized surveillance of personal spaces.

**Experience Qualities**:
1. **Reliable** - Consistent motion detection with minimal false positives for trustworthy monitoring
2. **Intuitive** - Simple one-tap activation with clear visual feedback on monitoring status  
3. **Responsive** - Immediate capture and notification when motion is detected

**Complexity Level**: Light Application (multiple features with basic state)
- Combines camera access, motion detection algorithms, image capture, and persistent storage with straightforward user controls

## Essential Features

### Motion Detection Monitoring
- **Functionality**: Continuously analyzes camera feed to detect movement using frame comparison
- **Purpose**: Automatically triggers photo capture when suspicious activity occurs
- **Trigger**: User activates monitoring mode via prominent "Start Monitoring" button
- **Progression**: Tap Start → Camera permission → Live preview → Motion detection active → Auto-capture on movement → Save to gallery
- **Success criteria**: Captures clear photos within 1 second of detecting motion with <5% false positive rate

### Photo Gallery & Management
- **Functionality**: Displays captured photos with timestamps in chronological grid layout
- **Purpose**: Review security footage and manage storage space
- **Trigger**: User taps "View Gallery" from main screen
- **Progression**: Tap Gallery → Grid view of photos → Tap photo for full view → Options to delete/share
- **Success criteria**: All photos load quickly with accurate timestamps and smooth navigation

### Sensitivity Controls
- **Functionality**: Adjustable slider for motion detection threshold
- **Purpose**: Customize detection based on environment (busy vs quiet areas)
- **Trigger**: User accesses settings panel
- **Progression**: Open settings → Adjust sensitivity slider → See live preview update → Save preferences
- **Success criteria**: Sensitivity changes reflect immediately in detection behavior

### Session Status & Controls  
- **Functionality**: Clear visual indicators of monitoring state with start/stop controls
- **Purpose**: User confidence in system status and easy control
- **Trigger**: App launch or status change
- **Progression**: App opens → Status displayed → One-tap toggle → Confirmation feedback
- **Success criteria**: Status always accurate with immediate response to user input

## Edge Case Handling

- **Camera Permission Denied**: Show clear explanation with steps to enable in device settings
- **Low Light Conditions**: Automatically adjust detection sensitivity and provide user notification
- **Storage Full**: Auto-delete oldest photos with user notification and manual override option
- **Background App Suspension**: Warn user that monitoring stops when app is backgrounded
- **Network Connectivity Loss**: Continue local operation with sync indicator for cloud features
- **Rapid Motion Sequences**: Implement cooldown period to prevent excessive photo capture

## Design Direction

The design should feel professional and trustworthy like a legitimate security system, with clean lines and subtle technology aesthetics that inspire confidence while remaining approachable for home users.

## Color Selection

Triadic color scheme using security-industry inspired colors that balance professionalism with approachability.

- **Primary Color**: Deep Blue (oklch(0.3 0.15 240)) - Conveys trust, security, and technological reliability
- **Secondary Colors**: Charcoal Gray (oklch(0.25 0.02 240)) for backgrounds, Light Gray (oklch(0.9 0.01 240)) for cards
- **Accent Color**: Alert Orange (oklch(0.65 0.2 45)) - Attention-grabbing for active monitoring states and alerts
- **Foreground/Background Pairings**: 
  - Background White (oklch(0.98 0.01 240)): Charcoal text (oklch(0.25 0.02 240)) - Ratio 12.2:1 ✓
  - Primary Blue (oklch(0.3 0.15 240)): White text (oklch(0.98 0.01 240)) - Ratio 8.9:1 ✓  
  - Accent Orange (oklch(0.65 0.2 45)): White text (oklch(0.98 0.01 240)) - Ratio 4.6:1 ✓
  - Card Gray (oklch(0.9 0.01 240)): Charcoal text (oklch(0.25 0.02 240)) - Ratio 10.8:1 ✓

## Font Selection

Clean, technical sans-serif typography that conveys precision and reliability while remaining highly legible across device sizes - using Inter for its excellent screen rendering and professional appearance.

- **Typographic Hierarchy**: 
  - H1 (App Title): Inter Bold/32px/tight letter spacing
  - H2 (Section Headers): Inter SemiBold/24px/normal spacing  
  - H3 (Feature Labels): Inter Medium/18px/normal spacing
  - Body (Interface Text): Inter Regular/16px/relaxed spacing
  - Caption (Timestamps): Inter Regular/14px/wide spacing

## Animations

Subtle, purposeful animations that reinforce the security monitoring context - quick state changes that feel responsive and confident without being playful or distracting.

- **Purposeful Meaning**: Smooth transitions convey system reliability, pulse effects for active monitoring status, and quick feedback for user actions
- **Hierarchy of Movement**: Active monitoring state gets subtle pulse animation, photo capture gets satisfying snap effect, navigation uses professional slide transitions

## Component Selection

- **Components**: Card for status display, Button variants for primary/secondary actions, Badge for monitoring state, Dialog for settings, ScrollArea for photo gallery, Slider for sensitivity, Alert for system messages
- **Customizations**: Custom camera preview component, motion detection visualization overlay, photo grid with gesture support
- **States**: Monitoring button shows distinct active/inactive states with color and icon changes, sensitivity slider provides real-time feedback
- **Icon Selection**: Camera, Play/Pause for monitoring control, Settings gear, Image gallery, Alert triangle for warnings
- **Spacing**: Generous padding (p-6) for main areas, consistent gaps (gap-4) between related elements, compact spacing (p-2) for dense photo grid
- **Mobile**: Single column layout with bottom navigation, large touch targets (min 48px), swipe gestures for photo navigation, responsive camera preview sizing