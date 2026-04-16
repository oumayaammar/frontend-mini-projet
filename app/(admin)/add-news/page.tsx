"use client"

import { TextEditor } from "../components/TextEditor"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EditorPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link 
            href="/"
            className="flex items-center justify-center size-10 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Text Editor</h1>
            <p className="text-sm text-muted-foreground">Create and format your content</p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <TextEditor 
          placeholder="Start writing your content here..."
          className="min-h-150"
          onChange={(content) => {
            // Handle content changes here
            // console.log("Content updated:", content)
          }}
        />

        {/* Tips section */}
        <div className="mt-8 p-6 rounded-xl bg-card border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Keyboard Shortcuts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <kbd className="px-2 py-1 rounded bg-muted text-xs font-mono text-muted-foreground">Ctrl + B</kbd>
              <span className="text-sm text-foreground">Bold</span>
            </div>
            <div className="flex items-center gap-3">
              <kbd className="px-2 py-1 rounded bg-muted text-xs font-mono text-muted-foreground">Ctrl + I</kbd>
              <span className="text-sm text-foreground">Italic</span>
            </div>
            <div className="flex items-center gap-3">
              <kbd className="px-2 py-1 rounded bg-muted text-xs font-mono text-muted-foreground">Ctrl + U</kbd>
              <span className="text-sm text-foreground">Underline</span>
            </div>
            <div className="flex items-center gap-3">
              <kbd className="px-2 py-1 rounded bg-muted text-xs font-mono text-muted-foreground">Ctrl + Z</kbd>
              <span className="text-sm text-foreground">Undo</span>
            </div>
            <div className="flex items-center gap-3">
              <kbd className="px-2 py-1 rounded bg-muted text-xs font-mono text-muted-foreground">Ctrl + Y</kbd>
              <span className="text-sm text-foreground">Redo</span>
            </div>
            <div className="flex items-center gap-3">
              <kbd className="px-2 py-1 rounded bg-muted text-xs font-mono text-muted-foreground">Ctrl + A</kbd>
              <span className="text-sm text-foreground">Select All</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
