"use client";

import { toast } from "@/hooks/use-toast";
import { BACKEND_URL } from "@/lib/constants";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { DataTable } from "./data-table";
import { formatDate, capFirstLetter } from "@/lib/utils";

import { columns, Task } from "./columns";

function Dashboard() {
  const [task, setTask] = useState([] as Task[]);
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = async () => {
    const response = await fetch(BACKEND_URL + "/api/tasks", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    validateToken(response);

    if (!response.ok) {
      console.error("Failed to fetch tasks");
      toast({ description: "Failed to fetch tasks" });
    } else {
      let data = await response.json();
      data = transformTasks(data);
      setTask(data);
      console.log(data);
    }
  };

  const validateToken = (response: Response) => {
    if (response.status === 401) {
      console.error("Unauthorized");
      toast({ description: "Unauthorized" });
      localStorage.removeItem("token");
      router.push("/login");
      return;
    }
  };

  function transformTasks(data) {
    return data.tasks.map((task) => ({
      id: task.id.toString(),
      title: capFirstLetter(task.title),
      description: capFirstLetter(task.description),
      assignedTo: capFirstLetter(task.assigned_to.username),
      status: capFirstLetter(task.status),
      priority: capFirstLetter(task.priority),
      dueDate: formatDate(task.due_date),
      createdAt: formatDate(task.created_at),
      updateAt: formatDate(task.updated_at),
    }));
  }

  return (
    <div className="p-4 ml-36 mr-36">
      <div className="flex flex-col space-y-8 mt-6">
        <DataTable columns={columns} data={task} />
      </div>
    </div>
  );
}

export default Dashboard;
