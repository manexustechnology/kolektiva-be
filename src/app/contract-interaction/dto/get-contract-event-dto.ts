export class GetContractEventDto {
  chainId: string;
  contractName: string;
  eventName: string;
  args: ArgsEventDto;
  contractAddress?: string;
  fromBlock: bigint;
  toBlock?: bigint;
}

class ArgsEventDto {
  [argsEvent: string]: any;
}
