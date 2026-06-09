import { ProposedMatchesClient } from "./_components/proposed-matches";
import { ConsoleScroll } from "../../_components/console-scroll";

const RequirementDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return (
    <ConsoleScroll>
      <ProposedMatchesClient requirementId={id} />
    </ConsoleScroll>
  );
};

export default RequirementDetailPage;
