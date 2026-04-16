"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link,
  Image,
  Code,
  Quote,
  Undo,
  Redo,
  Type,
  Heading1,
  Heading2,
  Heading3,
  Minus,
  Palette,
  Highlighter,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface TextEditorProps {
  initialContent?: string
  placeholder?: string
  onChange?: (content: string) => void
  className?: string
}

interface ToolbarButtonProps {
  icon: React.ReactNode
  onClick: () => void
  active?: boolean
  title: string
  disabled?: boolean
}

function ToolbarButton({ icon, onClick, active, title, disabled }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "flex items-center justify-center size-8 rounded-md transition-colors",
        "hover:bg-secondary text-muted-foreground hover:text-foreground",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        active && "bg-secondary text-foreground"
      )}
    >
      {icon}
    </button>
  )
}

function ToolbarDivider() {
  return <div className="w-px h-6 bg-border mx-1" />
}

export function TextEditor({ 
  initialContent = "", 
  placeholder = "Start writing...",
  onChange,
  className 
}: TextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const isInitialMount = useRef(true)

  // Sync initialContent changes - append new content to the right of existing content
  useEffect(() => {
    if (editorRef.current && initialContent) {
      if (isInitialMount.current) {
        // On first mount, just set the content
        editorRef.current.innerHTML = initialContent
        isInitialMount.current = false
      } else {
        // On subsequent updates, append to the right (end) of existing content
        const selection = window.getSelection()
        const range = document.createRange()
        
        // Move cursor to end of content
        range.selectNodeContents(editorRef.current)
        range.collapse(false) // false = collapse to end
        
        selection?.removeAllRanges()
        selection?.addRange(range)
        
        // Focus and update counts
        editorRef.current.focus()
        
        const text = editorRef.current.innerText || ""
        const words = text.trim().split(/\s+/).filter(word => word.length > 0)
        setWordCount(words.length)
        setCharCount(text.length)
      }
    }
  }, [initialContent])

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
  }, [])

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const text = editorRef.current.innerText || ""
      const words = text.trim().split(/\s+/).filter(word => word.length > 0)
      setWordCount(words.length)
      setCharCount(text.length)
      onChange?.(editorRef.current.innerHTML)
    }
  }, [onChange])

  const insertLink = useCallback(() => {
    const url = prompt("Enter URL:")
    if (url) {
      execCommand("createLink", url)
    }
  }, [execCommand])

  const insertImage = useCallback(() => {
    const url = prompt("Enter image URL:")
    if (url) {
      execCommand("insertImage", url)
    }
  }, [execCommand])

  const setFontSize = useCallback((size: string) => {
    execCommand("fontSize", size)
  }, [execCommand])

  const setTextColor = useCallback(() => {
    const color = prompt("Enter color (hex or name):", "#000000")
    if (color) {
      execCommand("foreColor", color)
    }
  }, [execCommand])

  const setHighlightColor = useCallback(() => {
    const color = prompt("Enter highlight color (hex or name):", "#ffff00")
    if (color) {
      execCommand("hiliteColor", color)
    }
  }, [execCommand])

  return (
    <div className={cn("flex flex-col rounded-xl border border-border bg-card overflow-hidden", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-border bg-muted/30">
        {/* Undo/Redo */}
        <ToolbarButton
          icon={<Undo className="size-4" />}
          onClick={() => execCommand("undo")}
          title="Undo"
        />
        <ToolbarButton
          icon={<Redo className="size-4" />}
          onClick={() => execCommand("redo")}
          title="Redo"
        />

        <ToolbarDivider />

        {/* Headings */}
        <ToolbarButton
          icon={<Type className="size-4" />}
          onClick={() => execCommand("formatBlock", "p")}
          title="Paragraph"
        />
        <ToolbarButton
          icon={<Heading1 className="size-4" />}
          onClick={() => execCommand("formatBlock", "h1")}
          title="Heading 1"
        />
        <ToolbarButton
          icon={<Heading2 className="size-4" />}
          onClick={() => execCommand("formatBlock", "h2")}
          title="Heading 2"
        />
        <ToolbarButton
          icon={<Heading3 className="size-4" />}
          onClick={() => execCommand("formatBlock", "h3")}
          title="Heading 3"
        />

        <ToolbarDivider />

        {/* Text formatting */}
        <ToolbarButton
          icon={<Bold className="size-4" />}
          onClick={() => execCommand("bold")}
          title="Bold"
        />
        <ToolbarButton
          icon={<Italic className="size-4" />}
          onClick={() => execCommand("italic")}
          title="Italic"
        />
        <ToolbarButton
          icon={<Underline className="size-4" />}
          onClick={() => execCommand("underline")}
          title="Underline"
        />
        <ToolbarButton
          icon={<Strikethrough className="size-4" />}
          onClick={() => execCommand("strikeThrough")}
          title="Strikethrough"
        />

        <ToolbarDivider />

        {/* Colors */}
        <ToolbarButton
          icon={<Palette className="size-4" />}
          onClick={setTextColor}
          title="Text Color"
        />
        <ToolbarButton
          icon={<Highlighter className="size-4" />}
          onClick={setHighlightColor}
          title="Highlight Color"
        />

        <ToolbarDivider />

        {/* Lists */}
        <ToolbarButton
          icon={<List className="size-4" />}
          onClick={() => execCommand("insertUnorderedList")}
          title="Bullet List"
        />
        <ToolbarButton
          icon={<ListOrdered className="size-4" />}
          onClick={() => execCommand("insertOrderedList")}
          title="Numbered List"
        />

        <ToolbarDivider />

        {/* Alignment */}
        <ToolbarButton
          icon={<AlignLeft className="size-4" />}
          onClick={() => execCommand("justifyLeft")}
          title="Align Left"
        />
        <ToolbarButton
          icon={<AlignCenter className="size-4" />}
          onClick={() => execCommand("justifyCenter")}
          title="Align Center"
        />
        <ToolbarButton
          icon={<AlignRight className="size-4" />}
          onClick={() => execCommand("justifyRight")}
          title="Align Right"
        />
        <ToolbarButton
          icon={<AlignJustify className="size-4" />}
          onClick={() => execCommand("justifyFull")}
          title="Justify"
        />

        <ToolbarDivider />

        {/* Insert */}
        <ToolbarButton
          icon={<Link className="size-4" />}
          onClick={insertLink}
          title="Insert Link"
        />
        <ToolbarButton
          icon={<Image className="size-4" />}
          onClick={insertImage}
          title="Insert Image"
        />
        <ToolbarButton
          icon={<Quote className="size-4" />}
          onClick={() => execCommand("formatBlock", "blockquote")}
          title="Blockquote"
        />
        <ToolbarButton
          icon={<Code className="size-4" />}
          onClick={() => execCommand("formatBlock", "pre")}
          title="Code Block"
        />
        <ToolbarButton
          icon={<Minus className="size-4" />}
          onClick={() => execCommand("insertHorizontalRule")}
          title="Horizontal Rule"
        />
      </div>

      {/* Editor area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        data-placeholder={placeholder}
        className={cn(
          "flex-1 min-h-[300px] p-4 outline-none overflow-y-auto",
          "prose prose-sm max-w-none",
          "focus:ring-0",
          "[&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-muted-foreground [&:empty]:before:pointer-events-none",
          "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:text-foreground",
          "[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-3 [&_h2]:text-foreground",
          "[&_h3]:text-lg [&_h3]:font-medium [&_h3]:mb-2 [&_h3]:text-foreground",
          "[&_p]:mb-2 [&_p]:leading-relaxed [&_p]:text-foreground",
          "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-2",
          "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-2",
          "[&_li]:mb-1 [&_li]:text-foreground",
          "[&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_blockquote]:my-4",
          "[&_pre]:bg-muted [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:font-mono [&_pre]:text-sm [&_pre]:overflow-x-auto [&_pre]:my-4",
          "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2",
          "[&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-4",
          "[&_hr]:border-border [&_hr]:my-6"
        )}
      />

      {/* Footer with word/char count */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/30 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>{wordCount} words</span>
          <span>{charCount} characters</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground/70">Press Ctrl+B for bold, Ctrl+I for italic</span>
        </div>
      </div>
    </div>
  )
}
