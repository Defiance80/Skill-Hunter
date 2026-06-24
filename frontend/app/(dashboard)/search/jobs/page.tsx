"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { JOB_CATEGORIES, REMOTE_OPTIONS } from "@/lib/constants";
import { Loader2, Search } from "lucide-react";

export default function JobSearchPage() {
  const router = useRouter();
  const [skills, setSkills] = useState<string[]>(["SEO", "Marketing"]);
  const [skillInput, setSkillInput] = useState("");
  const [location, setLocation] = useState("Remote");
  const [remoteStatus, setRemoteStatus] = useState("remote");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  function addSkill(skill: string) {
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
    setSkillInput("");
  }

  function removeSkill(skill: string) {
    setSkills(skills.filter((s) => s !== skill));
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/n8n/job-lead-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills, location, remote_status: remoteStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Search failed");
      }

      setResult(data.message ?? "Job search complete.");
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
        <h1 className="text-2xl font-semibold text-zinc-100">Job Lead Search</h1>
        <p className="text-zinc-500">
          Triggers n8n Workflow 2 when imported. Matches jobs against your skill
          profile.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Parameters</CardTitle>
          <CardDescription>
            Workflow 2 is not yet in the repo — this UI is ready for when OpenClaw
            adds it.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <Label>Skills</Label>
            <div className="mt-1 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="rounded-full bg-emerald-600/20 px-3 py-1 text-xs text-emerald-300 hover:bg-emerald-600/30"
                >
                  {skill} ×
                </button>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <Input
                placeholder="Add skill..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill(skillInput);
                  }
                }}
              />
              <Select
                onChange={(e) => addSkill(e.target.value)}
                value=""
              >
                <option value="">Quick add...</option>
                {JOB_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="remote">Remote Status</Label>
            <Select
              id="remote"
              value={remoteStatus}
              onChange={(e) => setRemoteStatus(e.target.value)}
              className="mt-1"
            >
              {REMOTE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
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
                Run Job Search
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
