import React, { PropTypes } from 'react'
const options = [
  'Pretty bad, looks deprecated',
  'Some annoying defects',
  'It does the job, nothing more, nothing less',
  'A recommended choice',
  'Highly recommended over any other choice, a great piece of software!'
]
const RatingBox = React.createClass({
  propTypes: {
    score: PropTypes.object
  },
  render () {
    const { score } = this.props
    return (
      <div>
        {options.map((item, i) =>
          <div key={i} className="radio-button">
            <label>
              <input
                type="radio" name="score"
                value={i + 1}
                onClick={() => score.onChange(i + 1)}
                checked={score.value === (i + 1)}
              />
              {i + 1} - {item}
            </label>
          </div>
        )}
        <div className="score-bar editable">
          {options.map((text, i) =>
            <span
              key={i}
              className={`octicon octicon-heart icon ${i + 1 <= score.value ? 'on' : 'off'}`}
              onClick={() => score.onChange(i + 1)}
             />
          )}
        </div>
      </div>
    )
  }
})
export default RatingBox
