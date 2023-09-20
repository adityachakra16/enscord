import { Alchemy, Network } from "alchemy-sdk";

const alchemy = new Alchemy({
  network: Network.ETH_MAINNET,
  apiKey: process.env.ALCHEMY_API_KEY_MAINNET,
});

export async function resolveEnsName(ensName: string): Promise<string | null> {
  const address = await alchemy.core.resolveName(ensName);
  return address;
}

export async function isEnsOwner(
  ethAddresses: string[],
  ensName: string
): Promise<boolean> {
  const owner = await resolveEnsName(ensName);
  if (owner) {
    return ethAddresses.includes(owner);
  }
  return false;
}
