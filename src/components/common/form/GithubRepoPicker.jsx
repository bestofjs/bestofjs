import React from 'react'

import { fetchJSON } from '../../../helpers/fetch'

function getOptions (input) {
  const url = `https://api.github.com/search/repositories?q=${input}&sort=stars&order=desc`
  return fetchJSON(url)
    .then(json => {
      const items = json.items.map(item => ({
        value: item.full_name,
        owner: item.owner.login,
        stars: item.stargazers_count,
        label: item.name,
        description: item.description,
        avatar: item.owner.avatar_url
      }))
      return { options: items }
    })
}

function renderOption (option) {
  const avatarSize = 48
  return (
    <div className="repo-picker-option">
      <div className="first-row">
        <div className="icon">
          <img
            src={`${option.avatar}&size=${avatarSize}`}
            alt="icon" width={avatarSize}
            height={avatarSize}
          />
        </div>
        <div className="title">
          <span className="repo-name">{option.label}</span>
          <div className="text-secondary">
            by {option.owner}
          </div>
        </div>
        <div>
          <div className="stars">
            <Stars
              value={option.stars}
              icon
            />
          </div>
        </div>
      </div>
      <div className="text-secondary">{option.description}</div>
    </div>
  )
}

function renderSelectedOption (option) {
  return (
    <div>{option.value}</div>
  )
}

const GithubRepo = React.createClass({
  render () {
    const { field } = this.props
    return (
      <div>
        <Async
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
})

export default GithubRepo
