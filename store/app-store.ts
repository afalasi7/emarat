"use client";

import { create } from "zustand";
import { mockDevices, mockReminders, mockUserSettings } from "@/lib/mock-data";
import type {
  Device,
  Reminder,
  SessionUser,
  UserSettings,
} from "@/types/domain";

interface AppStoreState {
  devices: Device[];
  reminders: Reminder[];
  settings: UserSettings;
  sessionUser: SessionUser | null;
  activeDeviceId: string;
  selectedReminderId: string;
  hydrateServerState: (input: {
    devices?: Device[];
    reminders?: Reminder[];
    sessionUser?: SessionUser | null;
    settings?: UserSettings;
  }) => void;
  setSessionUser: (sessionUser: SessionUser | null) => void;
  setActiveDevice: (deviceId: string) => void;
  setSelectedReminder: (reminderId: string) => void;
  setReminderEnabled: (reminderId: string, enabled: boolean) => void;
  setReminderOffset: (reminderId: string, offsetMinutes: number) => void;
  updateSetting: <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K],
  ) => void;
}

const baseAppState = {
  devices: mockDevices,
  reminders: mockReminders,
  settings: mockUserSettings,
  sessionUser: null,
  activeDeviceId: mockDevices[0]?.id ?? "device-phone",
  selectedReminderId: mockReminders[0]?.id ?? "r-1",
} satisfies Pick<
  AppStoreState,
  | "activeDeviceId"
  | "devices"
  | "reminders"
  | "selectedReminderId"
  | "sessionUser"
  | "settings"
>;

export const useAppStore = create<AppStoreState>((set) => ({
  ...baseAppState,
  hydrateServerState: ({ devices, reminders, sessionUser, settings }) =>
    set((state) => {
      const nextDevices = devices ?? state.devices;
      const nextReminders = reminders ?? state.reminders;

      const nextActiveDeviceId = nextDevices.some(
        (device) => device.id === state.activeDeviceId,
      )
        ? state.activeDeviceId
        : (nextDevices[0]?.id ?? state.activeDeviceId);

      const nextSelectedReminderId = nextReminders.some(
        (reminder) => reminder.id === state.selectedReminderId,
      )
        ? state.selectedReminderId
        : (nextReminders[0]?.id ?? state.selectedReminderId);

      return {
        devices: nextDevices,
        reminders: nextReminders,
        sessionUser: sessionUser === undefined ? state.sessionUser : sessionUser,
        settings: settings ?? state.settings,
        activeDeviceId: nextActiveDeviceId,
        selectedReminderId: nextSelectedReminderId,
      };
    }),
  setSessionUser: (sessionUser) => set({ sessionUser }),
  setActiveDevice: (deviceId) => set({ activeDeviceId: deviceId }),
  setSelectedReminder: (reminderId) => set({ selectedReminderId: reminderId }),
  setReminderEnabled: (reminderId, enabled) =>
    set((state) => ({
      reminders: state.reminders.map((reminder) =>
        reminder.id === reminderId
          ? {
              ...reminder,
              enabled,
            }
          : reminder,
      ),
    })),
  setReminderOffset: (reminderId, offsetMinutes) =>
    set((state) => ({
      reminders: state.reminders.map((reminder) =>
        reminder.id === reminderId
          ? {
              ...reminder,
              offsetMinutes,
            }
          : reminder,
      ),
    })),
  updateSetting: (key, value) =>
    set((state) => ({
      settings: {
        ...state.settings,
        [key]: value,
      },
    })),
}));

export function resetAppStore() {
  useAppStore.setState(baseAppState);
}
