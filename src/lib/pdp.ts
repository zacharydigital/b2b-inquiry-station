import { getVerticalConfig, type PdpModuleKey } from './verticals';

export type { PdpModuleKey };

export function getPdpModules(vertical: unknown): PdpModuleKey[] {
  return getVerticalConfig(vertical).pdpModules;
}
