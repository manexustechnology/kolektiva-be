export class ReadContractDto {
  chainId: string;
  contractName: string;
  functionName: string;
  args: any[];
  contractAddress?: string;
}
