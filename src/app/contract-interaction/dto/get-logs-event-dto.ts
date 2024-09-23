export class GetLogsEventDto {
  chainId: string;
  contractName: string;
  eventName: string;
  args: ArgsEventDto | undefined;
  contractAddress?: string;
  fromBlock: bigint;
  toBlock?: bigint;
}

class ArgsEventDto {
  [argsEvent: string]: any;
}
