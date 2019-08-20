import React from 'react'

import MainContent from '../common/MainContent'
import ProjectList from '../projects/ConnectedProjectList'
import ProjectFilterTabs from '../ProjectSortFilter'
import TagViewTitle from './TagViewTitle'
import PaginationControls from '../common/pagination/PaginationControls'

const TagFilter = ({
  tag,
  projects,
  total,
  url,
  pageNumber,
  itemPerPage,
  graphProjects,
  isLoggedin,
  ui,
  showTags
}) => {
  const showStars =
    ui.starFilter === 'total' ||
    ui.starFilter === 'packagequality' ||
    ui.starFilter === 'npms'

  return (
    <MainContent>
      {tag ? (
        <TagViewTitle
          title={tag.name}
          count={total}
          icon={'tag'}
          description={tag.description}
        />
      ) : (
        <TagViewTitle title={'All projects'} count={total} />
      )}
      <ProjectFilterTabs
        currentValue={ui.starFilter}
        rootUrl={tag ? `/tags/${tag.id}` : '/projects'}
      />
      <ProjectList
        projects={projects}
        showDescription
        showURL
        isLoggedin={isLoggedin}
        showDelta={!showStars}
        deltaFilter={ui.starFilter}
        showStars={showStars}
        showTags={showTags}
        showMetrics={false}
        viewOptions={ui.viewOptions}
      />
      {total > itemPerPage && (
        <PaginationControls
          currentPage={pageNumber}
          total={total}
          pageSize={itemPerPage}
          url={url}
        />
      )}
    </MainContent>
  )
}

export default TagFilter
