import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

function Hero() {
  const router = useRouter();

  return (
    <div className="mx-auto h-screen max-w-screen-xl px-4 py-48 lg:flex lg:h-screen lg:items-top lg:py-48">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-lg dark:text-sky-300 text-blue-500 font-extrabold sm:text-lg">
          AI-Powered{" "}
          <strong className="font-extrabold dark:text-white text-black sm:block sm:text-4xl">
            {" "}
            Task Management System{" "}
          </strong>
        </h1>

        <p className="mt-4 sm:text-xl/relaxed dark:text-slate-200">
          Streamline Workflows, Boost Productivity, and Automate Tasks with AI
        </p>

        <Button
          className="mt-8 justify-center gap-4"
          onClick={() => {
            router.push("/login");
          }}
        >
          Try for free 🎉
        </Button>
      </div>
    </div>
  );
}

export default Hero;
