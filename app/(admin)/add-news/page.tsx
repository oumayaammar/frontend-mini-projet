"use client"

import { useState, useCallback } from "react"
import { TextEditor } from "../components/TextEditor"
import { ArrowLeft, Save, FileText, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  CalendarDays,
  MapPin,
  Clock,
  Users,
  Star,
  CheckCircle2,
  BookOpen,
} from "lucide-react"

export default function EditorPage() {
  const [content, setContent] = useState("")
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent + " ")
  }, [])

  const handleSave = useCallback(() => {
    // Simulate saving - in a real app, this would save to a database or API
    setLastSaved(new Date())
    // You could also store in localStorage for persistence
    localStorage.setItem("editor-content", content)
  }, [content])

  const handleLoadSaved = useCallback(() => {
    const saved = localStorage.getItem("editor-content")
    if (saved) {
      setContent(saved)
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center justify-center size-10 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-5" />
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Text Editor</h1>
              <p className="text-sm text-muted-foreground">
                {lastSaved
                  ? `Last saved: ${lastSaved.toLocaleTimeString()}`
                  : "Create and format your content"
                }
              </p>
            </div>
            <div>
                <Link href="">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
                  >
                    <Save className="size-4" />
                    Save
                  </button>
                </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className={showPreview ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : ""}>
          <TextEditor
            placeholder="Start writing your content here..."
            className="min-h-[600px]"
            initialContent={content}
            onChange={handleContentChange}
          />

          {showPreview && (
            <div className="flex flex-col rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-muted/30">
                <h3 className="text-sm font-medium text-foreground">HTML Preview</h3>
              </div>
              <div
                className="flex-1 min-h-[300px] p-4 overflow-y-auto prose prose-sm max-w-none
                  [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:text-foreground
                  [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-3 [&_h2]:text-foreground
                  [&_h3]:text-lg [&_h3]:font-medium [&_h3]:mb-2 [&_h3]:text-foreground
                  [&_p]:mb-2 [&_p]:leading-relaxed [&_p]:text-foreground
                  [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-2
                  [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-2
                  [&_li]:mb-1 [&_li]:text-foreground
                  [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_blockquote]:my-4
                  [&_pre]:bg-muted [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:font-mono [&_pre]:text-sm [&_pre]:overflow-x-auto [&_pre]:my-4
                  [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2
                  [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-4
                  [&_hr]:border-border [&_hr]:my-6"
                dangerouslySetInnerHTML={{ __html: content || "<p class='text-muted-foreground'>Start typing to see preview...</p>" }}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
