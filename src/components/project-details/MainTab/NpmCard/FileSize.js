import prettyBytes from '../../../../helpers/pretty-bytes'

const FileSize = ({ value }) => {
  if (!value || isNaN(value)) return null // TODO investigate more to understand why `value` is null for some projects (timing?)
  return prettyBytes(value)
}

export default FileSize
