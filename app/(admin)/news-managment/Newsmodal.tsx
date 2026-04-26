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
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [targetGroup, setTargetGroup] = useState("");
  const [isPinned, setIsPinned] = useState(false);

  // Populate fields when editing
  useEffect(() => {
    if (initial) {
      setTitle(initial.title);
      setContent(initial.content);
      setImageUrl(initial.imageUrl);
      setTargetGroup(initial.targetGroup);
      setIsPinned(initial.isPinned);
    } else {
      setTitle("");
      setContent("");
      setImageUrl("");
      setTargetGroup("");
      setIsPinned(false);
    }
  }, [initial, open]);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    onSave({ title, content, imageUrl, isPinned, targetGroup });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-120">
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
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Enter content..."
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              placeholder="https://..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="targetGroup">Target Group</Label>
            <Input
              id="targetGroup"
              placeholder="ING_A1_G1"
              value={targetGroup}
              onChange={(e) => setTargetGroup(e.target.value)}
            />
          </div>

          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
            />
            Pin this news
          </label>
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