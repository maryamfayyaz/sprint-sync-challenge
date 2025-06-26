"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Shield, Settings, Download, User } from "lucide-react"
import { logger } from "@/lib/logger"

interface ProfileViewProps {
  user: { id: number; email: string; name?: string; isAdmin: boolean } | null
}

export function ProfileView({ user }: ProfileViewProps) {
  const [showLogs, setShowLogs] = useState(false)

  const handleDownloadLogs = () => {
    const logs = logger.getLogs()
    const dataStr = JSON.stringify(logs, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `sprintsync-logs-${new Date().toISOString().split("T")[0]}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const handleClearLogs = () => {
    if (confirm("Are you sure you want to clear all logs?")) {
      logger.clearLogs()
      setShowLogs(false)
    }
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No user information available</p>
      </div>
    )
  }

  const logs = logger.getLogs()
  const recentLogs = logs.slice(-10).reverse()

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile</h2>
        <p className="text-gray-600">Manage your account and view activity logs</p>
      </div>

      {/* User Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-gray-500" />
            <span className="text-gray-900">{user.email}</span>
          </div>

          {user.name && (
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-gray-900">{user.name}</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Shield className="h-4 w-4 text-gray-500" />
            <Badge variant={user.isAdmin ? "default" : "secondary"}>{user.isAdmin ? "Administrator" : "User"}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Activity Logs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Activity Logs
              </CardTitle>
              <CardDescription>View your recent activity and system logs ({logs.length} total entries)</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadLogs}
                className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLogs(!showLogs)}
                className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              >
                {showLogs ? "Hide" : "Show"} Logs
              </Button>
            </div>
          </div>
        </CardHeader>
        {showLogs && (
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {recentLogs.map((log, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg text-sm ${
                    log.level === "error"
                      ? "bg-red-50 border border-red-200"
                      : log.level === "warn"
                        ? "bg-yellow-50 border border-yellow-200"
                        : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Badge
                      variant={log.level === "error" ? "destructive" : log.level === "warn" ? "secondary" : "outline"}
                      className="text-xs"
                    >
                      {log.level.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="font-medium text-gray-900">{log.message}</p>
                  {log.data && (
                    <pre className="mt-2 text-xs text-gray-600 bg-white p-2 rounded border overflow-x-auto">
                      {JSON.stringify(log.data, null, 2)}
                    </pre>
                  )}
                </div>
              ))}
              {logs.length === 0 && <div className="text-center text-gray-400 py-8">No activity logs yet</div>}
            </div>
            {logs.length > 0 && (
              <div className="mt-4 pt-4 border-t flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearLogs}
                  className="bg-white text-red-600 border-red-300 hover:bg-red-50"
                >
                  Clear All Logs
                </Button>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  )
}
