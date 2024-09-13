import { Injectable } from '@nestjs/common';
import {
  createWalletClient,
  http,
  publicActions,
  Address,
  Account,
  toEventHash,
  parseEventLogs,
  decodeEventLog,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { deployedContracts } from '../../../deployed-contracts/deployedContracts';
import { deployedSignatures } from '../../../deployed-contracts/deployedSignatures';
import { ReadContractDto } from './dto/read-contract-dto';
import { WriteContractDto } from './dto/write-contract-dto';
import { chainsConstant } from './contract-interaction.constant';
import { GetLogsEventDto } from './dto/get-logs-event-dto';

import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class ContractInteractionService {
  private account: Account;
  constructor() {
    const privateKey = process.env.DEPLOYER_PRIVATE_KEY! as Address;
    this.account = privateKeyToAccount(privateKey);
  }

  private createClient(chainId: string) {
    return createWalletClient({
      account: this.account,
      chain: chainsConstant[chainId],
      transport: http(),
    }).extend(publicActions);
  }

  private getContract(
    chainId: string,
    contractName: string,
    contractAddress?: string,
  ) {
    try {
      const client = this.createClient(chainId);
      const deployedContract = deployedContracts[chainId][contractName];
      const abi = deployedContract.abi;
      const address = contractAddress
        ? (contractAddress as Address)
        : (deployedContract.address as Address);
      return { client, abi, address };
    } catch (error) {
      throw new Error('Contract not found');
    }
  }

  async readFunction(readContractDto: ReadContractDto): Promise<any> {
    const { chainId, contractName, contractAddress, ...others } =
      readContractDto;
    const { client, address, abi } = this.getContract(
      chainId,
      contractName,
      contractAddress,
    );
    return await client.readContract({
      address,
      abi,
      ...others,
    });
  }

  async getLogs(getContractEventDto: GetLogsEventDto): Promise<any> {
    const { chainId, contractName, contractAddress, args, ...others } =
      getContractEventDto;
    const { client, address, abi } = this.getContract(
      chainId,
      contractName,
      contractAddress,
    );
    // Only can filter the indexed arguments
    const filter = await client.createContractEventFilter({
      //   fromBlock: 9416687n,
      ...others,
      abi,
      address,
      args: args as any,
    });
    const logs = await client.getFilterLogs({ filter });
    return parseEventLogs({ abi, logs });
  }

  async writeFunction(writeContractDto: WriteContractDto): Promise<any> {
    try {
      const { chainId, contractName, contractAddress, eventName, ...others } =
        writeContractDto;
      const { client, address, abi } = this.getContract(
        chainId,
        contractName,
        contractAddress,
      );
      const { request } = await client.simulateContract({
        address,
        abi,
        ...others,
      });
      const txHash = await client.writeContract(request);
      const txReceipt = await client.waitForTransactionReceipt({
        hash: txHash,
      });
      const logs = parseEventLogs({ abi, logs: txReceipt.logs, eventName });
      return {
        ...txReceipt,
        logs,
      };
    } catch (err) {
      throw new Error(`Contract Interaction error: ${err}`);
    }
  }
}
