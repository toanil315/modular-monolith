import { appBoundaryConfigs } from './eslint.boundaries-config';
import { baseConfigs } from './eslint.base-config';
import { defineConfig } from 'eslint/config';
import { cleanArchitectureLayersConfigs } from './eslint.clean-architecture-config';

export default defineConfig([baseConfigs, appBoundaryConfigs, cleanArchitectureLayersConfigs]);
