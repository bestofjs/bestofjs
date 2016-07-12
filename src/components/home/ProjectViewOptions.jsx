import React from 'react'

const allOptions = [
  {
    text: 'Show description',
    value: 'description',
  },
  {
    text: 'Show npms.io score',
    value: 'npms',
  },
  {
    text: 'Show packagequality.com score',
    value: 'packagequality',
  },
  {
    text: 'Show last commit',
    value: 'commit',
  }
]

const ProjectViewOptions = ({ open, values, onChange, onToggle, sortFilter }) => {
  const options = allOptions.map(option => Object.assign({}, option, {
    enabled: values[option.value]
  }))
  const handleToggle = (e) => {
    e.preventDefault()
    onToggle(!open)
  }
  return (
    <div className="project-view-options">
      <div className="title-container">
        <div className="hidden-mobile" style={{ fontSize: '1.1rem', flexGrow: '1' }}>
          <Title sortFilter={sortFilter} />
        </div>
        <a className="" href="#" onClick={handleToggle}>
          <span className="octicon octicon-gear"></span>
          <span className="" style={{ margin: '0 .2rem' }}>OPTIONS</span>
          <span className={`octicon octicon-chevron-${open ? 'down' : 'right'}`}></span>
        </a>
      </div>
      {open && (
        options.map(option =>
          <ViewOption
            key={option.value}
            option={option}
            onChange={onChange}
          />
        )
      )}
    </div>
  )
}

const Title = ({ sortFilter }) => {
  const titles = {
    'total': () => (
      <span>Projects sorted by <b>total</b> number of stars</span>
    ),
    'daily': () => (
      <span>Trending projects since <b>yesterday</b></span>
    ),
    'weekly': () => (
      <span>Trending projects since <b>1 week</b></span>
    ),
    'monthly': () => (
      <span>Trending projects since <b>1 month</b></span>
    ),
    'quaterly': () => (
      <span>Trending projects since <b>3 months</b></span>
    ),
    'packagequality': () => (
      <span>Projects sorted by <a href="http://packagequality.com">qualitypackage.com</a> score</span>
    ),
    'npms': () => (
      <span>Projects sorted by <a href="https://npms.io">npms.io</a> score</span>
    )
  }
  return (
    titles[sortFilter]()
  )}

const ViewOption = ({ option, onChange }) => {
  const handleChange = (e) => {
    const { value, checked } = e.target
    onChange(value, checked)
  }
  return (
    <div className="checkbox-container">
      <input type="checkbox" id={option.value} value={option.value} checked={option.enabled} onChange={handleChange} />
      <label htmlFor={option.value}>{option.text}</label>
    </div>
  )
}

export default ProjectViewOptions
