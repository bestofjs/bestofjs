import { lazy, Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { ErrorBoundary, Spinner } from "components/core";
import BookmarksPage from "pages/bookmarks-page";
import { ErrorFallbackPage } from "pages/error-fallback-page";
import { FeaturedPage } from "pages/featured-page";
import HallOfFamePage from "pages/hall-of-fame-page";
import HomePage from "pages/home-page";
import { MonthlyRankingsPage } from "pages/monthly-rankings-page";
import { NoMatchPage } from "pages/no-match-page";
import { SearchResultsPage } from "pages/search-results-page";
import TagsPage from "pages/tags-page";

const AsyncViewProject = lazy(() => import("pages/project-details-page"));
const AsyncAboutPage = lazy(() => import("pages/about-page"));
const TimelinePage = lazy(() => import("pages/timeline-page"));

const Routes = (props) => {
  return (
    <ErrorBoundary fallback={<ErrorFallbackPage />}>
      <Suspense fallback={<Spinner />}>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/projects/:id">
            <AsyncViewProject {...props} />
          </Route>
          <Route exact path="/projects" component={SearchResultsPage} />
          <Redirect from={`/tags/:id`} to={`/projects?tags=:id`} />
          <Route path={`/tags`} component={TagsPage} />
          <Route exact path="/hall-of-fame">
            <HallOfFamePage {...props} />
          </Route>
          <Redirect from="/hof" to="/hall-of-fame" />
          <Route path="/bookmarks" component={BookmarksPage} />
          <Route path="/featured" component={FeaturedPage} />
          <Route path="/timeline" component={TimelinePage} />
          <Route
            path="/rankings/monthly/:year?/:month?"
            component={MonthlyRankingsPage}
          />
          <Route exact path="/about" component={AsyncAboutPage} />
          <Route component={NoMatchPage} />
        </Switch>
      </Suspense>
    </ErrorBoundary>
  );
};

export default Routes;
