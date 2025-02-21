import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { BACKEND_URL } from "@/lib/constants";
import { Pencil, Trash } from "lucide-react";
import React, { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function ActionsCell({ row }) {
  const [title, setTitle] = useState(row.original.title);
  const [description, setDescription] = useState(row.original.description);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setTitle(row.original.title);
    setDescription(row.original.description);
    setIsOpen(true);
  };

  return (
    <div className="flex space-x-2 items-center">
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="outline" onClick={handleOpen}>
            <Pencil className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Task</AlertDialogTitle>
            <AlertDialogDescription>
              Update the title and description of the task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                const response = await fetch(
                  `${BACKEND_URL}/api/task/${row.original.id}`,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({ title, description }),
                  }
                );

                if (!response.ok) {
                  console.error("Failed to update task");
                  toast({ description: "Failed to update task" });
                } else {
                  toast({ description: "Task updated" });
                  window.location.reload();
                }
              }}
            >
              Update
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Button
        variant="outline"
        onClick={async () => {
          const response = await fetch(
            `${BACKEND_URL}/api/task/${row.original.id}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (!response.ok) {
            console.error("Failed to delete task");
            toast({ description: "Failed to delete task" });
          } else {
            toast({ description: "Task deleted" });
            window.location.reload();
          }
        }}
      >
        <Trash className="h-4 w-4 text-red-500" />
      </Button>
    </div>
  );
}

export default ActionsCell;
