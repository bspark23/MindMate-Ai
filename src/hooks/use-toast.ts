// Simple toast hook placeholder
export function toast({ title, description }: { title: string; description?: string; duration?: number }) {
  alert(`${title}${description ? '\n' + description : ''}`)
}