export function ensNames(ethAddress: string): string[] {
  return [];
}

export function isEnsOwner(ethAddresses: string[], ensName: string): boolean {
  for (const ethAddress of ethAddresses) {
    if (ensNames(ethAddress).includes(ensName)) return true;
  }

  return false;
}
