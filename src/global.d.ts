declare namespace BestOfJS {
  type RawProject = {
    name: string
    full_name: string
    description: string
    tags: string[]
    stars: number
    trends: {
      daily: number
      weekly?: number
      monthly?: number
      yearly?: number
    }
    contributor_count: number
    pushed_at: string
    owner_id: string
    url: string
    branch: string
    npm: string
    downloads: number
    icon: string
  }

  // type Tag = {

  // }

  type Project = RawProject & {
    slug: string
    repository: string
    packageName: string
    addedPosition: number
  }

  type ProjectDetails = Project & {
    commit_count: number
    created_at: string
    bundle: {
      dependencyCount: number
      gzip: number
      name: string
      size: number
      version: '0.19.2'
      errorMessage?: string
    }
    npm: {
      dependencies: string[]
      deprecated: boolean
      name: string
      version: string
    }
    packageSize: {
      installSize: number
      publishSize: number
      version: string
    }
    timeSeries: {
      daily: number[]
      monthly: {
        year: number
        month: number
        firstDay: number
        lastDay: mumber
        delta: number
      }[]
    }
  }

  type HallOfFameMember = {
    username: string
    avatar: string
    followers: numbers
    bio: string
    blog: string
  }
}
