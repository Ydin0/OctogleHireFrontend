"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  type CalendarConnection,
  type CalendarBusyBlock,
  type CalendarInterview,
  type CompanyAvailabilitySlot,
  fetchCalendarStatus,
  fetchCalendarAvailability,
  fetchCompanySlots,
  fetchCalendarInterviews,
  createCompanySlot,
} from "@/lib/api/companies";
import { CalendarConnectionCard } from "./_components/calendar-connection-card";
import { CalendarWeekView } from "./_components/calendar-week-view";

function getWeekRange(offset = 0): { start: string; end: string } {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - now.getDay() + 1 + offset * 7);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 7);
  return { start: monday.toISOString(), end: sunday.toISOString() };
}

export default function CalendarPage() {
  const { getToken } = useAuth();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [connection, setConnection] = useState<CalendarConnection>({ connected: false });
  const [busyBlocks, setBusyBlocks] = useState<CalendarBusyBlock[]>([]);
  const [interviews, setInterviews] = useState<CalendarInterview[]>([]);
  const [slots, setSlots] = useState<CompanyAvailabilitySlot[]>([]);
  const [weekRange, setWeekRange] = useState(getWeekRange());

  // Show toast on successful connection redirect
  useEffect(() => {
    if (searchParams.get("connected") === "true") {
      toast.success("Calendar connected successfully");
    }
    if (searchParams.get("error")) {
      toast.error("Failed to connect calendar. Please try again.");
    }
  }, [searchParams]);

  const loadData = useCallback(
    async (start?: string, end?: string) => {
      const t = await getToken();
      setToken(t);
      if (!t) return;

      const effectiveStart = start ?? weekRange.start;
      const effectiveEnd = end ?? weekRange.end;

      const [conn, slotsData, interviewsData] = await Promise.all([
        fetchCalendarStatus(t),
        fetchCompanySlots(t),
        fetchCalendarInterviews(t, effectiveStart, effectiveEnd),
      ]);

      setConnection(conn);
      setSlots(slotsData);
      setInterviews(interviewsData);

      // Fetch busy blocks only if connected
      if (conn.connected) {
        const busy = await fetchCalendarAvailability(t, effectiveStart, effectiveEnd);
        setBusyBlocks(busy);
      } else {
        setBusyBlocks([]);
      }
    },
    [getToken, weekRange.start, weekRange.end],
  );

  useEffect(() => {
    loadData().finally(() => setLoading(false));
  }, [loadData]);

  const handleWeekChange = (start: string, end: string) => {
    setWeekRange({ start, end });
    loadData(start, end);
  };

  const handleCreateSlot = async (slot: {
    startTime: string;
    endTime: string;
    timezone: string;
  }) => {
    if (!token) return;
    const created = await createCompanySlot(token, slot);
    if (created) {
      toast.success("Availability slot added");
    } else {
      toast.error("Failed to add slot");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <div>
        <h1 className="text-lg font-semibold">Calendar</h1>
        <p className="text-sm text-muted-foreground">
          Connect your calendar and manage interview availability.
        </p>
      </div>

      <CalendarConnectionCard
        connection={connection}
        token={token!}
        onConnectionChange={() => loadData()}
      />

      <CalendarWeekView
        busyBlocks={busyBlocks}
        interviews={interviews}
        slots={slots}
        token={token!}
        onSlotCreated={() => loadData()}
        onCreateSlot={handleCreateSlot}
        onWeekChange={handleWeekChange}
      />
    </>
  );
}
