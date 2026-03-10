"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  MapPin,
  Search,
  Users,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";

import {
  browseCompanyDevelopers,
  type BrowseDeveloper,
  type BrowseDevelopersParams,
} from "@/lib/api/companies";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TECH_STACK_OPTIONS = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Python",
  "Go",
  "Rust",
  "Java",
  "Ruby",
  "PHP",
  "Swift",
  "Kotlin",
  "Flutter",
  "React Native",
  "Vue.js",
  "Angular",
  "Django",
  "Laravel",
  "AWS",
  "Docker",
  "Kubernetes",
  "PostgreSQL",
  "MongoDB",
];

const EXPERIENCE_OPTIONS = [
  { label: "Any experience", value: "all" },
  { label: "1+ years", value: "1" },
  { label: "3+ years", value: "3" },
  { label: "5+ years", value: "5" },
  { label: "8+ years", value: "8" },
  { label: "10+ years", value: "10" },
];

const AVAILABILITY_OPTIONS = [
  { label: "Any availability", value: "all" },
  { label: "Immediate", value: "immediate" },
  { label: "2 weeks", value: "2_weeks" },
  { label: "1 month", value: "1_month" },
  { label: "Not available", value: "not_available" },
];

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const formatRate = (rate: number) => {
  if (!rate) return "--";
  return `$${rate.toLocaleString()}`;
};

const BrowseDevelopersPage = () => {
  const { getToken } = useAuth();
  const [developers, setDevelopers] = useState<BrowseDeveloper[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // Filter state
  const [search, setSearch] = useState("");
  const [stack, setStack] = useState("all");
  const [experience, setExperience] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(timer);
  }, [search]);

  const loadDevelopers = useCallback(
    async (page = 1) => {
      setLoading(true);
      const token = await getToken();
      const params: BrowseDevelopersParams = { page, limit: 20 };
      if (debouncedSearch) params.search = debouncedSearch;
      if (stack !== "all") params.stack = stack;
      if (experience !== "all") params.experience = experience;
      if (availability !== "all") params.availability = availability;

      const data = await browseCompanyDevelopers(token, params);
      setDevelopers(data.developers);
      setPagination(data.pagination);
      setLoading(false);
    },
    [getToken, debouncedSearch, stack, experience, availability],
  );

  useEffect(() => {
    loadDevelopers(1);
  }, [loadDevelopers]);

  return (
    <>
      {/* Page header */}
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Talent Pool
        </p>
        <h1 className="text-lg font-semibold">Browse Developers</h1>
        <p className="text-sm text-muted-foreground">
          Discover available developers on the platform.
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={stack} onValueChange={setStack}>
              <SelectTrigger>
                <SelectValue placeholder="Tech stack" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any tech stack</SelectItem>
                {TECH_STACK_OPTIONS.map((tech) => (
                  <SelectItem key={tech} value={tech}>
                    {tech}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={experience} onValueChange={setExperience}>
              <SelectTrigger>
                <SelectValue placeholder="Experience" />
              </SelectTrigger>
              <SelectContent>
                {EXPERIENCE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={availability} onValueChange={setAvailability}>
              <SelectTrigger>
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABILITY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!loading && (
            <p className="mt-3 text-xs text-muted-foreground">
              {pagination.total} developer{pagination.total !== 1 ? "s" : ""} found
            </p>
          )}
        </CardContent>
      </Card>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Empty state */}
      {!loading && developers.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <Users className="size-5 text-muted-foreground" />
            </div>
            <p className="mt-4 text-sm font-medium">No developers found</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try adjusting your search or filters.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Developer grid */}
      {!loading && developers.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {developers.map((dev) => (
            <Card key={dev.id} className="transition-colors hover:border-pulse/30">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <Avatar className="size-11 shrink-0">
                    {dev.avatar ? (
                      <Image
                        src={dev.avatar}
                        alt={dev.name}
                        width={44}
                        height={44}
                        unoptimized
                        className="size-full rounded-full object-cover"
                      />
                    ) : null}
                    <AvatarFallback>{getInitials(dev.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="truncate text-sm font-semibold">
                      {dev.name}
                    </CardTitle>
                    <CardDescription className="truncate text-xs">
                      {dev.role}
                    </CardDescription>
                    {dev.location && (
                      <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="size-3 shrink-0" />
                        <span className="truncate">{dev.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Skills */}
                {dev.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {dev.skills.slice(0, 5).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-[10px]">
                        {skill}
                      </Badge>
                    ))}
                    {dev.skills.length > 5 && (
                      <Badge variant="outline" className="text-[10px]">
                        +{dev.skills.length - 5}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 border-t pt-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Experience
                    </p>
                    <p className="text-sm font-medium">
                      {dev.yearsOfExperience}yr{dev.yearsOfExperience !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Hourly
                    </p>
                    <p className="font-mono text-sm font-medium">
                      {formatRate(dev.hourlyRate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Monthly
                    </p>
                    <p className="font-mono text-sm font-medium">
                      {formatRate(dev.monthlyRate)}
                    </p>
                  </div>
                </div>

                {/* Action */}
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href={`/companies/dashboard/developers/${dev.id}`}>
                    View Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => loadDevelopers(pagination.page - 1)}
            >
              <ChevronLeft className="mr-1 size-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => loadDevelopers(pagination.page + 1)}
            >
              Next
              <ChevronRight className="ml-1 size-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default BrowseDevelopersPage;
