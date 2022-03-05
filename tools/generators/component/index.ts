import {
  generateFiles,
  getProjects,
  joinPathFragments,
  names,
  Tree
} from '@nrwl/devkit';

type NewComponentSchema = { name: string };

export default async function (host: Tree, schema: NewComponentSchema) {
  const fileName = names(schema.name).className;

  generateFiles(
    host,
    joinPathFragments(__dirname, './files'),
    joinPathFragments(getProjects(host).get('ui-components').sourceRoot, 'lib', fileName),
    { name: fileName, fileName, tmpl: '' }
  );
}
