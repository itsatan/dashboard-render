export interface Command {
    id: string
    label: string
    shortcut: string
}

export interface CommandCategory {
    id: string
    title: string
    icon: React.ComponentType<{ className?: string }>
    commands: Command[]
}
