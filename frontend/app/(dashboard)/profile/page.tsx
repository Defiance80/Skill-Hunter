"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { INDUSTRIES, SKILL_LEVELS } from "@/lib/constants";
import type { SkillProfile } from "@/lib/types";
import { Loader2, Save, Upload } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Partial<SkillProfile>>({
    primary_skills: [],
    secondary_skills: [],
    preferred_industries: [],
    avoid_industries: [],
    preferred_locations: [],
    tone: "professional, helpful, direct, consultative",
    minimum_fit_score: 70,
    skill_level: "expert",
  });
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("skill_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) setProfile(data);
      setLoading(false);
    }
    loadProfile();
  }, []);

  function addSkill(field: "primary_skills" | "secondary_skills", skill: string) {
    if (!skill) return;
    const current = profile[field] ?? [];
    if (!current.includes(skill)) {
      setProfile({ ...profile, [field]: [...current, skill] });
    }
    setSkillInput("");
  }

  function removeSkill(
    field: "primary_skills" | "secondary_skills",
    skill: string
  ) {
    setProfile({
      ...profile,
      [field]: (profile[field] ?? []).filter((s) => s !== skill),
    });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const payload = { ...profile, user_id: user.id };

    const { error: saveError } = profile.id
      ? await supabase.from("skill_profiles").update(payload).eq("id", profile.id)
      : await supabase.from("skill_profiles").insert(payload);

    setSaving(false);
    if (saveError) {
      setError(saveError.message);
    } else {
      setMessage("Profile saved.");
    }
  }

  async function handleResumeUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setParsing(true);
    setError(null);

    try {
      const text = await file.text();
      setProfile({ ...profile, resume_text: text });

      const response = await fetch("/api/n8n/resume-parser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume_text: text }),
      });

      const data = await response.json();

      if (response.ok && data.extracted) {
        setProfile((prev) => ({
          ...prev,
          ...data.extracted,
          resume_text: text,
        }));
        setMessage("Resume parsed. Review and save your profile.");
      } else if (!response.ok) {
        setMessage(
          "Resume text loaded. AI parsing requires Workflow 6 — edit skills manually."
        );
      }
    } catch {
      setError("Failed to read resume file.");
    } finally {
      setParsing(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-100">Skill Profile</h1>
        <p className="text-zinc-500">
          Stored in Supabase <code className="text-zinc-400">skill_profiles</code>{" "}
          — loaded by n8n Workflow 1 before each search.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resume Upload</CardTitle>
          <CardDescription>
            PDF/DOCX/TXT — triggers Workflow 6 (resume-parser) when available.
          </CardDescription>
        </CardHeader>
        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-zinc-700 p-6 hover:border-zinc-600">
          <Upload className="h-5 w-5 text-zinc-500" />
          <span className="text-sm text-zinc-400">
            {parsing ? "Parsing..." : "Click to upload resume"}
          </span>
          <input
            type="file"
            accept=".txt,.pdf,.doc,.docx"
            className="hidden"
            onChange={handleResumeUpload}
            disabled={parsing}
          />
        </label>
      </Card>

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="space-y-4">
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>

          <div>
            <Label>Primary Skills</Label>
            <div className="mt-1 flex flex-wrap gap-2">
              {(profile.primary_skills ?? []).map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => removeSkill("primary_skills", skill)}
                  className="rounded-full bg-emerald-600/20 px-3 py-1 text-xs text-emerald-300"
                >
                  {skill} ×
                </button>
              ))}
            </div>
            <Input
              className="mt-2"
              placeholder="Add primary skill (Enter)"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill("primary_skills", skillInput);
                }
              }}
            />
          </div>

          <div>
            <Label htmlFor="skill_level">Skill Level</Label>
            <Select
              id="skill_level"
              value={profile.skill_level ?? "expert"}
              onChange={(e) =>
                setProfile({ ...profile, skill_level: e.target.value })
              }
              className="mt-1"
            >
              {SKILL_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="tone">Outreach Tone</Label>
            <Input
              id="tone"
              value={profile.tone ?? ""}
              onChange={(e) => setProfile({ ...profile, tone: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="min_score">Minimum Fit Score</Label>
            <Input
              id="min_score"
              type="number"
              min={0}
              max={100}
              value={profile.minimum_fit_score ?? 70}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  minimum_fit_score: Number(e.target.value),
                })
              }
              className="mt-1"
            />
          </div>
        </Card>

        <Card className="space-y-4">
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>

          <div>
            <Label htmlFor="industries">Preferred Industries</Label>
            <Select
              id="industries"
              value=""
              onChange={(e) => {
                const val = e.target.value;
                if (val && !(profile.preferred_industries ?? []).includes(val)) {
                  setProfile({
                    ...profile,
                    preferred_industries: [
                      ...(profile.preferred_industries ?? []),
                      val,
                    ],
                  });
                }
              }}
              className="mt-1"
            >
              <option value="">Add industry...</option>
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </Select>
            <div className="mt-2 flex flex-wrap gap-2">
              {(profile.preferred_industries ?? []).map((ind) => (
                <span
                  key={ind}
                  className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300"
                >
                  {ind}
                </span>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="locations">Preferred Locations (comma-separated)</Label>
            <Input
              id="locations"
              placeholder="Murrieta, Temecula, Remote"
              value={(profile.preferred_locations ?? []).join(", ")}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  preferred_locations: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="resume">Resume Text</Label>
            <Textarea
              id="resume"
              value={profile.resume_text ?? ""}
              onChange={(e) =>
                setProfile({ ...profile, resume_text: e.target.value })
              }
              className="mt-1"
              rows={6}
            />
          </div>
        </Card>

        <Button type="submit" disabled={saving}>
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Profile
        </Button>

        {message && <p className="text-sm text-emerald-400">{message}</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}
      </form>
    </div>
  );
}
