import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

import { fetchJSON } from 'helpers/fetch'
import { Button } from 'components/core'
import { useToast } from 'components/core/toast'

type Meta = {
  date: string
  version: string
}

type Callback = () => Promise<boolean> // called when the user chooses "Update" (true) or "Ignore" (false)

type Options = {
  url?: string // URL of the JSON file to ping to get app meta data
  interval?: number // the number of milliseconds between each request
  nextIntervalRatio?: number // by how much the interval changes, when the notification is ignored
  isSimulationMode?: boolean
}

export function useAppUpdateChecker({
  url = '/meta.json',
  interval = 60 * 1000, // 1 minute by default
  nextIntervalRatio = 2, // the interval between consecutive notifications doubles every time the user "ignores"
  isSimulationMode = false
}: Options = {}) {
  const timerRef = useRef<number | undefined>(undefined)
  const initialMetaRef = useRef<Meta | undefined>(undefined)
  const intervalRef = useRef<number>(interval)

  const { show } = useToast()

  function start() {
    if (timerRef.current) return
    timerRef.current = window.setInterval(
      checkForUpdateAvailability,
      intervalRef.current
    )
  }

  async function checkForUpdateAvailability() {
    try {
      const latestMeta = await fetchMeta()
      if (!latestMeta) return false
      if (
        isSimulationMode ||
        latestMeta.version !== initialMetaRef.current!.version
      ) {
        stop()
        const isUpdateAccepted = await show({
          render: close => (
            <AppUpdateToastContent close={close} version={latestMeta.version} />
          )
        })
        if (isUpdateAccepted) {
          window.location.reload()
        } else {
          intervalRef.current *= nextIntervalRatio
          start()
        }
      }
    } catch (error) {
      console.error(`Unable to check for app update: ${error.message}`)
    }
  }

  function stop() {
    const timer = timerRef.current
    if (timer) {
      clearInterval(timer)
      timerRef.current = undefined
    }
  }

  async function fetchMeta(): Promise<Meta | undefined> {
    try {
      if (isSimulationMode) {
        console.log(
          `Checking app update every ${intervalRef.current / 1000} seconds`
        )
      }
      const meta = await fetchJSON(url)
      return meta as Meta
    } catch (error) {
      console.error('Unable to fetch meta data', error.message)
      return undefined
    }
  }

  useEffect(() => {
    async function fetchInitialMeta() {
      const initialMeta = await fetchMeta()
      if (!initialMeta) return
      initialMetaRef.current = initialMeta
      start()
    }
    fetchInitialMeta()
  }, []) //eslint-disable-line
}

const Toast = styled.div`
  width: 400px;
  padding: 2rem;
  background-color: white;
`

const AppUpdateToastContent = ({ close, version }) => {
  return (
    <Toast>
      <h3 style={{ margin: '0 0 1rem' }}>
        Application Update <span className="text-muted">{version}</span>
      </h3>
      <p style={{ marginBottom: '1.5rem' }}>
        A new version of <i>Best of JavaScript</i> is available, click on
        "Update" to reload the window.
      </p>

      <ButtonGroup>
        <div>
          <Button onClick={() => close(false)}>Ignore</Button>
        </div>
        <div>
          <Button primary onClick={() => close(true)}>
            Update
          </Button>
        </div>
      </ButtonGroup>
    </Toast>
  )
}

const ButtonGroup = styled.div`
  display: flex;
  margin: 0 -0.5rem;
  > div {
    flex-basis: 50%;
    padding: 0 0.5rem;
  }
  button {
    width: 100%;
    font-size: 16px;
  }
`
