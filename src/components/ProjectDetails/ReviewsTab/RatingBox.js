import React from 'react'
import PropTypes from 'prop-types'
import Div from './ScoreBar'

const options = [
  'Pretty bad, looks deprecated',
  'Some annoying defects',
  'It does the job, nothing more, nothing less',
  'A recommended choice',
  'Highly recommended over any other choice, a great piece of software!'
]

const RatingBox = ({ field }) => {
  const handleClick = i => () => field.onChange(i + 1)
  return (
    <div>
      {options.map((item, i) => (
        <div key={i} className="radio-button">
          <label>
            <input
              type="radio"
              name="score"
              value={i + 1}
              onChange={handleClick(i)}
              checked={field.value === i + 1}
            />
            {i + 1} - {item}
          </label>
        </div>
      ))}
      <Div className="score-bar editable" style={{ marginTop: '.5rem' }}>
        {options.map((text, i) => (
          <span
            key={i}
            className={`octicon octicon-heart icon ${
              i + 1 <= field.value ? 'on' : 'off'
            }`}
            onClick={handleClick(i)}
          />
        ))}
      </Div>
    </div>
  )
}

RatingBox.propTypes = {
  field: PropTypes.object
}

export default RatingBox
