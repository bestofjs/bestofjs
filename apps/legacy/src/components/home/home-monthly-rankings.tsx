import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useFetchMonthlyRankings } from "api/hooks";
import { Button, Section, SectionHeading, Spinner } from "components/core";
import {
  getNextMonth,
  getPreviousMonth,
  MonthlyRankingsNavigator,
  MonthlyRankingsProjects,
} from "components/monthly-rankings/rankings";
import { GoCalendar } from "react-icons/go";

type MonthlyDate = {
  year: number;
  month: number;
};

export const HomeMonthlyRankings = () => {
  const [date, setDate] = useState<MonthlyDate | null>(null);

  return (
    <Section data-testid="home-monthly-ranking-section">
      <SectionHeading
        icon={<GoCalendar fontSize={32} />}
        title="Monthly Rankings"
      />
      <FetchMonthlyRankings date={date} setDate={setDate} />
    </Section>
  );
};

const FetchMonthlyRankings = ({ date, setDate }) => {
  const { data, error } = useFetchMonthlyRankings(date);

  if (error) {
    return <div>Unable to load the rankings</div>;
  }
  if (!data) {
    return <Spinner />;
  }
  const { year, month, isFirst, isLatest } = data as any;

  const goToPrevious = () => setDate(getPreviousMonth({ year, month }));

  const goToNext = () => setDate(getNextMonth({ year, month }));

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
        limit={5}
        year={year}
        month={month}
        footer={
          <Button
            as={RouterLink}
            to={`/rankings/monthly/${year}/${month}`}
            variant="link"
          >
            View full rankings »
          </Button>
        }
      />
    </>
  );
};
