import {
  generateFiles,
  getProjects,
  joinPathFragments,
  names,
  Tree
} from '@nrwl/devkit';

type NewComponentSchema = { name: string };

export default async function (host: Tree, schema: NewComponentSchema) {
  const name = names(schema.name).className;

  generateFiles(
    host,
    joinPathFragments(__dirname, './files'),
    `${getProjects(host).get('ui-components').sourceRoot}/${schema.name}`,
    { name, fileName: name, tmpl: '' }
  );
}
