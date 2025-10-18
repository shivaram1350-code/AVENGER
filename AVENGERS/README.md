# Mobile VR Relaxation Experience

A mobile-compatible 3D website that provides a virtual reality experience using only the device's gyroscope sensor for navigation.

## Features

- **Gyroscope Control**: Look around by physically rotating your mobile device
- **360° Relaxing Environment**: Beautiful skybox with animated elements
- **Breathing Guide**: Interactive breathing circle with guided instructions
- **Mobile Optimized**: Works on both Android and iOS browsers
- **Fallback Support**: Touch controls for devices without gyroscope support
- **Permission Handling**: Proper iOS motion sensor permission requests

## How to Use

1. **Open on Mobile Device**: Access the website on your mobile phone or tablet
2. **Grant Permissions**: Allow motion sensor access when prompted (iOS 13+)
3. **Look Around**: Rotate your device to explore the 360° environment
4. **Follow Breathing Guide**: Use the animated circle to practice breathing exercises
5. **Reset View**: Tap "Reset View" to return to the starting position

## Browser Compatibility

- **iOS Safari**: Full gyroscope support with permission request
- **Android Chrome**: Direct gyroscope access
- **Other Mobile Browsers**: Fallback touch controls available

## Technical Details

- **Framework**: A-Frame (WebGL-based 3D rendering)
- **Motion API**: DeviceOrientationEvent for gyroscope data
- **Responsive Design**: Optimized for all mobile screen sizes
- **Performance**: Smooth 60fps animations with motion smoothing

## Files Structure

- `index.html` - Main HTML structure with A-Frame scene
- `style.css` - Mobile-responsive styling and animations
- `script.js` - Gyroscope handling and camera control logic

## Getting Started

1. Host the files on a web server (required for gyroscope access)
2. Open `index.html` on a mobile device
3. Grant motion sensor permissions when prompted
4. Enjoy the relaxing VR experience!

## Troubleshooting

- **No Motion Control**: Your device may not support gyroscope - touch controls will be available
- **Permission Denied**: Try refreshing the page and granting permissions again
- **Performance Issues**: Close other apps to free up device resources

## Privacy

This application only uses motion sensor data locally and does not collect or transmit any personal information.
