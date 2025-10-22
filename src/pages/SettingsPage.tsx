import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings, Zap } from 'lucide-react'
import { ApiTestButton } from '@/components/ApiTestButton'
import { DebugPanel } from '@/components/DebugPanel'

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-lg text-muted-foreground">
          Customize your MindMate experience
        </p>
      </div>

      {/* API Status */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            API Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Test the journal AI API connection to ensure everything is working properly.
            </p>
            <ApiTestButton />
          </div>
        </CardContent>
      </Card>

      {/* Debug Panel */}
      <DebugPanel />

      <Card className="shadow-lg border-0 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-600" />
            App Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              More settings coming soon! You'll be able to customize themes, notifications, and more.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}