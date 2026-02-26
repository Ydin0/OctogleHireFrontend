"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

interface AddAdminFormProps {
  token: string;
}

function AddAdminForm({ token }: AddAdminFormProps) {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const clearFeedback = () => {
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedFirst = firstName.trim();
    if (!trimmedEmail || !trimmedFirst) return;

    setIsLoading(true);
    clearFeedback();

    try {
      const response = await fetch(`${apiBaseUrl}/api/admin/team`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
          firstName: trimmedFirst,
          lastName: lastName.trim(),
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        throw new Error(payload?.message ?? "Failed to invite admin");
      }

      const data = (await response.json().catch(() => ({}))) as {
        method?: string;
      };

      if (data.method === "invited") {
        setSuccess(
          `Invitation sent to ${trimmedEmail}. They'll receive an email to set up their account.`
        );
      } else {
        setSuccess(`${trimmedEmail} has been upgraded to admin.`);
      }

      setFirstName("");
      setLastName("");
      setEmail("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            First Name
          </p>
          <Input
            type="text"
            placeholder="Jane"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              clearFeedback();
            }}
            required
          />
        </div>

        <div className="space-y-1.5">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Last Name
          </p>
          <Input
            type="text"
            placeholder="Doe"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              clearFeedback();
            }}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Email Address
        </p>
        <Input
          type="email"
          placeholder="colleague@company.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clearFeedback();
          }}
          required
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-emerald-600">{success}</p>}

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !email.trim() || !firstName.trim()}
      >
        {isLoading ? "Sending Invite..." : "Invite Admin"}
      </Button>
    </form>
  );
}

export { AddAdminForm };
