import { N8N_WEBHOOKS } from "./constants";
import type {
  AuditScanPayload,
  BusinessLeadSearchPayload,
  JobLeadSearchPayload,
  N8nWebhookResponse,
  ResumeParserPayload,
} from "./types";

function getWebhookBaseUrl(): string {
  const base = process.env.N8N_WEBHOOK_BASE_URL;
  if (!base) {
    throw new Error("N8N_WEBHOOK_BASE_URL is not configured");
  }
  return base.replace(/\/$/, "");
}

async function callWebhook<TPayload>(
  path: string,
  payload: TPayload
): Promise<N8nWebhookResponse> {
  const url = `${getWebhookBaseUrl()}/${path}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`n8n webhook failed (${response.status}): ${text}`);
  }

  return response.json() as Promise<N8nWebhookResponse>;
}

/** Workflow 1 — matches workflow-1-business-lead-discovery.json */
export function triggerBusinessLeadSearch(payload: BusinessLeadSearchPayload) {
  return callWebhook(N8N_WEBHOOKS.businessLeadSearch, payload);
}

/** Workflow 2 — job-lead-discovery (import when OpenClaw builds it) */
export function triggerJobLeadSearch(payload: JobLeadSearchPayload) {
  return callWebhook(N8N_WEBHOOKS.jobLeadSearch, payload);
}

/** Workflow 3 — audit landing page scan */
export function triggerAuditScan(payload: AuditScanPayload) {
  return callWebhook(N8N_WEBHOOKS.auditScan, payload);
}

/** Workflow 6 — resume parser */
export function triggerResumeParser(payload: ResumeParserPayload) {
  return callWebhook(N8N_WEBHOOKS.resumeParser, payload);
}

/** Workflow 4 — email draft generation */
export function triggerEmailDraft(payload: {
  user_id: string;
  lead_type: "business" | "job";
  lead_id: string;
}) {
  return callWebhook(N8N_WEBHOOKS.emailDraft, payload);
}
