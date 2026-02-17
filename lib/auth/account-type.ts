type MetadataRecord = Record<string, unknown> | undefined;

type ClerkUserLike = {
  publicMetadata?: MetadataRecord;
  unsafeMetadata?: MetadataRecord;
  privateMetadata?: MetadataRecord;
};

type DashboardPath = "/developers/dashboard" | "/companies/dashboard";

const toNormalizedString = (value: unknown): string | null => {
  if (typeof value !== "string") return null;

  const normalized = value.trim().toLowerCase();
  return normalized.length > 0 ? normalized : null;
};

const readMetadataValue = (
  metadata: MetadataRecord,
  keys: readonly string[],
): string | null => {
  if (!metadata) return null;

  for (const key of keys) {
    const value = toNormalizedString(metadata[key]);
    if (value) return value;
  }

  return null;
};

const parseAccountType = (value: string | null): DashboardPath | null => {
  if (!value) return null;

  if (
    value.includes("company") ||
    value.includes("client") ||
    value.includes("employer") ||
    value.includes("organization")
  ) {
    return "/companies/dashboard";
  }

  if (
    value.includes("developer") ||
    value.includes("talent") ||
    value.includes("engineer")
  ) {
    return "/developers/dashboard";
  }

  return null;
};

export const resolveDashboardPath = (params: {
  user?: ClerkUserLike | null;
  orgId?: string | null;
}): DashboardPath => {
  const { user, orgId } = params;

  if (orgId) return "/companies/dashboard";

  const sources: Array<MetadataRecord> = [
    user?.publicMetadata,
    user?.unsafeMetadata,
    user?.privateMetadata,
  ];

  for (const source of sources) {
    const fromAccountType = readMetadataValue(source, ["accountType"]);
    const parsedFromAccountType = parseAccountType(fromAccountType);
    if (parsedFromAccountType) return parsedFromAccountType;

    const fromRole = readMetadataValue(source, ["role"]);
    const parsedFromRole = parseAccountType(fromRole);
    if (parsedFromRole) return parsedFromRole;
  }

  return "/developers/dashboard";
};
