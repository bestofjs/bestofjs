import Toggle from "react-toggled";

import { ExpandableSection } from "./expandable-section";
import { FileSize } from "./file-size";
import { SizeDetailsList } from "./size-details-list";
import { ExternalLink } from "../../core/typography";

type Props = { project: BestOfJS.ProjectDetails };
export const BundleSize = ({ project }: Props) => {
  const { bundle } = project;
  if (!bundle) return <div>Loading bundle size...</div>;
  if (bundle.errorMessage)
    return (
      <div className="version text-secondary">
        Bundle size data not available
      </div>
    );
  return (
    <Toggle>
      {({ on, getTogglerProps }) => (
        <div>
          <ExpandableSection on={on} getTogglerProps={getTogglerProps}>
            Bundle Size data
            {!on && <BundleSizePreview bundle={bundle} />}
          </ExpandableSection>
          {on && <BundleSizeDetails project={project} bundle={bundle} />}
        </div>
      )}
    </Toggle>
  );
};

const BundleSizePreview = ({
  bundle,
}: {
  bundle: BestOfJS.ProjectDetails["bundle"];
}) => {
  return (
    <span className="text-secondary" style={{ marginLeft: ".5rem" }}>
      <FileSize value={bundle.gzip} /> (Minified + Gzipped)
    </span>
  );
};

const BundleSizeDetails = ({ project, bundle }) => {
  const url = `https://bundlephobia.com/result?p=${project.packageName}`;
  return (
    <SizeDetailsList>
      <SizeDetailsList.Item>
        <FileSize value={bundle.gzip} /> (Minified + Gzipped)
      </SizeDetailsList.Item>
      <SizeDetailsList.Item>
        <FileSize value={bundle.size} /> (Minified)
      </SizeDetailsList.Item>
      <SizeDetailsList.Link>
        View details on{" "}
        <ExternalLink url={url}>
          <i>Bundle Phobia</i>
        </ExternalLink>
      </SizeDetailsList.Link>
    </SizeDetailsList>
  );
};
