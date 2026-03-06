"use client";

import { useCallback, useEffect, useState } from "react";
import { mockNotifications } from "./mock-data";
import type { Notification } from "./types";

const STORAGE_KEY = "octoglehire:notifications-read";

function getReadIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function persistReadIds(ids: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}

export function useNotifications() {
  const [notifications] = useState<Notification[]>(mockNotifications);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setReadIds(getReadIds());
  }, []);

  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length;

  const markAsRead = useCallback((id: string) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      persistReadIds(next);
      return next;
    });
  }, []);

  const markAllRead = useCallback(() => {
    setReadIds((prev) => {
      const next = new Set(prev);
      for (const n of notifications) next.add(n.id);
      persistReadIds(next);
      return next;
    });
  }, [notifications]);

  return { notifications, readIds, unreadCount, markAsRead, markAllRead };
}
