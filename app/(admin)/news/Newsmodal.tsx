"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { News } from "./columns";

interface NewsModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<News, "id" | "createdAt">) => void;
  initial?: News | null; // if provided → update mode
}

export function NewsModal({ open, onClose, onSave, initial }: NewsModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Populate fields when editing
  useEffect(() => {
    if (initial) {
      setTitle(initial.title);
      setDescription(initial.description);
    } else {
      setTitle("");
      setDescription("");
    }
  }, [initial, open]);

  const handleSave = () => {
    if (!title.trim() || !description.trim()) return;
    onSave({ title, description });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{initial ? "Update News" : "Create News"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter description..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {initial ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}