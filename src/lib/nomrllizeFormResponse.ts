import {
  ApiEnvelope,
  FormResponse,
  NormalizedFormResponses,
  RawSubmission,
} from "@/types/forms";

export function normalizeApiPayload(payload: ApiEnvelope): NormalizedFormResponses {
  const form = payload?.data?.form;
  const submissions = form?.responses ?? [];

  const responses: RawSubmission[] = submissions.map((sub) => {
    const obj = sub as any;

    const nameVal =
      (obj.name && typeof obj.name === "object" && obj.name.value) ||
      sub.user?.name ||
      "";

    const emailVal =
      (obj.email && typeof obj.email === "object" && obj.email.value) ||
      sub.user?.email ||
      "";

    const data: Record<string, string> = {};

    Object.entries(sub).forEach(([key, val]) => {
      if (
        !["id", "submittedAt", "user", "name", "email"].includes(key) &&
        val &&
        typeof val === "object" &&
        "value" in (val as any)
      ) {
        const v = (val as any).value;
        data[key] = v == null ? "" : String(v);
      }
    });

    // ensure table keys exist
    data.name = String(nameVal || "");
    data.email = String(emailVal || "");

    return {
      id: sub.id,
      createdAt: sub.submittedAt,
      status: "PENDING", // adjust when backend sends a per-submission status
      data,
    };
  });

  return { form, responses };
}
