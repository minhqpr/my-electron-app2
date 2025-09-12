# My Electron App

A modern Electron application built with Electron Forge for easy packaging, building, and publishing.

## Features

- 🚀 Built with Electron Forge for streamlined development
- 📦 Cross-platform packaging (Windows, macOS, Linux)
- 🔒 Security features with Electron Fuses
- 🎨 Modern UI with preload script security
- 📱 Responsive design

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/my-electron-app.git
cd my-electron-app
```

2. Install dependencies:
```bash
npm install
```

## Development

### Start the application in development mode:
```bash
npm start
# or
npm run dev
```

### Available Scripts

- `npm start` / `npm run dev` - Start the app in development mode
- `npm run package` - Package the app without creating installers
- `npm run make` / `npm run build` - Build installers for all platforms
- `npm run publish` - Publish the app to configured publishers
- `npm run clean` - Clean build artifacts

## Building for Production

### Package the app:
```bash
npm run package
```

### Create installers:
```bash
npm run make
```

This will create installers for:
- **Windows**: Squirrel installer (.exe)
- **macOS**: ZIP archive (.zip)
- **Linux**: DEB and RPM packages

## Publishing

### Configure Publishers

Before publishing, you need to configure publishers in your `forge.config.js`. Supported publishers include:

- GitHub Releases
- S3
- Snap Store
- And more...

### Publish to configured publishers:
```bash
npm run publish
```

## Code Signing (Optional)

### macOS Code Signing

1. Get a Developer ID from Apple
2. Update the `osxSign` configuration in `forge.config.js`
3. Set environment variables:
```bash
export APPLE_ID="your-apple-id@example.com"
export APPLE_ID_PASSWORD="your-app-specific-password"
```

### Windows Code Signing

1. Get a code signing certificate
2. Update the `sign` configuration in `forge.config.js`

## Project Structure

```
my-electron-app/
├── assets/                 # App icons and resources
├── index.js               # Main process
├── preload.js             # Preload script
├── renderer.js            # Renderer process
├── index.html             # Main HTML file
├── forge.config.js        # Electron Forge configuration
├── package.json           # Project configuration
└── README.md              # This file
```

## Security Features

This app includes several security features:

- **Context Isolation**: Enabled by default
- **Node Integration**: Disabled in renderer
- **Electron Fuses**: Security features enabled
- **CSP**: Content Security Policy implemented

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue on GitHub
- Check the [Electron Forge documentation](https://www.electronforge.io/)
- Visit the [Electron documentation](https://www.electronjs.org/docs)
