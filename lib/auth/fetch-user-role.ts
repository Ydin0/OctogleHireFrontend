const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

interface UserRoleResponse {
  accountType: string | null;
  orgId: string | null;
}

export const fetchUserRole = async (
  authToken: string | null
): Promise<UserRoleResponse> => {
  if (!authToken) return { accountType: null, orgId: null };

  try {
    const response = await fetch(`${apiBaseUrl}/api/auth/session`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return { accountType: null, orgId: null };
    }

    const payload = await response.json();

    return {
      accountType:
        typeof payload.accountType === "string" ? payload.accountType : null,
      orgId: typeof payload.orgId === "string" ? payload.orgId : null,
    };
  } catch {
    return { accountType: null, orgId: null };
  }
};
