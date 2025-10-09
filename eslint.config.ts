import { architectureEnforcementConfigs } from './eslint/architecture/architecture-enforcement.config';
import { baseConfigs } from './eslint/eslint.base-config';
import { defineConfig } from 'eslint/config';

export default defineConfig([baseConfigs, architectureEnforcementConfigs]);
