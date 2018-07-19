# Architecture - Date Flow

The application is made with `create-react-app` and uses `redux` to manage the state.

## Flow

- The app starts => dispatch `FETCH_PROJECTS` action and call `fetchProjectsFromAPI` to get data from the API
- Ajax request https://bestofjs-api-v2.firebaseapp.com/projects.json => +150KB gzipped (527KB)
- Dispatch `FETCH_PROJECTS_SUCCESS` action
- The reducer updates `entities` object, creating the 2 objects `projects` and `tags`, that are indexed by id.

## JSON data loaded from the API

```json
{
  "date": "2018-04-18T21:03:03.017Z",
  "tags": [
    {
      "name": "UI Framework",
      "description":
        "Libraries and frameworks to build UI interfaces in the browser",
      "code": "framework"
    }
  ],
  "projects": [
    {
      "name": "React",
      "stars": 93838,
      "deltas": [101, 83, 99, 79, 59, 94, 86],
      "monthly": [64493, 71161, 78767, 86090, 88592, 90932, 93737],
      "url": "https://reactjs.org",
      "full_name": "facebook/react",
      "description":
        "A declarative, efficient, and flexible JavaScript library for building user interfaces.",
      "pushed_at": "2018-04-18T20:20:59.000Z",
      "owner_id": 69631,
      "tags": ["framework", "vdom", "react"],
      "contributor_count": 1177,
      "npm": "react",
      "version": "16.3.2",
      "dependency_count": 4,
      "icon": "react.svg"
    }
  ]
}
```

## Shape of the Redux store

```js
{
  entities: {
    projects: {
      react: {
        full_name: 'facebook/react',
        repository: 'https://github.com/facebook/react',
        slug: 'react',
        tags: ['framework', 'vdom', 'react'],
        deltas: [93, 90, 121, 104, 99, 48, 48],
        description:
          'A declarative, efficient, and flexible JavaScript library for building user interfaces.',
        name: 'React',
        pushed_at: '2018-07-14T02:21:52.000Z',
        stars: 106289,
        url: 'https://reactjs.org',
        npm: 'react',
        version: '16.4.1',
        dependency_count: 4,
        contributor_count: 1198,
        owner_id: 69631,
        stats: {
          total: 106289,
          daily: 93,
          weekly: 86.1,
          monthly: 268,
          quaterly: 143,
          yearly: 97
        },
        monthly: [70891, 78351, 85584, 93417, 95613, 98250, 106289],
        icon: 'react.svg'
      }
    },
    tags: {
      framework: {
        name: 'UI Framework',
        description: 'Libraries and frameworks to build UI interfaces in the browser',
        code: 'framework',
        id: 'framework'
      }
    },
    links: {},
    reviews: {},
    heroes: {},
    meta: {
      pending: false,
      lastUpdate: '2018-07-14T12:48:34.028Z'
    }
  }
}
```
