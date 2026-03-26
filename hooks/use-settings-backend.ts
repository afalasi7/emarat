"use client";

import { useEffect, useState } from "react";
import { fetchSettingsBundle, patchReminder, patchSettings } from "@/lib/client/api";
import { useAppStore } from "@/store/app-store";
import type { UserSettings } from "@/types/domain";

export function useSettingsBackend() {
  const devices = useAppStore((state) => state.devices);
  const reminders = useAppStore((state) => state.reminders);
  const settings = useAppStore((state) => state.settings);
  const selectedReminderId = useAppStore((state) => state.selectedReminderId);
  const hydrateServerState = useAppStore((state) => state.hydrateServerState);
  const setReminderEnabled = useAppStore((state) => state.setReminderEnabled);
  const setReminderOffset = useAppStore((state) => state.setReminderOffset);
  const setSelectedReminder = useAppStore((state) => state.setSelectedReminder);
  const updateSetting = useAppStore((state) => state.updateSetting);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    void fetchSettingsBundle()
      .then((bundle) => {
        if (ignore) {
          return;
        }

        hydrateServerState(bundle);
        setError(null);
      })
      .catch((requestError) => {
        if (!ignore) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Failed to load backend settings",
          );
        }
      });

    return () => {
      ignore = true;
    };
  }, [hydrateServerState]);

  async function syncSetting<K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K],
  ) {
    const previousValue = settings[key];
    updateSetting(key, value);

    try {
      const nextSettings = await patchSettings({ [key]: value });
      hydrateServerState({ settings: nextSettings });
      setError(null);
    } catch (requestError) {
      updateSetting(key, previousValue);
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to update settings",
      );
    }
  }

  async function syncReminderEnabled(reminderId: string, enabled: boolean) {
    const currentReminder = reminders.find((reminder) => reminder.id === reminderId);
    if (!currentReminder) {
      return;
    }

    setReminderEnabled(reminderId, enabled);

    try {
      const nextReminder = await patchReminder(reminderId, { enabled });
      setReminderEnabled(reminderId, nextReminder.enabled);
      setError(null);
    } catch (requestError) {
      setReminderEnabled(reminderId, currentReminder.enabled);
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to update reminder",
      );
    }
  }

  async function syncReminderOffset(reminderId: string, delta: number) {
    const currentReminder = reminders.find((reminder) => reminder.id === reminderId);
    if (!currentReminder) {
      return;
    }

    const nextOffset = clampOffset(currentReminder.offsetMinutes + delta);
    setReminderOffset(reminderId, nextOffset);

    try {
      const nextReminder = await patchReminder(reminderId, {
        offsetMinutes: nextOffset,
      });
      setReminderOffset(reminderId, nextReminder.offsetMinutes);
      setError(null);
    } catch (requestError) {
      setReminderOffset(reminderId, currentReminder.offsetMinutes);
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to update reminder timing",
      );
    }
  }

  return {
    devices,
    reminders,
    settings,
    selectedReminderId,
    error: normalizeSyncError(error),
    setSelectedReminder,
    syncReminderEnabled,
    syncReminderOffset,
    syncSetting,
  };
}

function clampOffset(offsetMinutes: number) {
  return Math.max(-30, Math.min(30, offsetMinutes));
}

function normalizeSyncError(error: string | null) {
  if (error === "Sign in to access synced data") {
    return "Sign in to load and update your synced settings.";
  }

  return error;
}
