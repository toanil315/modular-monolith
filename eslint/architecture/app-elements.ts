export enum BizModule {
  Events = 'events',
  Ticketing = 'ticketing',
  Users = 'users',
}

export enum Module {
  Common = 'common',
  Events = BizModule.Events,
  Ticketing = BizModule.Ticketing,
  Users = BizModule.Users,
}

export enum Layer {
  Infrastructure = 'infrastructure',
  Presentation = 'presentation',
  Integration = 'integration',
  Application = 'application',
  Domain = 'domain',
  Public = 'public',
}

export function getLayerElementName(module: string, layer: string) {
  return `${module}-${layer}`;
}

export const appElements = Object.values(Module).flatMap((module) => {
  return Object.values(Layer).map((layer) => ({
    type: getLayerElementName(module, layer),
    mode: 'full',
    pattern: `src/modules/${module}/${layer}/**`,
  }));
});
