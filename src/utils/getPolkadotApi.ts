import { ApiPromise, WsProvider } from "@polkadot/api";
import { default as staking } from "curio-parachain-ts-interfaces/interfaces/staking/definitions";
import { default as support } from "curio-parachain-ts-interfaces/interfaces/support/definitions";
import { default as dex } from "curio-parachain-ts-interfaces/interfaces/dex/definitions";
import { default as primitives } from "curio-parachain-ts-interfaces/interfaces/primitives/definitions";

export const getPolkadotApi = () => {
  const definitions = {
    types: {
      ...staking.types,
      ...support.types,
      ...dex.types,
      ...primitives.types,
    },
    runtime: {
      ...staking.runtime,
    },
  };

  const provider = new WsProvider(process.env.NEXT_CURIO_PROVIDER, 100);

  const api = new ApiPromise({
    provider,
    ...definitions,
  });
  return { api };
};
