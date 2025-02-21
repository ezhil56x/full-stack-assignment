"use client";

import { toast } from "@/hooks/use-toast";
import { BACKEND_URL } from "@/lib/constants";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

function Dashboard() {
  const [task, setTask] = useState("");
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
      const data = await response.json();
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

  return <div>{JSON.stringify(task)}</div>;
}

export default Dashboard;
