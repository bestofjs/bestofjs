import { MainContent, PageHeader, Spinner } from "components/core";
import { HallOfFameMemberList } from "components/hall-of-fame/hall-of-fame-member-list";
import { MoreHeroes } from "components/hall-of-fame/more-heroes";
import { useHallOfFame } from "containers/hall-of-fame-container";

const HallOfFamePage = () => {
  const { heroes, isPending } = useHallOfFame();

  if (isPending) return <Spinner />;

  return (
    <MainContent>
      <PageHeader title="JavaScript Hall of Fame" />
      <div style={{ marginBottom: "2rem" }}>
        Here are some of the greatest developers, authors and speakers of the
        JavaScript community.
        <br />
        It is like the basket-ball Hall of Fame... except they are all still in
        activity!
      </div>
      <HallOfFameMemberList heroes={heroes} />
      <MoreHeroes />
    </MainContent>
  );
};

export default HallOfFamePage;
