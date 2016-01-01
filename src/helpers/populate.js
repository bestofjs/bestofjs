// Add `tag` full object to a project object that contains only an array of tag ids
// 2 examples of call:
// * In a map function applied to an array of projets `projects.map( populate(tags) );`
// * For a single project: `project = populate(tags)(project);`
export default function populate(tags, links, reviews) {
  return function (project) {
    if (!project) throw new Error('populate() called with NO PROJECT!');

    const averageRating = getAverageRating(project, reviews);
    const populated = Object.assign({}, project, {
      tags: project.tags.map(id => tags[id]),
      links: (links && project.links) ? project.links.map(id => links[id]) : project.links,
      reviews: (reviews && project.reviews) ? (
          project.reviews.map(id => reviews[id])
        ) : (
          project.reviews
        ),
      averageRating
    });
    return populated;
  };
}

function getAverageRating(project, reviews) {
  if (!reviews || !project.reviews) return;
  const averageRating = (project.reviews
    .map(reviewId => reviews[reviewId].score)
    .reduce((item0, item1) => item0 + item1)) / project.reviews.length;
  return averageRating;
}
