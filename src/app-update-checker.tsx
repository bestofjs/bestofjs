import React, { useEffect } from 'react'
import { fetchJSON } from 'helpers/fetch'

export function useAppUpdateChecker(options?: Options) {
  useEffect(() => {
    const updateChecker = new AppUpdateChecker(() => notifyUpdate(), options)

    updateChecker.start()
  }, []) //eslint-disable-line
}

type Meta = {
  date: string
  version: string
}

type Callback = () => Promise<boolean> // called when the user chooses "Update" (true) or "Ignore" (false)

type Options = {
  url?: string // URL of the JSON file to ping to get app meta data
  interval?: number // the number of milliseconds between each request
  nextIntervalRatio?: number // by how much the interval changes, when the notification is ignored
  isDebugMode?: boolean
}

export class AppUpdateChecker {
  onUpdateAvailable: Callback
  url: NonNullable<Options['url']>
  interval: NonNullable<Options['interval']>
  nextIntervalRatio: NonNullable<Options['nextIntervalRatio']>
  isDebugMode: NonNullable<Options['isDebugMode']>
  initialMeta: Meta | undefined
  timer: number | undefined

  constructor(
    onUpdateAvailable: Callback,
    {
      url = '/meta.json',
      interval = 60 * 1000, // 1 minute by default
      nextIntervalRatio = 2, // the interval between consecutive notifications doubles every time the user "ignores"
      isDebugMode = false
    }: Options = {}
  ) {
    this.onUpdateAvailable = onUpdateAvailable
    this.url = url
    this.interval = interval
    this.nextIntervalRatio = nextIntervalRatio
    this.isDebugMode = isDebugMode
    this.initialMeta = undefined

    this.initialize()
  }

  initialize = async () => {
    this.initialMeta = await this.fetchMeta()
    if (!this.initialMeta) {
      this.stop()
    }
  }

  start = () => {
    if (!this.timer) {
      this.timer = window.setInterval(
        this.checkForUpdateAvailability,
        this.interval
      )
    }
  }

  stop = () => {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = undefined
    }
  }

  async fetchMeta(): Promise<Meta | undefined> {
    try {
      console.log(`Checking app update every ${this.interval / 1000} seconds`)
      const meta = await fetchJSON(this.url)
      return meta as Meta
    } catch (error) {
      console.log('Unable to fetch meta data', error.message)
      return undefined
    }
  }

  checkForUpdateAvailability = async () => {
    try {
      const latestMeta = await this.fetchMeta()
      if (!latestMeta) return false

      if (
        this.isDebugMode ||
        new Date(latestMeta.date) > new Date(this.initialMeta!.date)
      ) {
        this.stop()
        const isUpdateAccepted = await this.onUpdateAvailable()
        if (isUpdateAccepted) {
          window.location.reload()
        } else {
          this.interval *= this.nextIntervalRatio
          this.start()
        }
      }
    } catch (error) {
      console.error(`Unable to check for app update: ${error.message}`)
    }
  }
}

function notifyUpdate(): Promise<boolean> {
  return new Promise(resolve => {
    if (window.confirm('OK?')) {
      resolve(true)
    } else {
      resolve(false)
    }
  })
}
