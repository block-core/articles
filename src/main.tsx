import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter'

import App from './App.tsx'
import './index.css'
import 'highlight.js/styles/github-dark.css'

createRoot(document.getElementById("root")!).render(<App />);
