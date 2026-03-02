import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { SharedPage } from '@/shared/shared-page'
import { App } from '@/app'
import './index.css'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/s/:id" element={<SharedPage />} />
            </Routes>
        </BrowserRouter>
        <Toaster position="bottom-right" />
    </StrictMode>,
)
