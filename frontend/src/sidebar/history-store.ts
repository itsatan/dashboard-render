import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface HistoryItem {
    id: string
    prompt: string
    timestamp: number
}

interface HistoryState {
    items: HistoryItem[]
    add: (prompt: string) => void
    remove: (id: string) => void
    clear: () => void
}

const MAX_HISTORY_ITEMS = 20

export const useHistoryStore = create<HistoryState>()(
    persist(
        (set) => ({
            items: [],
            add: (prompt) =>
                set((state) => {
                    const newItem: HistoryItem = {
                        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                        prompt,
                        timestamp: Date.now(),
                    }
                    const newItems = [newItem, ...state.items].slice(0, MAX_HISTORY_ITEMS)
                    return { items: newItems }
                }),
            remove: (id) =>
                set((state) => ({
                    items: state.items.filter((item) => item.id !== id),
                })),
            clear: () => set({ items: [] }),
        }),
        {
            name: 'dashboard-history',
        }
    )
)
