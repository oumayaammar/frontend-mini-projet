"use client";

import { useState } from "react";
import { DataTable } from "./data-table";
import { createColumns, News } from "./columns";
import { NewsModal } from "./Newsmodal";
import { DeleteDialog } from "./Deletedialog";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";

// Sample data — replace with real API calls
const initialData: News[] = [
  {
    id: "1",
    title: "School Reopening",
    description: "The school will reopen on September 1st for all students.",
    createdAt: "2024-08-01",
  },
  {
    id: "2",
    title: "Science Fair 2024",
    description: "Annual science fair will be held on October 15th.",
    createdAt: "2024-08-10",
  },
  {
    id: "3",
    title: "Sports Day",
    description: "Join us for sports day activities on November 5th.",
    createdAt: "2024-08-20",
  },
];

export default function NewsPage() {
  const [data, setData] = useState<News[]>(initialData);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);

  // Delete dialog states
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingNews, setDeletingNews] = useState<News | null>(null);

  // ── Handlers ────────────────────────────────────────────────────────────

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

  const handleSave = (formData: Omit<News, "id" | "createdAt">) => {
    if (editingNews) {
      // Update existing
      setData((prev) =>
        prev.map((n) =>
          n.id === editingNews.id ? { ...n, ...formData } : n
        )
      );
    } else {
      // Create new
      const newNews: News = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...formData,
      };
      setData((prev) => [newNews, ...prev]);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingNews) {
      setData((prev) => prev.filter((n) => n.id !== deletingNews.id));
    }
    setDeleteOpen(false);
    setDeletingNews(null);
  };

  // ── Columns (with callbacks) ─────────────────────────────────────────────

  const columns = createColumns(handleEdit, handleDeleteClick, handleCreate);

  return (
    <div className="container mx-auto py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">News</h1>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <CirclePlus className="h-4 w-4" />
          Add News
        </Button>
      </div>

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
  );
}