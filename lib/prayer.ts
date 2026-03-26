import type { PrayerTime } from "@/types/domain";

function parseTimeToDate(value: string, baseDate = new Date()) {
  const [timePart, meridiem] = value.split(" ");
  if (!timePart || !meridiem) {
    throw new Error(`Invalid prayer time: ${value}`);
  }
  const [hoursPart, minutesPart] = timePart.split(":");
  const date = new Date(baseDate);

  let hours = Number(hoursPart);
  const minutes = Number(minutesPart);
  if (meridiem === "PM" && hours < 12) {
    hours += 12;
  }
  if (meridiem === "AM" && hours === 12) {
    hours = 0;
  }

  date.setHours(hours, minutes, 0, 0);
  return date;
}

export function formatPrayerTime(value: string, locale = "en-US") {
  const date = parseTimeToDate(value);
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function getCountdownParts(target: string, now = new Date()) {
  const targetDate = parseTimeToDate(target, now);
  if (targetDate.getTime() <= now.getTime()) {
    targetDate.setDate(targetDate.getDate() + 1);
  }

  const diffMs = targetDate.getTime() - now.getTime();
  const clampedMs = Math.max(diffMs, 0);
  const totalMinutes = Math.floor(clampedMs / 60_000);

  return {
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60,
  };
}

export function getCountdownLabel(target: string, now = new Date()) {
  const { hours, minutes } = getCountdownParts(target, now);
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

export function getNextPrayer(prayers: PrayerTime[], now = new Date()) {
  return (
    prayers.find((prayer) => parseTimeToDate(prayer.adhanTime, now) > now) ??
    prayers[0]
  );
}

export function getPrayerCompletionSummary(prayers: PrayerTime[]) {
  const completed = prayers.filter((prayer) => prayer.completed).length;
  return `${completed} of ${prayers.length} prayers checked today`;
}
