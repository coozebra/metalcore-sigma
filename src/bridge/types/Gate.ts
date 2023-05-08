import { Network } from 'bridge/types/Network';
import { TokenStatus } from 'bridge/types/TokenStatus';

export interface IGate {
  address?: string;
  contract?: string;
  name?: string;
  network?: Network;
  tokenAddresses?: string[];
  tokenStatuses?: TokenStatus[];
  version?: string;
  position?: 'homeGate' | 'foreignGate';
}
