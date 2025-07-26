export interface ChainInfo {
  chain: string;
  version: string;
  properties: any;
}

export interface StakingInfo {
  delegators: string;
  collators: string;
}

export interface AccountBalance {
  free: string;
  reserved: string;
  frozen: string;
}

class PolkadotService {
  private async callApi(action: string, params?: any) {
    const response = await fetch('/api/polkadot-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, params }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API call failed');
    }

    return response.json();
  }

  async getChainInfo(): Promise<ChainInfo> {
    return this.callApi('getChainInfo');
  }

  async getBalance(address: string): Promise<AccountBalance> {
    return this.callApi('getBalance', { address });
  }

  async queryStaking(): Promise<StakingInfo> {
    return this.callApi('queryStaking');
  }
}

export const polkadotService = new PolkadotService();