import { useHistory, useParams } from "react-router-dom";
import { useFetchMonthlyRankings } from "api/hooks";
import { MainContent, PageHeader, Spinner } from "components/core";
import {
  getNextMonth,
  getPreviousMonth,
  MonthlyRankingsNavigator,
  MonthlyRankingsProjects,
} from "components/monthly-rankings/rankings";
import { GoCalendar } from "react-icons/go";

export const MonthlyRankingsPage = () => {
  const { year, month } = useParams<{ year: string; month: string }>();
  const date = checkDateParams(year, month) ? { year, month } : null;
  return (
    <MainContent>
      <PageHeader title="Monthly Rankings" icon={<GoCalendar size={32} />} />
      <FetchMonthlyRankings date={date} />
    </MainContent>
  );
};

const FetchMonthlyRankings = ({ date }) => {
  const history = useHistory();
  const { data, error } = useFetchMonthlyRankings(date);

  if (error) {
    return <div>Unable to load the rankings</div>;
  }
  if (!data) {
    return <Spinner />;
  }
  const { year, month, isFirst, isLatest } = data as any;

  const goToPrevious = () => {
    const target = getPreviousMonth({ year, month });
    history.push(`/rankings/monthly/${target.year}/${target.month}`);
  };
  const goToNext = () => {
    const target = getNextMonth({ year, month });
    history.push(`/rankings/monthly/${target.year}/${target.month}`);
  };

  return (
    <>
      <MonthlyRankingsNavigator
        date={{ year, month }}
        isFirst={isFirst}
        isLatest={isLatest}
        goToPrevious={goToPrevious}
        goToNext={goToNext}
      />
      <MonthlyRankingsProjects
        projects={data.trending}
        limit={50}
        year={year}
        month={month}
      />
    </>
  );
};

function checkDateParams(year: string, month: string) {
  return isValidYear(year) && isValidMonth(month);
}
function isValidYear(year: string) {
  if (!year) return false;
  const yearNumber = Number(year);
  return !isNaN(yearNumber) && yearNumber > 2019 && yearNumber <= 2030;
}
function isValidMonth(month: string) {
  if (!month) return false;
  const monthNumber = Number(month);
  return !isNaN(monthNumber) && monthNumber >= 1 && monthNumber <= 12;
}
