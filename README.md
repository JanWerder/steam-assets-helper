# Steam Asset Helper

A web tool for generating all required Steam store graphics from your cover art. Upload your horizontal and vertical cover images, adjust cropping for each asset type, and export everything at once.

**[Open App](https://janwerder.github.io/steam-assets-helper/)**

## Supported Assets

| Store Assets | Library Assets | Optional |
|-------------|----------------|----------|
| Header Capsule (460×215) | Library Capsule (600×900) | Community Icon (32×32) |
| Small Capsule (231×87) | Library Header (460×215) | Client Icon (32×32) |
| Main Capsule (616×353) | Library Hero (1920×620) | Page Background (1438×810) |
| Vertical Capsule (374×448) | Library Logo (1280×720) | Event Cover (800×450) |
| | | Broadcast Left Panel (155×337) |
| | | Broadcast Right Panel (155×337) |

## Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

## Tech Stack

- Vue 3 + TypeScript
- Konva.js for canvas manipulation
- Tailwind CSS v4
- Vite