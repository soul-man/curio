import { Keyring } from "@polkadot/api";

export const get777FormatAddress = (account: string) => {
  const keyring = new Keyring();
  const address = keyring.addFromAddress(account);
  keyring.setSS58Format(777);
  return address.address;
};