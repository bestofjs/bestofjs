import React from 'react'

import { prettyBytes } from 'helpers/pretty-bytes'

type Props = { value: number }
export const FileSize = ({ value }: Props) => {
  if (!value || isNaN(value)) return null // TODO investigate more to understand why `value` is null for some projects (timing?)
  return <>{prettyBytes(value)}</>
}
