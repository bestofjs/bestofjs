import React, { Component } from 'react'
import Select from 'react-select'

import Stars from '../utils/Stars'

function getOptions(input) {
  // if (input.length < 4) return Promise.resolve({ options: [] })
  console.log('fetch', input);
  const url = `https://api.github.com/search/repositories?q=${input}&sort=stars&order=desc`
  return fetch(url)
    .then(response => response.json())
    .then(json => {
      const items = json.items.map(item => ({
        value: item.full_name,
        owner: item.owner.login,
        stars: item.stargazers_count,
        label: item.name
      }))
      return { options: items }
    });
}

const Option = React.createClass({
  render() {
    const option = this.props.option
    return (
      <div>
        { option.label }
        by { option.owner }
      </div>
    )
  }
})

function renderOption(option) {
  // const option = this.props.option
  return (
    <div>
      <div>
        { option.label }
        <div style={{ float: 'right' }}>
          <Stars value={option.stars} />
        </div>
      </div>
      <div className="text-secondary">by { option.owner }</div>
    </div>
  )
}

function renderSelectedOption(option) {
  return (
    <div>{option.value}</div>
  )
}

class GithubRepo extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { field } = this.props
    return (
      <div>
        <Select.Async
          loadOptions={getOptions}
          optionRenderer={renderOption}
          valueRenderer={renderSelectedOption}
          value={field.value}
          name={field.name}
          minimumInput={3}
          onChange={item => {
            field.onChange(item)
          }}
        />
      </div>
    )
  }
}

export default GithubRepo
