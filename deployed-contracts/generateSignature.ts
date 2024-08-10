import { deployedContracts } from "./deployedContracts";
import fs from "fs";
import path from "path";

// Define the TypeScript interfaces
const interfaceDefinitions = `
interface SignatureDetails {
  [signatureName: string]: string;
}

interface DeployedSignatures {
  [chainId: string]: {
    [contractName: string]: SignatureDetails;
  };
}
`;

// Utility function to generate event signatures
const generateEventSignature = (event: any): string => {
  const indexedInputs = event.inputs
    .filter((input: any) => input.indexed)
    .map((input: any) => `${input.type} indexed ${input.name}`);
  const nonIndexedInputs = event.inputs
    .filter((input: any) => !input.indexed)
    .map((input: any) => `${input.type} ${input.name}`);
  return `event ${event.name}(${[...indexedInputs, ...nonIndexedInputs].join(
    ", "
  )})`;
};

// Function to generate signatures from deployedContracts
const generateSignatures = () => {
  const deployedSignatures: any = {};
  for (const [chainId, contracts] of Object.entries(deployedContracts)) {
    deployedSignatures[chainId] = {};
    for (const [contractName, contract] of Object.entries(contracts)) {
      if (contract.abi) {
        deployedSignatures[chainId][contractName] = {};
        for (const item of contract.abi) {
          if (item.type === "event") {
            deployedSignatures[chainId][contractName][item.name] =
              generateEventSignature(item);
          }
        }
      }
    }
  }
  return deployedSignatures;
};

// Generate and export the signatures with TypeScript interfaces
const deployedSignatures = generateSignatures();
const filePath = path.resolve(__dirname, "deployedSignatures.ts");
const content = `${interfaceDefinitions}\nexport const deployedSignatures: DeployedSignatures = ${JSON.stringify(
  deployedSignatures,
  null,
  2
)};`;
fs.writeFileSync(filePath, content);

console.log("deployedSignatures.ts file has been generated successfully.");
