import React from 'react'
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@reach/tabs'
import { ReadmeContent } from 'components/project-details/readme-card'
import { Box } from 'components/core'
// import '@reach/tabs/styles.css'

export const ReadmeTabs = ({
  projects,
  ...props
}: {
  projects: BestOfJS[]
}) => {
  return (
    <Box {...props}>
      <Tabs variant="enclosed">
        <TabList>
          {projects.map(project => (
            <Tab key={project.id}>{project.name}</Tab>
          ))}
        </TabList>
        <TabPanels>
          {projects.map(project => (
            <TabPanel key={project.id}>
              <Box bg="white" p={4}>
                <ReadmeContent project={project} />
              </Box>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Box>
  )
}
