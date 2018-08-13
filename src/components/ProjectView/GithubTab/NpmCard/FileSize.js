import prettyBytes from '../../../../helpers/pretty-bytes'

const FileSize = ({ value }) => {
  if (isNaN(value)) return null
  return prettyBytes(value)
}

export default FileSize
