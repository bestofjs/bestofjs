import styled from "@emotion/styled";
import { Box, MainContent } from "components/core";
import { Footer } from "components/footer/footer";
import { Header } from "components/header/header";
import { SearchBox, SearchContainer } from "components/search";
import { APP_REPO_URL } from "config";
import { ProjectDataContainer } from "containers/project-data-container";

import Routes from "./pages/routes";

export const App = () => {
  const { error, isPending } = ProjectDataContainer.useContainer();

  return (
    <SearchContainer.Provider>
      <Layout>
        <Header />
        <SearchBox />
        <MainContainer id="main">
          {error ? (
            <ErrorMessage message={error.message || "Network error"} />
          ) : (
            <Routes />
          )}
        </MainContainer>
        {!isPending && <Footer />}
      </Layout>
    </SearchContainer.Provider>
  );
};

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContainer = styled.main`
  flex: 1 1 auto;
`;

const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <MainContent>
      <Box
        borderColor="var(--boxBorderColor)"
        bg="var(--cardBackgroundColor)"
        textAlign="center"
        p="4rem 1rem"
      >
        <Box fontSize="xl">
          Sorry, an error happened while fetching <i>Best of JS</i> data.
        </Box>
        <Box my={4}>
          <pre>{message}</pre>
        </Box>
        <Box>
          Try to <a href="/">reload</a> the window and please reach us on{" "}
          <a href={APP_REPO_URL}>GitHub</a> if the problem persists.
        </Box>
      </Box>
    </MainContent>
  );
};
