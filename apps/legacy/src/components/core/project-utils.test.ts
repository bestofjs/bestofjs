import { slugify } from "./project";

it("Should generate the right slug", () => {
  expect(slugify("Vue.js")).toEqual("vuejs");
  expect(slugify("React Native")).toEqual("react-native");
  expect(slugify("date-fns")).toEqual("date-fns");
  expect(slugify("Angular 1")).toEqual("angular-1");
  expect(slugify("$mol")).toEqual("$mol");
  expect(slugify("You don't know JS")).toEqual("you-dont-know-js");
  expect(slugify("JS Algorithms & Data Structures")).toEqual(
    "js-algorithms-and-data-structures",
  );
});
