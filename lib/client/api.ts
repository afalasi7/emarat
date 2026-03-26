import type {
  Device,
  OverviewData,
  PrayerTime,
  QiblaData,
  Reminder,
  SessionUser,
  UserSettings,
} from "@/types/domain";

async function parseJson<T>(response: Response) {
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;
    throw new Error(body?.error ?? "Request failed");
  }

  return (await response.json()) as T;
}

export async function fetchSettingsBundle() {
  const response = await fetch("/api/settings", {
    cache: "no-store",
  });
  return parseJson<{
    settings: UserSettings;
    reminders: Reminder[];
    devices: Device[];
  }>(response);
}

export async function fetchSession() {
  const response = await fetch("/api/auth/session", {
    cache: "no-store",
  });
  return parseJson<{ user: SessionUser | null }>(response);
}

export async function fetchOverview() {
  const response = await fetch("/api/overview", {
    cache: "no-store",
  });
  return parseJson<OverviewData>(response);
}

export async function fetchPrayerTimes() {
  const response = await fetch("/api/prayer-times", {
    cache: "no-store",
  });
  return parseJson<{
    prayerTimes: PrayerTime[];
    settings: UserSettings;
    reminders: Reminder[];
  }>(response);
}

export async function fetchQibla(heading = 245) {
  const response = await fetch(`/api/qibla?heading=${heading}`, {
    cache: "no-store",
  });
  return parseJson<QiblaData>(response);
}

export async function patchSettings(patch: Partial<UserSettings>) {
  const response = await fetch("/api/settings", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patch),
  });

  return parseJson<UserSettings>(response);
}

export async function patchReminder(
  reminderId: string,
  patch: Partial<Pick<Reminder, "enabled" | "label" | "offsetMinutes">>,
) {
  const response = await fetch(`/api/reminders/${reminderId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patch),
  });

  return parseJson<Reminder>(response);
}

export async function postSignIn(input: { email: string; password: string }) {
  const response = await fetch("/api/auth/sign-in", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return parseJson<{ user: SessionUser }>(response);
}

export async function postSignUp(input: {
  name: string;
  email: string;
  password: string;
}) {
  const response = await fetch("/api/auth/sign-up", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return parseJson<{ user: SessionUser }>(response);
}

export async function postSignOut() {
  const response = await fetch("/api/auth/sign-out", {
    method: "POST",
  });

  return parseJson<{ ok: true }>(response);
}
