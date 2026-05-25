import { getVerticalConfig, type PdpModuleKey } from './verticals';

export type { PdpModuleKey };

export function getPdpModules(vertical: unknown, override?: PdpModuleKey[]): PdpModuleKey[] {
  if (override?.length) {
    return override;
  }
  return getVerticalConfig(vertical).pdpModules;
}
