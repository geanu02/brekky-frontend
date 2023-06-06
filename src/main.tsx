import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import BrekkyProvider from './contexts/BrekkyProvider.tsx'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
<BrekkyProvider>
    <App />
</BrekkyProvider>
)
