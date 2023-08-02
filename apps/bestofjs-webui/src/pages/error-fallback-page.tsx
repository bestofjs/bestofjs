import { Button, MainContent, PageHeader } from "components/core";

export const ErrorFallbackPage = () => {
  return (
    <MainContent>
      <PageHeader title="Error" />
      <div
        style={{
          border: "2px solid #fa9e59",
          padding: "4rem 1rem",
          textAlign: "center",
          fontSize: 16,
        }}
      >
        <p>
          The site has been updated, reload the browser or{" "}
          <a href="/">click here</a> to go the home page.
        </p>
        <p>
          If you see this message again, please reach us on GitHub, thank you!
        </p>
        <Button
          onClick={() => window.location.reload()}
          style={{
            fontSize: "1.2rem",
            marginTop: "1rem",
            width: 300,
            display: "inline",
          }}
        >
          Reload
        </Button>
      </div>
    </MainContent>
  );
};
