import React, { useState } from "react";
import Web3 from "web3";
import { Magic } from "magic-sdk";
import { ConnectExtension } from "@magic-ext/connect";

function App() {
  const [account, setAccount] = useState<string>("");
  const [walletType, setWalletType] = useState<string>("");
  const [balance, setBalance] = useState<string>("");

  const customNodeOptions = {
    rpcUrl: "https://polygon-rpc.com", // your ethereum, polygon, or optimism mainnet/testnet rpc URL
    chainId: 137,
  };

  const magic = new Magic("pk_live_F81C446196F22B2A", {
    extensions: [new ConnectExtension()],
    // network: customNodeOptions
  }) as any;

  const web3 = new Web3(magic.rpcProvider);

  const disconnectWallet = async () => {
    await magic.connect.disconnect((e: any) => console.log(e));
    setAccount("");
    console.log("disconnected");
  };

  const connectWallet = async () => {
    try {
      const account = await web3.eth.getAccounts();
      setAccount(account[0]);
      const walletInfo = await magic.connect.getWalletInfo();
      setWalletType(walletInfo.walletType);
      const balance = await web3.eth.getBalance(account[0]);
      setBalance(balance);
    } catch (error) {
      console.log(error);
    }
  };

  const getUserInfo = async () => {
    try {
      const email = await magic.connect.requestUserInfo();
      console.log(email);
    } catch (error) {
      console.log(error);
    }
  };

  const showUserWallet = () => {
    if (walletType === "magic") {
      magic.connect.showWallet().catch((e: any) => {
        console.log(e);
      });
    } else return;
  };

  return (
    <div className="container mx-auto my-10">
      <div className="flex justify-center">
        {account ? (
          <div>
            <div className="mb-4">
              <p>Wallet: {walletType}</p>
              <p>Address: {account}</p>
              <p>Balance: {balance}</p>
            </div>
            <div className="flex justify-center gap-4">
              {walletType === "magic" && (
                <button
                  className="px-6 py-2 rounded-full bg-[#6851FF] text-white "
                  onClick={showUserWallet}
                >
                  Show Wallet
                </button>
              )}
              <button
                className="px-6 py-2 rounded-full bg-[#6851FF] text-white"
                onClick={disconnectWallet}
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <button
            className="px-6 py-2 rounded-full bg-[#6851FF] text-white"
            onClick={connectWallet}
          >
            Let's start
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
