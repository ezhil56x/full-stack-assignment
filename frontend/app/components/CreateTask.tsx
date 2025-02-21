"use client";

import React, { useEffect } from "react";

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

import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { BACKEND_URL } from "@/lib/constants";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useState } from "react";

function CreateTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [users, setUsers] = useState([]);
  const [task, setTask] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      const response = await fetch(BACKEND_URL + "/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch users");
        toast({ description: "Failed to fetch users" });
      } else {
        let data = await response.json();
        setUsers(data.users);
      }
    };
    getUsers();
  }, []);

  const createTask = async (task: Task) => {
    const response = await fetch(BACKEND_URL + "/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(task),
    });

    if (response.ok) {
      const data = await response.json();
      setTask(data.task);
      toast({ description: "Task created successfully" });
    } else {
      console.error("Failed to create task");
      toast({ description: "Failed to create task" });
    }
  };

  const validateAllFields = () => {
    return (
      title !== "" &&
      description !== "" &&
      assignedTo !== "" &&
      status !== "" &&
      priority !== ""
    );
  };

  const clearFields = () => {
    setTitle("");
    setDescription("");
    setAssignedTo("");
    setStatus("");
    setPriority("");
    setDueDate(undefined);
  };

  interface Task {
    title: string;
    description: string;
    assigned_to_id: Number;
    status: string;
    priority: string;
    due_date: string | null;
  }

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">
            <PencilIcon className="h-4 w-4 mr-2" />
            Create New Task
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create New Task</AlertDialogTitle>
            <AlertDialogDescription>
              Enter the details of the task you want to create.
            </AlertDialogDescription>
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
              <div className="space-y-1">
                <Label htmlFor="assignedTo">Assigned To</Label>
                <Select
                  value={assignedTo}
                  onValueChange={(value) => setAssignedTo(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user: { id: string; username: string }) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inProgress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={priority}
                  onValueChange={(value) => setPriority(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 flex flex-col items-start">
                <Label htmlFor="dueDate">Due Date</Label>
                <Popover>
                  <PopoverTrigger>
                    <Button variant="outline">
                      {dueDate ? dueDate.toDateString() : "Select a due date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={(date) => {
                        if (date) {
                          setDueDate(date);
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (validateAllFields()) {
                  createTask({
                    title: title,
                    description: description,
                    assigned_to_id: Number(assignedTo),
                    status: status,
                    priority: priority,
                    due_date: dueDate?.toISOString() || null,
                  });
                  clearFields();
                  window.location.reload();
                } else {
                  toast({ description: "Please fill in all fields" });
                }
              }}
            >
              Create
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default CreateTask;
