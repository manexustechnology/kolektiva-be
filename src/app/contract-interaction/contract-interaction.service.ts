import { Injectable } from '@nestjs/common';
import {
  createWalletClient,
  http,
  publicActions,
  Address,
  Account,
  parseEventLogs,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { deployedContracts } from '../../../deployed-contracts/deployedContracts';
import { ReadContractDto } from './dto/read-contract-dto';
import { WriteContractDto } from './dto/write-contract-dto';
import { chainsConstant } from './contract-interaction.constant';
import { GetLogsEventDto } from './dto/get-logs-event-dto';

import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class ContractInteractionService {
  private account: Account;

  /**
   * Initializes the service with the deployer's account.
   */
  constructor() {
    const privateKey = process.env.DEPLOYER_PRIVATE_KEY! as Address;
    this.account = privateKeyToAccount(privateKey);
  }

  /**
   * Creates a wallet client for interacting with the blockchain.
   * @param chainId The chain ID to create the client for.
   * @returns A wallet client instance.
   */
  private createClient(chainId: string) {
    return createWalletClient({
      account: this.account,
      chain: chainsConstant[chainId],
      transport: http(),
    }).extend(publicActions);
  }

  /**
   * Retrieves the contract instance for interaction.
   * @param chainId The chain ID where the contract is deployed.
   * @param contractName The name of the contract.
   * @param contractAddress The address of the contract (optional).
   * @returns An object containing the client, ABI, and address of the contract.
   */
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

  /**
   * Reads data from a contract using a given read contract DTO.
   * @param readContractDto The DTO containing read parameters.
   * @returns The result of the contract read operation.
   */
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

  /**
   * Retrieves logs for contract events based on filters.
   * @param getContractEventDto The DTO containing event filter parameters.
   * @returns The parsed event logs.
   */
  async getLogs(getContractEventDto: GetLogsEventDto): Promise<any> {
    const { chainId, contractName, contractAddress, args, ...others } =
      getContractEventDto;
    const { client, address, abi } = this.getContract(
      chainId,
      contractName,
      contractAddress,
    );
    // Only can filter the indexed arguments
    //   fromBlock: 9416687n,
    const filter = await client.createContractEventFilter({
      ...others,
      abi,
      address,
      args: args as any,
    });
    const logs = await client.getFilterLogs({ filter });
    return parseEventLogs({ abi, logs });
  }

  /**
   * Writes data to a contract using a given write contract DTO.
   * @param writeContractDto The DTO containing write parameters.
   * @returns The result of the contract write operation, including transaction receipt and parsed logs.
   */
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
