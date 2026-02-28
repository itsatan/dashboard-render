import { Header } from '@/header/header'
import { Sidebar } from '@/sidebar/sidebar'
import { PreviewPanel } from '@/preview/preview-panel'

export function App() {
    return (
        <div className="flex h-screen flex-col">
            <Header />
            <main className="flex flex-1 overflow-hidden bg-zinc-50">
                <Sidebar />
                <PreviewPanel />
            </main>
        </div>
    )
}
