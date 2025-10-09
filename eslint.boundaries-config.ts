import { ConfigWithExtends } from '@eslint/config-helpers';
import boundaries from 'eslint-plugin-boundaries';

const sharedModules = ['common'];
const modules = ['events', 'ticketing', 'users'];

export const appBoundaryConfigs: ConfigWithExtends = {
  plugins: { boundaries },

  settings: {
    'boundaries/elements': getModuleBoundaryElements(),
    'import/resolver': {
      typescript: { alwaysTryTypes: true },
    },
  },

  rules: {
    'boundaries/element-types': [
      'error',
      {
        default: 'allow',
        rules: getOnlyImportFromPublicEntryRule(),
      },
    ],
  },
};

// Helpers
function getPublicElementName(module: string) {
  return `${module}-public`;
}

function getModuleBoundaryElements() {
  return [...sharedModules, ...modules].flatMap((module) => [
    {
      type: getPublicElementName(module),
      mode: 'folder',
      pattern: `src/modules/${module}/public/**`,
    },
    {
      type: module,
      mode: 'full',
      pattern: `src/modules/${module}/**`,
    },
  ]);
}

/**
 * Restrict cross-module imports — a module can only import another module’s public API.
 */
function getOnlyImportFromPublicEntryRule() {
  return modules.map((module) => {
    const otherModules = modules.filter((m) => m !== module);
    return {
      from: module,
      disallow: otherModules,
      allow: otherModules.map(getPublicElementName), // only allow public API import
      message: `[Module Boundary] ${module} may only import from <module>/public.`,
    };
  });
}
