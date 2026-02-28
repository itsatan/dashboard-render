import type { Command, CommandCategory } from '@/types/commands'

interface CommandListProps {
    categories: CommandCategory[]
    onCommandClick?: (command: Command) => void
}

export function CommandList({
    categories,
    onCommandClick
}: CommandListProps) {
    return (
        <div className="space-y-6">
            {categories.map((category) => (
                <CommandGroup key={category.id} category={category} onCommandClick={onCommandClick} />
            ))}
        </div>
    )
}

function CommandGroup({
    category,
    onCommandClick
}: {
    category: CommandCategory
    onCommandClick?: (command: Command) => void
}) {
    const Icon = category.icon
    return (
        <div>
            <h3 className="flex items-center gap-2 text-[11px] font-semibold text-zinc-800 mb-3">
                <Icon />
                {category.title}
            </h3>
            <div className="space-y-1.5">
                {category.commands.map((command) => (
                    <CommandItem key={command.id} command={command} onClick={onCommandClick} />
                ))}
            </div>
        </div>
    )
}

function CommandItem({
    command,
    onClick
}: {
    command: Command
    onClick?: (command: Command) => void
}) {
    return (
        <button
            className="w-full flex items-center justify-between px-3 py-2 rounded-md border border-transparent bg-zinc-50 hover:border-zinc-200 hover:bg-white transition-all group"
            onClick={() => onClick?.(command)}
        >
            <span className="text-[12px] text-zinc-600">{command.label}</span>
            <kbd className="text-[9px] text-zinc-400 font-sans group-hover:text-zinc-900 transition-colors">
                {command.shortcut}
            </kbd>
        </button>
    )
}
