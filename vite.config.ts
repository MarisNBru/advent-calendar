import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// TODO: Replace {REPO_NAME} with your actual GitHub repository name!
// For project pages: base should be '/{REPO_NAME}/'
// For user/org pages (username.github.io): base should be '/'
export default defineConfig({
  plugins: [react()],
  base: '/advent-calendar/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
})
