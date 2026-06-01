"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export default function DocsPage() {
  return (
    <main className="min-h-screen">
      {/* Top Bar */}
      <header className="neo-topbar">
        <Link href="/" className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[28px]">arrow_back</span>
        </Link>
        <h1 className="font-headline font-bold text-lg tracking-tight uppercase">
          API Docs
        </h1>
        <div className="w-8" />
      </header>

      <div className="pt-20 max-w-5xl mx-auto px-4 pb-12">
        {/* Intro Banner */}
        <div className="border-[3px] border-black bg-nb-primary-container p-5 neo-shadow mb-8 animate-nb-bounce-in">
          <h2 className="text-title uppercase mb-1">Swagger / OpenAPI 3.0</h2>
          <p className="text-body opacity-70">
            Interactive documentation for all PrimeTrade API endpoints.
          </p>
        </div>

        {/* Swagger UI */}
        <div className="border-[3px] border-black bg-white p-4 neo-shadow">
          <SwaggerUI url="/api/docs" />
        </div>
      </div>
    </main>
  );
}
