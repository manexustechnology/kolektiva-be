import { liskSepolia, lisk, base, anvil, baseSepolia } from 'viem/chains';

export const chainsConstant: { [chainId: string]: any } = {
  31337: anvil,
  4202: liskSepolia,
  1135: lisk,
  84532: baseSepolia,
  8453: base,
};
