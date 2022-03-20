import {
  generateFiles,
  getProjects,
  joinPathFragments,
  names,
  Tree
} from '@nrwl/devkit';

type NewComponentSchema = { name: string; directory?: string; flat: boolean };

function getDirectory(directory?: string): string[] {
  if (!directory) {
    return [''];
  }

  // Split by /
  return directory.split('/').map((folder) => names(folder.trim()).className);
}

export default async function (host: Tree, schema: NewComponentSchema) {
  let fileName: string[];

  if (schema.name.split(',').length) {
    fileName = schema.name
      .split(',')
      .map((name) => names(name.trim()).className);
  } else {
    fileName = [names(schema.name).className];
  }

  if (schema.directory) {
    const trimmed = schema.directory.trim();

    if (!/^(\/?[\w-_]+)+\/?$/g.test(trimmed)) {
      console.log('ERROR: Invalid path pattern.');
      process.exit(-1);
    }
  }

  fileName.forEach((file) => {
    generateFiles(
      host,
      joinPathFragments(__dirname, './files'),
      joinPathFragments(
        getProjects(host).get('ui-components').sourceRoot,
        'lib',
        ...getDirectory(schema.directory),
        schema.flat ? '' : file
      ),
      { name: file, fileName: file, tmpl: '' }
    );
  });
}
