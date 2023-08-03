/*
This component is not called if an error happens
it could work only if a `page.tsx` exists in the folder?
*/

"use client";

type Props = { error: Error };
export default function ProjectReadmeError({ error }: Props) {
  return (
    <>
      <h1>Error</h1>
      <p>Unable to load the project&lsquo;s README!</p>
      <code>{error.message}</code>
    </>
  );
}