"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Plus, Sparkles, Loader2 } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

interface AISuggestion {
  title: string
  description: string
}

interface AISuggestModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTaskCreated?: () => void
}

export function AISuggestModal({ open, onOpenChange, onTaskCreated }: AISuggestModalProps) {
  const [prompt, setPrompt] = useState("")
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [creatingTaskId, setCreatingTaskId] = useState<number | null>(null)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleGetSuggestions = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setLoading(true)
    setError("")
    setSuggestions([])

    try {
      const response = await apiClient.post("/ai/suggest", {
        prompt: prompt.trim(),
      })

      if (response.suggestions && Array.isArray(response.suggestions)) {
        setSuggestions(response.suggestions)
      } else {
        throw new Error("Invalid response format from AI service")
      }
    } catch (error: any) {
      setError(error.response?.data?.message || error.message || "Failed to get AI suggestions")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (suggestion: AISuggestion, index: number) => {
    setCreatingTaskId(index)

    try {
      // Clean the title by removing extra quotes if present
      const cleanTitle = suggestion.title.replace(/^["']|["']$/g, "")

      const taskData = {
        title: cleanTitle,
        description: suggestion.description,
        totalMinutes: 0,
      }

      await apiClient.post("/tasks", taskData)

      toast({
        title: "Success",
        description: `Task "${cleanTitle}" created successfully!`,
      })

      // Call the callback to refresh tasks
      if (onTaskCreated) {
        onTaskCreated()
      }

      // Close modal and reset state
      handleClose()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create task",
        variant: "destructive",
      })
    } finally {
      setCreatingTaskId(null)
    }
  }

  const handleClose = () => {
    setPrompt("")
    setSuggestions([])
    setError("")
    setCreatingTaskId(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600" />
            AI Task Suggestions
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Input Form */}
          <form onSubmit={handleGetSuggestions} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ai-prompt">Describe what you need help with</Label>
              <Input
                id="ai-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., 'improve user interface', 'optimize database performance', 'add new features'"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Getting AI Suggestions...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Get AI Suggestions
                </>
              )}
            </Button>
          </form>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Suggestions Display */}
          {suggestions.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <h3 className="font-semibold text-gray-900">AI Suggestions</h3>
                <span className="text-sm text-gray-500">({suggestions.length} suggestions)</span>
              </div>

              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <Card key={index} className="border border-gray-200 hover:border-blue-300 transition-colors">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-medium text-gray-900">
                        {suggestion.title.replace(/^["']|["']$/g, "")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-sm text-gray-600 mb-4">{suggestion.description}</CardDescription>
                      <Button
                        onClick={() => handleCreateTask(suggestion, index)}
                        disabled={creatingTaskId !== null}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {creatingTaskId === index ? (
                          <>
                            <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Plus className="h-3 w-3 mr-2" />
                            Create Task
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-xs text-gray-500 text-center">
                Click "Create Task" to add any suggestion to your task list
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && suggestions.length === 0 && prompt && (
            <div className="text-center py-8 text-gray-400">
              <Bot className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Enter a prompt above to get AI-powered task suggestions</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={creatingTaskId !== null}
            className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
