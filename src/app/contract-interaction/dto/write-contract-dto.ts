export class WriteContractDto {
  chainId: string;
  contractName: string;
  functionName: string;
  args: any[];
  contractAddress?: string;
}
