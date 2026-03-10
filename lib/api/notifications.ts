const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export interface ApiNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationsResponse {
  notifications: ApiNotification[];
  unreadCount: number;
}

export async function fetchNotifications(
  token: string | null,
  limit = 20,
  offset = 0
): Promise<NotificationsResponse | null> {
  if (!token) return null;
  try {
    const res = await fetch(
      `${apiBaseUrl}/api/notifications?limit=${limit}&offset=${offset}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    return (await res.json()) as NotificationsResponse;
  } catch {
    return null;
  }
}

export async function markNotificationRead(
  token: string | null,
  id: string
): Promise<boolean> {
  if (!token) return false;
  try {
    const res = await fetch(`${apiBaseUrl}/api/notifications/${id}/read`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function markAllNotificationsRead(
  token: string | null
): Promise<boolean> {
  if (!token) return false;
  try {
    const res = await fetch(`${apiBaseUrl}/api/notifications/read-all`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}
