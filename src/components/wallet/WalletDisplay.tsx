import React from 'react';

interface WalletDisplayProps {
  accounts: any[];
  onDisconnect: () => void;
}

const WalletDisplay: React.FC<WalletDisplayProps> = ({ accounts, onDisconnect }) => {
  return (
    <div>
      <h2>Connected Accounts</h2>
      <ul>
        {accounts.map((account, index) => (
          <li key={index}>{account.address}</li>
        ))}
      </ul>
      <button onClick={onDisconnect}>Disconnect</button>
    </div>
  );
};

export default WalletDisplay;