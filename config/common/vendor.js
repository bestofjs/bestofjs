//Returns the array of node modules bundled into the "vendor" file.
module.exports = function() {
  return [
   "react",
   "react-router",
   "redux",
   "react-redux",
   "redux-router",
   "redux-thunk",
   "history",
   'es6-promise',
   'axios',

   //only include here the functions we use from Lodash
   'lodash/function/debounce',
   'lodash/object/get',
   'lodash/collection/pluck',

   'moment',
   'numeral'
 ];
};
