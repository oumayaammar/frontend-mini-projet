"use client";

import { useEffect, useMemo, useState } from "react";
import { DataTable } from "./data-table";
import { createColumns, News } from "./columns";
import { NewsModal } from "./Newsmodal";
import { DeleteDialog } from "./Deletedialog";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import AppPageSkeleton from "@/components/skeletons/AppPageSkeleton";

type ApiNews = {
  id?: string;
  _id?: string;
  title?: string;
  content?: string;
  imageUrl?: string;
  isPinned?: boolean;
  targetGroup?: string;
  createdAt?: string;
};

const NEWS_URL =
  (process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}/news`
    : null) ?? "http://localhost:3002/news";

export default function NewsPage() {
  const [data, setData] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);

  // Delete dialog states
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingNews, setDeletingNews] = useState<News | null>(null);

  // ── Handlers ────────────────────────────────────────────────────────────

  useEffect(() => {
    let isMounted = true;

    async function fetchNews() {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("auth_token");
        const response = await fetch(NEWS_URL, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        if (!response.ok) {
          throw new Error(`Failed to load news (${response.status})`);
        }

        const payload = (await response.json()) as unknown;
        const list = Array.isArray(payload)
          ? payload
          : payload && typeof payload === "object" && Array.isArray((payload as { data?: unknown[] }).data)
            ? ((payload as { data: unknown[] }).data ?? [])
            : [];

        const normalized: News[] = list.map((item, index) => {
          const row = (item ?? {}) as ApiNews;
          return {
            id: String(row.id ?? row._id ?? `news-${index}`),
            title: String(row.title ?? ""),
            content: String(row.content ?? ""),
            imageUrl: String(row.imageUrl ?? ""),
            isPinned: Boolean(row.isPinned),
            targetGroup: String(row.targetGroup ?? ""),
            createdAt: String(row.createdAt ?? new Date().toISOString()),
          };
        });

        if (!isMounted) return;
        setData(normalized);
      } catch {
        if (!isMounted) return;
        setData([]);
        setError("Could not load news right now.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    void fetchNews();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreate = () => {
    setEditingNews(null);
    setModalOpen(true);
  };

  const handleEdit = (news: News) => {
    setEditingNews(news);
    setModalOpen(true);
  };

  const handleDeleteClick = (news: News) => {
    setDeletingNews(news);
    setDeleteOpen(true);
  };

  const handleSave = async (formData: Omit<News, "id" | "createdAt">) => {
    if (!editingNews) {
      // Create is handled on /news-managment/add-news.
      setModalOpen(false);
      return;
    }

    setError(null);

    const token = localStorage.getItem("auth_token");
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    try {
      const patchResponse = await fetch(`${NEWS_URL}/${editingNews.id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(formData),
      });

      if (!patchResponse.ok && (patchResponse.status === 404 || patchResponse.status === 405)) {
        const putResponse = await fetch(`${NEWS_URL}/${editingNews.id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(formData),
        });
        if (!putResponse.ok) {
          throw new Error(`Failed to update news (${putResponse.status})`);
        }
      } else if (!patchResponse.ok) {
        throw new Error(`Failed to update news (${patchResponse.status})`);
      }

      setData((prev) =>
        prev.map((n) => (n.id === editingNews.id ? { ...n, ...formData } : n))
      );
      setModalOpen(false);
      setEditingNews(null);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Could not update news right now.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingNews) return;

    setError(null);

    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${NEWS_URL}/${deletingNews.id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (!response.ok) {
        throw new Error(`Failed to delete news (${response.status})`);
      }

      setData((prev) => prev.filter((n) => n.id !== deletingNews.id));
      setDeleteOpen(false);
      setDeletingNews(null);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Could not delete news right now.");
    }
  };

  // ── Columns (with callbacks) ─────────────────────────────────────────────
  const columns = useMemo(
    () => createColumns(handleEdit, handleDeleteClick, handleCreate),
    [handleEdit, handleDeleteClick, handleCreate],
  );

  return (
    <>
    {loading ? <AppPageSkeleton/> : 
    <div className="container mx-auto py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">News</h1>
        <Button asChild className="flex items-center gap-2">
          <Link href="/news-managment/add-news">
          <CirclePlus className="h-4 w-4" />
          Add News
          </Link>
        </Button>
      </div>

      {loading ? <p className="mb-4 text-sm text-muted-foreground">Loading news...</p> : null}
      {error ? <p className="mb-4 text-sm text-red-500">{error}</p> : null}

      {/* Table */}
      <DataTable columns={columns} data={data} />

      {/* Create / Update Modal */}
      <NewsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initial={editingNews}
      />

      {/* Delete Confirmation */}
      <DeleteDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        news={deletingNews}
      />
    </div>
    }
    </>
  );
}