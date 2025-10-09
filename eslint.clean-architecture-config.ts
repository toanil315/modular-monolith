import { ConfigWithExtends } from '@eslint/config-helpers';

const sharedModules = ['common'];
const modules = ['events', 'ticketing', 'users'];

export const cleanArchitectureLayersConfigs: ConfigWithExtends = {
  settings: {
    'boundaries/elements': getModuleLayerElements(),
    'import/resolver': {
      typescript: { alwaysTryTypes: true },
    },
  },

  rules: {
    'boundaries/element-types': [
      'error',
      {
        default: 'allow',
        rules: getCleanArchitectureLayerRule(),
      },
    ],
  },
};

// Helpers
function getLayerElementName(module: string, layer: string) {
  return `${module}-${layer}`;
}

function getModuleLayerElements() {
  const layers = [
    'infrastructure',
    'presentation',
    'integration',
    'application',
    'domain',
    'public',
  ];
  const allModules = [...sharedModules, ...modules];

  return allModules.flatMap((module) =>
    layers.map((layer) => ({
      type: getLayerElementName(module, layer),
      mode: 'full',
      pattern: `src/modules/${module}/${layer}/**`,
    })),
  );
}

/**
 * Clean Architecture Layer Rules
 *
 * ┌────────────────┬──────────────────────────────┬──────────────────────────────────────────────┐
 * │ Layer          │ Can Import From              │ Cannot Import From                           │
 * ├────────────────┼──────────────────────────────┼──────────────────────────────────────────────┤
 * │ presentation   │ application, domain          │ infrastructure, integration                  │
 * │ application    │ domain                       │ presentation, infrastructure, integration    │
 * │ domain         │ none                         │ everything else                              │
 * │ integration    │ application                  │ others                                       │
 * │ infrastructure │ anything                     │ none                                         │
 * └────────────────┴──────────────────────────────┴──────────────────────────────────────────────┘
 */
function getCleanArchitectureLayerRule() {
  const layers = ['presentation', 'application', 'domain', 'integration', 'infrastructure'];
  const allModules = [...sharedModules, ...modules];

  const allowedImports: Record<string, string[]> = {
    presentation: ['application', 'domain'],
    application: ['domain'],
    domain: [],
    // CORRECTED LOGIC: integration should only import from application.
    integration: ['application'],
    infrastructure: layers, // can depend on anything
  };

  return allModules.flatMap((module) =>
    layers.map((layer) => {
      const otherModules = modules.filter((m) => m !== module);

      const fromType = getLayerElementName(module, layer);

      // Allow only from same module, same or lower layers (per rule)
      const allowed = allowedImports[layer].map((l) => getLayerElementName(module, l));

      // Disallow everything else *within same module*
      const disallowed = layers
        .filter((l) => l !== layer && !allowedImports[layer].includes(l))
        .map((l) => getLayerElementName(module, l));

      return {
        from: fromType,
        disallow: disallowed,
        allow: allowed,
        message: `[Clean Architecture] ${module}/${layer} layer may only import from: ${
          allowedImports[layer].length > 0 ? allowedImports[layer].join(', ') : 'none'
        }.`,
      };
    }),
  );
}
