import { TonClient } from 'ton';
import { Address } from 'ton-core';

// Parse the token contract address
const tokenAddress = Address.parse('EQC16UcPDOF1YBcDfI3-SNA8nr8ECliCRN3O5d_-SSBcUSjf');

// Create a TonClient instance (you'll need to configure this with your endpoint)
const client = new TonClient({
    endpoint: 'https://toncenter.com/api/v2/jsonRPC', // Replace with your actual endpoint
});

export default async function getSupplyOnTon() {
    try {
        const { stack } = await client.runMethod(tokenAddress, 'get_jetton_data');
        const totalSupply = stack.readBigNumber();
        return Number(totalSupply) / 10 ** 18;
    } catch (error) {
        console.error('Error fetching token data:', error);
        throw error;
    }
};