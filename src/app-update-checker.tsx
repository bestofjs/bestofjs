import React from 'react'
import { useLifecycles } from 'react-use'
import { Box, Button, LightMode, Stack, useToast } from '@chakra-ui/react'

import { fetchJSON } from 'helpers/fetch'
import { ExternalLink } from 'components/core'
import { ExternalLinkIcon } from 'components/core/icons'

const TOAST_ID = 'app-update-checker'

export function useAppUpdateChecker(options?: Options) {
  const toast = useToast()
  let updateChecker: AppUpdateChecker

  useLifecycles(
    () => {
      const onUpdateAvailable = async meta => {
        if (toast.isActive(TOAST_ID)) return
        const result = await notifyUpdate({ ...meta, toast })
        return result
      }
      updateChecker = new AppUpdateChecker(onUpdateAvailable, options)
      updateChecker.start()
    },
    () => {
      updateChecker.stop()
    }
  )
}

type Meta = {
  date: string
  version: string
}

type Callback = (Meta) => Promise<boolean> // called when the user chooses "Update" (true) or "Ignore" (false)

type Settings = {
  url: string // URL of the JSON file to ping to get app meta data
  interval: number // the number of milliseconds between each request
  nextIntervalRatio: number // by how much the interval changes, when the notification is ignored
  isSimulationMode: boolean // used to skip the date comparison, to be able to check the notification in dev mode
}
type Options = Partial<Settings>

export class AppUpdateChecker implements Settings {
  onUpdateAvailable: Callback
  url: string
  interval: number
  nextIntervalRatio: number
  isSimulationMode: boolean
  initialMeta: Meta | undefined
  timer: number | undefined

  constructor(
    onUpdateAvailable: Callback,
    {
      url = '/meta.json',
      interval = 60 * 1000, // 1 minute by default
      nextIntervalRatio = 2, // the interval between consecutive notifications doubles every time the user "ignores"
      isSimulationMode = false // skip the data comparison test and always show the notification
    }: Options = {}
  ) {
    this.onUpdateAvailable = onUpdateAvailable
    this.url = url
    this.interval = interval
    this.nextIntervalRatio = nextIntervalRatio
    this.isSimulationMode = isSimulationMode

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
      return meta
    } catch (error) {
      console.error('Unable to fetch meta data', error.message)
      return undefined
    }
  }

  checkForUpdateAvailability = async () => {
    try {
      const latestMeta = await this.fetchMeta()
      if (!latestMeta) return false

      if (
        this.isSimulationMode ||
        new Date(latestMeta.date) > new Date(this.initialMeta!.date)
      ) {
        this.stop()
        const isUpdateAccepted = await this.onUpdateAvailable(latestMeta)
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

function notifyUpdate({ version, toast }): Promise<boolean> {
  return new Promise(resolve => {
    toast({
      id: TOAST_ID, // to prevent a possible duplication of toasts on the screen
      position: 'top-right',
      duration: null,
      render: ({ onClose }) => (
        <AppUpdateNotification
          version={version}
          onClose={value => {
            onClose()
            resolve(value)
          }}
        />
      )
    })
  })
}

type Props = {
  onClose: (boolean) => void
  version: string
}
export const AppUpdateNotification = ({ version, onClose }: Props) => {
  // `colorMode` returns `system` instead of the current color mode in the context of the toast,
  // which causes problems when styling buttons.
  // We force the "Light Mode" and hard-code the colors, as a quick fix
  return (
    <LightMode>
      <Box
        m={4}
        p={4}
        width={400}
        borderWidth="1px"
        bg="white"
        color="gray.800"
        boxShadow="rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;"
      >
        <Box fontSize="xl" mb={2}>
          Application Update{' '}
          <Box as="span" color="gray.400">
            {version}
          </Box>
        </Box>

        <Box>
          A new version of <i>Best of JS</i> is available (
          <ExternalLink
            url="https://github.com/bestofjs/bestofjs-webui/blob/master/CHANGELOG.md"
            color="orange.500"
          >
            details
            <ExternalLinkIcon />
          </ExternalLink>
          ), click on "Update" to reload the window.
        </Box>

        <Stack mt={4} spacing={4} isInline>
          <Box flexBasis="50%">
            <Button variant="solid" onClick={() => onClose(false)} width="100%">
              Ignore
            </Button>
          </Box>
          <Box flexBasis="50%">
            <Button
              variant="solid"
              colorScheme="orange"
              onClick={() => onClose(true)}
              width="100%"
            >
              Update
            </Button>
          </Box>
        </Stack>
      </Box>
    </LightMode>
  )
}
