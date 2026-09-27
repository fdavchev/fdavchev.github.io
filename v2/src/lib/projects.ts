import { getCollection, type CollectionEntry } from 'astro:content';
import { withBase } from './paths';

export type Project = CollectionEntry<'projects'>;

/** The stamp word for each project state. "In progress" is never softened into "Shipped". */
export const stateLabel: Record<Project['data']['state'], string> = {
  shipped: 'Shipped',
  'in-progress': 'In progress',
};

/** All case studies, strongest first (by `order` in their frontmatter). */
export async function getProjects(): Promise<Project[]> {
  const projects = await getCollection('projects');
  return projects.sort((first, second) => first.data.order - second.data.order);
}

/** The case-study URL for a project. */
export function projectHref(project: Project): string {
  return withBase(`work/${project.id}`);
}
