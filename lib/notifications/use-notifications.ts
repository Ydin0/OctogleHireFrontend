"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";

import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  type ApiNotification,
} from "@/lib/api/notifications";
import type { Notification, NotificationType } from "./types";

const POLL_INTERVAL = 30_000;

function mapApiToNotification(n: ApiNotification): Notification {
  return {
    id: n.id,
    type: n.type as NotificationType,
    title: n.title,
    description: n.body,
    href: n.link ?? undefined,
    createdAt: n.createdAt,
  };
}

export function useNotifications() {
  const { getToken } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [unreadCount, setUnreadCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async () => {
    const token = await getToken();
    const data = await fetchNotifications(token);
    if (!data) return;

    setNotifications(data.notifications.map(mapApiToNotification));
    setUnreadCount(data.unreadCount);
    setReadIds(
      new Set(
        data.notifications.filter((n) => n.isRead).map((n) => n.id)
      )
    );
  }, [getToken]);

  useEffect(() => {
    void load();
    intervalRef.current = setInterval(() => void load(), POLL_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [load]);

  const markAsRead = useCallback(
    async (id: string) => {
      setReadIds((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });
      setUnreadCount((prev) => Math.max(0, prev - 1));

      const token = await getToken();
      await markNotificationRead(token, id);
    },
    [getToken]
  );

  const markAllRead = useCallback(async () => {
    setReadIds(new Set(notifications.map((n) => n.id)));
    setUnreadCount(0);

    const token = await getToken();
    await markAllNotificationsRead(token);
  }, [getToken, notifications]);

  return { notifications, readIds, unreadCount, markAsRead, markAllRead };
}
