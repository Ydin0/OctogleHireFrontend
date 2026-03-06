"use client";

import Link from "next/link";
import {
  Bell,
  Briefcase,
  CheckCheck,
  FileText,
  Info,
  UserCheck,
  UserX,
  Users,
  Zap,
} from "lucide-react";

import { useNotifications } from "@/lib/notifications/use-notifications";
import type { NotificationType } from "@/lib/notifications/types";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

const typeIcon: Record<NotificationType, React.ElementType> = {
  new_match: Users,
  developer_accepted: UserCheck,
  developer_declined: UserX,
  invoice_generated: FileText,
  engagement_started: Briefcase,
  engagement_ended: Zap,
  requirement_update: Info,
  system: Bell,
};

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function NotificationsDropdown() {
  const { notifications, readIds, unreadCount, markAsRead, markAllRead } =
    useNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="relative gap-2">
          <Bell className="size-4" />
          Alerts
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-semibold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <CheckCheck className="size-3" />
              Mark all read
            </button>
          )}
        </div>
        <ScrollArea className="max-h-[400px]">
          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No notifications yet.
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((n) => {
                const Icon = typeIcon[n.type] ?? Bell;
                const isRead = readIds.has(n.id);

                const content = (
                  <div
                    className={`flex gap-3 px-4 py-3 transition-colors hover:bg-muted/50 ${
                      !isRead ? "bg-muted/30" : ""
                    }`}
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-pulse/10">
                      <Icon className="size-4 text-pulse" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium leading-tight">
                          {n.title}
                        </p>
                        {!isRead && (
                          <span className="mt-1 size-2 shrink-0 rounded-full bg-red-500" />
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                        {n.description}
                      </p>
                      <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                        {relativeTime(n.createdAt)}
                      </p>
                    </div>
                  </div>
                );

                return n.href ? (
                  <Link
                    key={n.id}
                    href={n.href}
                    onClick={() => markAsRead(n.id)}
                    className="block"
                  >
                    {content}
                  </Link>
                ) : (
                  <div key={n.id} onClick={() => markAsRead(n.id)}>
                    {content}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
