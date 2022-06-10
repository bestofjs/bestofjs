import React from "react";

import { Box, Card, CardSection, Link } from "components/core";
import { APP_REPO_URL } from "config";
import { ExternalLink } from "./typography";

// From https://reactjs.org/docs/concurrent-mode-suspense.html#handling-errors
type Props = { fallback: React.ReactNode };
type State = { error: Error | null };
export class ErrorBoundary extends React.Component<Props, State> {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (!!this.state.error) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// To be used as the fallback of `<ErrorBoundary>` components
export const ErrorCard = ({ children }: { children: React.ReactNode }) => {
  const url = APP_REPO_URL + "/issues";

  return (
    <Card>
      <CardSection>
        <Box mb={2}>{children}</Box>⚠ This is an unexpected error, please{" "}
        <ExternalLink url={url}>contact us on GitHub</ExternalLink>.
      </CardSection>
    </Card>
  );
};
