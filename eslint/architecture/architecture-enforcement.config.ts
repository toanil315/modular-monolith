import { ConfigWithExtends } from '@eslint/config-helpers';
import boundaries from 'eslint-plugin-boundaries';
import { appElements } from './app-elements';
import { cleanArchitectureLayerRule } from './clean-architecture-layer.rule';
import { moduleBoundaryRule } from './module-boundary.rule';

export const architectureEnforcementConfigs: ConfigWithExtends = {
  plugins: { boundaries },

  settings: {
    'boundaries/elements': appElements,
    'import/resolver': {
      typescript: { alwaysTryTypes: true },
    },
  },

  rules: {
    'boundaries/element-types': [
      'error',
      {
        default: 'allow',
        rules: [...cleanArchitectureLayerRule, ...moduleBoundaryRule],
      },
    ],
  },
};
