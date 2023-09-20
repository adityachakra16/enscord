import { Alchemy, Network } from "alchemy-sdk";

const alchemy = new Alchemy({
  network: Network.ETH_MAINNET,
  apiKey: process.env.ALCHEMY_API_KEY_MAINNET,
});

export function ensNames(ethAddress: string): string[] {
  return [];
}

export function isEnsOwner(ethAddresses: string[], ensName: string): boolean {
  for (const ethAddress of ethAddresses) {
    if (ensNames(ethAddress).includes(ensName)) return true;
  }

  return false;
}

export async function resolveENSName(
  ethAddress: string
): Promise<string | null> {
  const addr = await alchemy.core.lookupAddress(ethAddress);
  return addr;
}

export async function resolveAddress(ensName: string): Promise<string | null> {
  const address = await alchemy.core.resolveName(ensName);
  return address;
}
