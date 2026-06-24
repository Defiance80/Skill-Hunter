"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Crosshair, Loader2 } from "lucide-react";

export default function AuditLandingPage() {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [teaser, setTeaser] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTeaser(null);

    try {
      const response = await fetch("/api/n8n/audit-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          website_url: websiteUrl,
          requester_email: email || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Audit failed");
      }

      setTeaser(
        data.message ??
          "We found several improvement opportunities. Sign in to view your full audit."
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Audit failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600">
          <Crosshair className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-3xl font-semibold text-zinc-100">
          Free Website Audit
        </h1>
        <p className="mt-2 max-w-md text-zinc-400">
          We found a few simple areas where your online presence may be leaving
          leads on the table. Enter your website to generate a deeper free
          audit.
        </p>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Get Your Audit</CardTitle>
          <CardDescription>
            Triggers n8n Workflow 3 — results saved to the{" "}
            <code className="text-zinc-400">audits</code> table.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="url">Website URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://yourbusiness.com"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email">Email (optional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@business.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              "Generate Free Audit"
            )}
          </Button>
        </form>

        {teaser && (
          <div className="mt-6 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
            <p className="text-sm text-emerald-300">{teaser}</p>
            <Link href="/login">
              <Button variant="outline" size="sm" className="mt-3">
                Sign in to unlock full report
              </Button>
            </Link>
          </div>
        )}
        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      </Card>
    </div>
  );
}
