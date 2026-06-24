"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { INDUSTRIES } from "@/lib/constants";
import { Loader2, Search } from "lucide-react";

export default function BusinessSearchPage() {
  const router = useRouter();
  const [industry, setIndustry] = useState<string>(INDUSTRIES[0]);
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/n8n/business-lead-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry, location, radius }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Search failed");
      }

      setResult(
        data.message ??
          `Found ${data.leads_found ?? 0} leads. Check Business Leads.`
      );
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-100">
          Business Lead Search
        </h1>
        <p className="text-zinc-500">
          Triggers n8n Workflow 1 — Google Maps search, PageSpeed audit, AI
          analysis, and Supabase save.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Parameters</CardTitle>
          <CardDescription>
            Same payload as QUICKSTART.md: industry, location, radius, user_id.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <Label htmlFor="industry">Industry</Label>
            <Select
              id="industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="mt-1"
            >
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="Los Angeles, CA"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="radius">Radius (miles)</Label>
            <Input
              id="radius"
              type="number"
              min={1}
              max={50}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="mt-1"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching via n8n...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Run Business Search
              </>
            )}
          </Button>
        </form>

        {result && (
          <p className="mt-4 text-sm text-emerald-400">{result}</p>
        )}
        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      </Card>
    </div>
  );
}
