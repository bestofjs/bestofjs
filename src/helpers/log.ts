/* eslint-disable no-console */
export default function log(props) {
  if (process.env.NODE_ENV && process.env.NODE_ENV !== "development")
    return false;
  console.log(props);
}
