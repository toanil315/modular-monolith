import { BizModule, Layer, getLayerElementName } from './app-elements';

/**
 * Module Boundary Rules
 *
 * ┌──────────────────────┬───────────────────────────────────────────────┬────────────────────────────────────────────────────────────────────────┐
 * │ Module               │ Can Import From                               │ Cannot Import From                                                     │
 * ├──────────────────────┼───────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────┤
 * │ events               │ none                                          │ ticketing, users                                                       │
 * ├──────────────────────┼───────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────┤
 * │ ticketing            │ events/public, users/public                   │ any non-public part of events or users                                 │
 * ├──────────────────────┼───────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────┤
 * │ users                │ none                                          │ events, ticketing                                                      │
 * └──────────────────────┴───────────────────────────────────────────────┴────────────────────────────────────────────────────────────────────────┘
 *
 * ✅  Each module can only import from another module’s `public` API.
 * 🚫  Direct internal imports across modules are not allowed.
 * 💡  This enforces clear module boundaries and prevents circular dependencies.
 */

const moduleRelationShip: Record<BizModule, BizModule[]> = {
  [BizModule.Events]: [],
  [BizModule.Ticketing]: [BizModule.Events, BizModule.Users],
  [BizModule.Users]: [],
};

const layers = Object.values(Layer);
const bizModules = Object.values(BizModule);

export const moduleBoundaryRule = bizModules.flatMap((module) => {
  const unAssociatedModules = bizModules.filter(
    (m) => m !== module && !moduleRelationShip[module].includes(m),
  );

  const unAssociatedModuleLayers = layers.flatMap((layer) => {
    return unAssociatedModules.map((m) => getLayerElementName(m, layer));
  });

  const associatedModulePublicLayers = moduleRelationShip[module].map((m) =>
    getLayerElementName(m, Layer.Public),
  );

  const associatedModuleLayersExceptPublic = layers.flatMap((layer) => {
    if (layer === Layer.Public) return [];
    return moduleRelationShip[module].map((m) => getLayerElementName(m, layer));
  });

  // ✨ Build descriptive message
  const allowedText =
    moduleRelationShip[module].length > 0
      ? moduleRelationShip[module].map((m) => `${m}/public`).join(', ')
      : 'none';

  return layers.map((layer) => ({
    from: getLayerElementName(module, layer),
    disallow: [...unAssociatedModuleLayers, ...associatedModuleLayersExceptPublic],
    allow: associatedModulePublicLayers,
    message: `[Module Boundary] ${module} may only import from its associated modules' public APIs: ${allowedText}. Imports from unassociated or internal module paths are forbidden.`,
  }));
});
