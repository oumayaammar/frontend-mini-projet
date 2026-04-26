"use client"

import { FormEvent, useState } from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const NEWS_URL =
  (process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}/news`
    : null) ?? "http://localhost:3002/news"

export default function EditorPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [targetGroup, setTargetGroup] = useState("")
  const [isPinned, setIsPinned] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(NEWS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title,
          content,
          imageUrl,
          isPinned,
          targetGroup,
        }),
      })

      const text = await response.text()
      let payload: unknown = null
      if (text) {
        try {
          payload = JSON.parse(text) as unknown
        } catch {
          payload = null
        }
      }

      if (!response.ok) {
        if (payload && typeof payload === "object" && "message" in payload) {
          throw new Error(String((payload as { message: unknown }).message))
        }
        throw new Error(`Could not create news (${response.status})`)
      }

      setSuccess("News created successfully.")
      setTitle("")
      setContent("")
      setImageUrl("")
      setTargetGroup("")
      setIsPinned(false)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not create news.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-4">
          <Link
            href="/news-managment"
            className="flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Add News</h1>
            <p className="text-sm text-muted-foreground">Publish a new announcement to `/news`.</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <form onSubmit={handleSubmit} className="grid gap-4 rounded-xl border border-border bg-card p-5">
          {error ? <p className="rounded bg-red-500/10 px-3 py-2 text-sm text-red-600">{error}</p> : null}
          {success ? (
            <p className="rounded bg-green-500/10 px-3 py-2 text-sm text-green-700">{success}</p>
          ) : null}

          <label className="grid gap-1 text-sm">
            Title
            <input
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="rounded-md border border-border bg-background px-3 py-2"
              placeholder="Fermeture de la bibliothèque"
            />
          </label>

          <label className="grid gap-1 text-sm">
            Content
            <textarea
              required
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="min-h-36 rounded-md border border-border bg-background px-3 py-2"
              placeholder="La bibliothèque sera fermée le 15 mars..."
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1 text-sm">
              Image URL
              <input
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                className="rounded-md border border-border bg-background px-3 py-2"
                placeholder="https://..."
              />
            </label>
            <label className="grid gap-1 text-sm">
              Target Group
              <input
                required
                value={targetGroup}
                onChange={(event) => setTargetGroup(event.target.value)}
                className="rounded-md border border-border bg-background px-3 py-2"
                placeholder="ING_A1_G1"
              />
            </label>
          </div>

          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isPinned}
              onChange={(event) => setIsPinned(event.target.checked)}
            />
            Pin this news
          </label>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="outline" asChild>
              <Link href="/news-managment">Cancel</Link>
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Create News"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
