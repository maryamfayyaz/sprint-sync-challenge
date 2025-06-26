"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bot, Copy, CheckCircle } from "lucide-react"
import { apiClient } from "@/lib/api-client"

interface AISuggestModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AISuggestModal({ open, onOpenChange }: AISuggestModalProps) {
  const [title, setTitle] = useState("")
  const [suggestion, setSuggestion] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setLoading(true)
    setError("")
    setSuggestion("")

    try {
      const response = await apiClient.post("/ai/suggest", { title: title.trim() })
      setSuggestion(response.data.description)
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to get AI suggestion")
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (suggestion) {
      await navigator.clipboard.writeText(suggestion)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleClose = () => {
    setTitle("")
    setSuggestion("")
    setError("")
    setCopied(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600" />
            AI Task Suggestion
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ai-title">Task Title</Label>
            <Input
              id="ai-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a brief task title"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading || !title.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? "Getting AI Suggestion..." : "Get AI Suggestion"}
          </Button>
        </form>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {suggestion && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>AI Suggested Description</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{suggestion}</p>
            </div>
            <p className="text-xs text-gray-500">You can copy this description and use it when creating a new task.</p>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
