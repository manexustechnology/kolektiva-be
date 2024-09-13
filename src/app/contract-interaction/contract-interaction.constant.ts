import { liskSepolia, lisk, anvil } from 'viem/chains';

export const chainsConstant: { [chainId: string]: any } = {
  31337: anvil,
  4202: liskSepolia,
  1135: lisk,
};
