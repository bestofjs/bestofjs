import { getYearData, BarGraphItem } from "./monthly-trends-chart";

const sampleAugust: BarGraphItem[] = [
  { year: 2021, month: 8, value: undefined },
  { year: 2021, month: 9, value: undefined },
  { year: 2021, month: 10, value: undefined },
  { year: 2021, month: 11, value: 100 },
  { year: 2021, month: 12, value: 100 },
  { year: 2022, month: 1, value: 101 },
  { year: 2022, month: 2, value: 101 },
  { year: 2022, month: 3, value: 101 },
  { year: 2022, month: 4, value: 101 },
  { year: 2022, month: 5, value: 101 },
  { year: 2022, month: 6, value: 101 },
  { year: 2022, month: 7, value: 101 },
];

const sampleJanuary: BarGraphItem[] = [
  { year: 2022, month: 1, value: 101 },
  { year: 2022, month: 2, value: 101 },
  { year: 2022, month: 3, value: 101 },
  { year: 2022, month: 4, value: 101 },
  { year: 2022, month: 5, value: 101 },
  { year: 2022, month: 6, value: 101 },
  { year: 2022, month: 7, value: 101 },
  { year: 2022, month: 8, value: 101 },
  { year: 2022, month: 9, value: 101 },
  { year: 2022, month: 10, value: 101 },
  { year: 2022, month: 11, value: 101 },
  { year: 2022, month: 12, value: 101 },
];

it("Should compute years correctly when we are in th middle of the year", () => {
  expect(getYearData(sampleAugust)).toEqual([
    { year: 2021, months: [8, 9, 10, 11, 12] },
    { year: 2022, months: [1, 2, 3, 4, 5, 6, 7] },
  ]);
});

it("Should compute years correctly when we are in January", () => {
  expect(getYearData(sampleJanuary)).toEqual([
    { year: 2022, months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
  ]);
});
