import { generateNonce, SiweMessage } from "siwe";

export async function getNonce() {
  return generateNonce();
}

export async function connect(message: string, signature: string) {
  console.log({ message, signature });
  const siweMessage = new SiweMessage(message);
  console.log({ siweMessage });
  const siweResponse = await siweMessage.verify({
    signature,
  });
  console.log({ siweResponse });
  if (!siweResponse.success) {
    throw new Error("Invalid authentication");
  }
  return siweResponse.data?.address;
}
