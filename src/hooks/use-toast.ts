// Simple toast hook placeholder
export function toast({ title, description, duration }: { title: string; description?: string; duration?: number }) {
  alert(`${title}${description ? '\n' + description : ''}`)
}