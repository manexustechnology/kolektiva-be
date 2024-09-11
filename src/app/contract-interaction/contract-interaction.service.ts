import { Injectable } from '@nestjs/common';
import { createWalletClient, http, publicActions, Address } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { liskSepolia, lisk } from 'viem/chains';
import { deployedContracts } from '../../../deployed-contracts/deployedContracts';
import { ReadContractDto } from './dto/read-contract-dto';
import { WriteContractDto } from './dto/write-contract-dto';
import { GetContractEventDto } from './dto/get-contract-event-dto';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class ContractInteractionService {
  private client: any;

  constructor() {
    const privateKey = process.env.DEPLOYER_PRIVATE_KEY! as Address;
    const account = privateKeyToAccount(privateKey);

    this.client = createWalletClient({
      account,
      chain: liskSepolia,
      transport: http(),
    }).extend(publicActions);
  }

  private getContract(
    chainId: string,
    contractName: string,
    contractAddress?: string,
  ) {
    try {
      const deployedContract = deployedContracts[chainId][contractName];
      const abi = deployedContract.abi;
      const address = contractAddress
        ? (contractAddress as Address)
        : (deployedContract.address as Address);
      return { abi, address };
    } catch (error) {
      throw new Error('Contract not found');
    }
  }

  async readFunction(readContractDto: ReadContractDto): Promise<any> {
    const { chainId, contractName, contractAddress, ...others } =
      readContractDto;
    const { address, abi } = this.getContract(
      chainId,
      contractName,
      contractAddress,
    );
    return await this.client.readContract({
      address,
      abi,
      ...others,
    });
  }

  async writeFunction(writeContractDto: WriteContractDto): Promise<any> {
    const { chainId, contractName, contractAddress, ...others } =
      writeContractDto;
    const { address, abi } = this.getContract(
      chainId,
      contractName,
      contractAddress,
    );
    const { request } = await this.client.simulateContract({
      address,
      abi,
      ...others,
    });
    const txHash = await this.client.writeContract(request);
    return await this.client.waitForTransactionReceipt({
      hash: txHash,
    });
  }

  async getLogs(getContractEventDto: GetContractEventDto): Promise<any> {
    const { chainId, contractName, contractAddress, ...others } =
      getContractEventDto;
    const { address, abi } = this.getContract(
      chainId,
      contractName,
      contractAddress,
    );
    // Only can filter the indexed arguments
    const filter = await this.client.createContractEventFilter({
      //   fromBlock: 9416687n,
      abi,
      address,
      ...others,
    });
    const logs = await this.client.getFilterLogs({ filter });
    return logs;
  }
}
