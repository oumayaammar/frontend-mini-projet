"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type News = {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  isPinned: boolean;
  targetGroup: string;
  createdAt: string;
};

// We pass callbacks from the parent page via a factory function
export const createColumns = (
  onEdit: (news: News) => void,
  onDelete: (news: News) => void,
  onCreate: () => void
): ColumnDef<News>[] => [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "content",
    header: "Content",
    cell: ({ row }) => (
      <span className="line-clamp-1 max-w-75 block">
        {row.getValue("content")}
      </span>
    ),
  },
  {
    accessorKey: "targetGroup",
    header: "Group",
  },
  {
    accessorKey: "isPinned",
    header: "Pinned",
    cell: ({ row }) => (
      <span>{row.getValue("isPinned") ? "Yes" : "No"}</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => (
      <span>{new Date(row.getValue("createdAt")).toLocaleDateString()}</span>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const news = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-green-600 cursor-pointer"
              onClick={onCreate}
            >
              Create
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => onEdit(news)}
            >
              Update
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 cursor-pointer"
              onClick={() => onDelete(news)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];