import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router'

createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <App />
  </HashRouter>,
)
