const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

interface UserRoleResponse {
  accountType: string | null;
  orgId: string | null;
  roles: string[];
  isSuperAdmin: boolean;
}

export const fetchUserRole = async (
  authToken: string | null
): Promise<UserRoleResponse> => {
  if (!authToken) return { accountType: null, orgId: null, roles: [], isSuperAdmin: false };

  try {
    const response = await fetch(`${apiBaseUrl}/api/auth/session`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return { accountType: null, orgId: null, roles: [], isSuperAdmin: false };
    }

    const payload = await response.json();

    return {
      accountType:
        typeof payload.accountType === "string" ? payload.accountType : null,
      orgId: typeof payload.orgId === "string" ? payload.orgId : null,
      roles: Array.isArray(payload.roles) ? payload.roles : [],
      isSuperAdmin: payload.isSuperAdmin === true,
    };
  } catch {
    return { accountType: null, orgId: null, roles: [], isSuperAdmin: false };
  }
};
