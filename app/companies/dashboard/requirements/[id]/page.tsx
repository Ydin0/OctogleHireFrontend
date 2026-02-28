import { ProposedMatchesClient } from "./_components/proposed-matches";

const RequirementDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return <ProposedMatchesClient requirementId={id} />;
};

export default RequirementDetailPage;
