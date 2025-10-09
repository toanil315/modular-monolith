import { Layer, Module, getLayerElementName } from './app-elements';

/**
 * Clean Architecture Layer Rules
 *
 * ┌────────────────┬──────────────────────────────────────────────┬────────────────────────────────────────────────────────────┐
 * │ Layer          │ Can Import From                              │ Cannot Import From                                         │
 * ├────────────────┼──────────────────────────────────────────────┼────────────────────────────────────────────────────────────┤
 * │ presentation   │ application, domain                          │ infrastructure, integration, public                        │
 * ├────────────────┼──────────────────────────────────────────────┼────────────────────────────────────────────────────────────┤
 * │ application    │ domain                                       │ presentation, infrastructure, integration, public          │
 * ├────────────────┼──────────────────────────────────────────────┼────────────────────────────────────────────────────────────┤
 * │ domain         │ none                                         │ presentation, application, infrastructure, integration,    |
 * |                |                                              | public                                                     │
 * ├────────────────┼──────────────────────────────────────────────┼────────────────────────────────────────────────────────────┤
 * │ integration    │ application, domain                          │ presentation, infrastructure, public                       │
 * ├────────────────┼──────────────────────────────────────────────┼────────────────────────────────────────────────────────────┤
 * │ infrastructure │ anything                                     │ none                                                       │
 * ├────────────────┼──────────────────────────────────────────────┼────────────────────────────────────────────────────────────┤
 * │ public         │ application, domain, integration             │ presentation, infrastructure                               │
 * └────────────────┴──────────────────────────────────────────────┴────────────────────────────────────────────────────────────┘
 */
const allowedImports: Record<Layer, Layer[]> = {
  [Layer.Presentation]: [Layer.Application, Layer.Domain],
  [Layer.Application]: [Layer.Domain],
  [Layer.Domain]: [],
  [Layer.Integration]: [Layer.Application, Layer.Domain],
  [Layer.Infrastructure]: Object.values(Layer),
  [Layer.Public]: [Layer.Application, Layer.Domain, Layer.Integration],
};

const modules = Object.values(Module);
const layers = Object.values(Layer);

export const cleanArchitectureLayerRule = modules.flatMap((module) =>
  layers.map((layer) => {
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
