"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SEND_MODES } from "@/lib/constants";
import type { Settings } from "@/lib/types";
import { Loader2, Save } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Partial<Settings>>({
    send_mode: "manual",
    auto_send_threshold: 80,
    daily_send_limit: 50,
    enable_follow_ups: true,
    follow_up_delay_days: 3,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) setSettings(data);
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("settings")
      .upsert({ ...settings, user_id: user.id }, { onConflict: "user_id" });

    setSaving(false);
    if (!error) setMessage("Settings saved.");
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-100">Settings</h1>
        <p className="text-zinc-500">
          Maps to <code className="text-zinc-400">settings</code> table — used by
          n8n Workflows 4 and 5.
        </p>
      </div>

      <form onSubmit={handleSave}>
        <Card className="space-y-4">
          <CardHeader>
            <CardTitle>Send Mode</CardTitle>
            <CardDescription>
              Default is manual per CLAUDE.md — no auto-send without explicit
              opt-in.
            </CardDescription>
          </CardHeader>

          <div>
            <Label htmlFor="send_mode">Mode</Label>
            <Select
              id="send_mode"
              value={settings.send_mode ?? "manual"}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  send_mode: e.target.value as Settings["send_mode"],
                })
              }
              className="mt-1"
            >
              {SEND_MODES.map((mode) => (
                <option key={mode.value} value={mode.value}>
                  {mode.label} — {mode.description}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="threshold">Auto-Send Threshold</Label>
            <Input
              id="threshold"
              type="number"
              min={0}
              max={100}
              value={settings.auto_send_threshold ?? 80}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  auto_send_threshold: Number(e.target.value),
                })
              }
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="daily_limit">Daily Send Limit</Label>
            <Input
              id="daily_limit"
              type="number"
              min={1}
              max={500}
              value={settings.daily_send_limit ?? 50}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  daily_send_limit: Number(e.target.value),
                })
              }
              className="mt-1"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              id="follow_ups"
              type="checkbox"
              checked={settings.enable_follow_ups ?? true}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  enable_follow_ups: e.target.checked,
                })
              }
              className="h-4 w-4 rounded border-zinc-700"
            />
            <Label htmlFor="follow_ups">Enable follow-up drafts (Workflow 5)</Label>
          </div>

          <div>
            <Label htmlFor="follow_up_days">Follow-Up Delay (days)</Label>
            <Input
              id="follow_up_days"
              type="number"
              min={1}
              max={30}
              value={settings.follow_up_delay_days ?? 3}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  follow_up_delay_days: Number(e.target.value),
                })
              }
              className="mt-1"
            />
          </div>
        </Card>

        <Button type="submit" disabled={saving} className="mt-4">
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Settings
        </Button>

        {message && (
          <p className="mt-4 text-sm text-emerald-400">{message}</p>
        )}
      </form>
    </div>
  );
}
