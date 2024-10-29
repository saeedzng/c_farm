import { useEffect, useState } from "react";
import { WalletContract } from "../contracts/WalletContract";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { Address, OpenedContract } from 'ton-core';
import { toNano } from "ton-core";
import { useTonConnect } from "./useTonConnect";
import { useMasterContract } from "./useMasterContract";


export function useWalletContract(refAddress: Address) {
  const { wc_addressss } = useMasterContract(Address.parse("0QDbP6nFnSSS1dk9EHL5G_bYG0cIqPBwv1eje7uOGiVZcno8"),refAddress);


  const incrementA = () => {
      const intervalId = setInterval(() => {
          

  
          if (wc_addressss != undefined) {
              clearInterval(intervalId); // Stop the interval when a is greater than zero
              
          }
      }, 1000); // Run every 1000 milliseconds (1 second)
  };
  
  // Start the incrementing process
  incrementA();

  



  const client = useTonClient();
  const { sender } = useTonConnect();
  // const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));
  const [contractData, setContractData] = useState<null | {
    ch_number: number;
    owner_address: Address;
    master_address: Address;
    referal_address: Address;
    eggs_number: number;
    last_calc: number;
    first_buy: number;
  }>();
  const [balance, setBalance] = useState<null | number>(0);

  
    const walletContract = useAsyncInitialize(async () => {
      if (!client || !wc_addressss ) return;
      const contract = new WalletContract(wc_addressss);
      return client.open(contract) as OpenedContract<WalletContract>;
    }, [client]);
  


  useEffect(() => {
    async function getValue() {
      if (!walletContract) return;
      setContractData(null);
      const val = await walletContract.getData();
      const balance = await walletContract.getBalance();
      setContractData({
        ch_number: val.chicken_number,
        owner_address: val.owner_address,
        master_address: val.master_address,
        referal_address: val.master_address,
        eggs_number: val.eggs_number,
        last_calc: val.last_calc,
        first_buy: val.first_buy,
      });
      setBalance(balance.number);
      // await sleep(150000); // sleep 15 seconds and poll value again
      // getValue();
    }
    getValue();
  }, [walletContract]);


  return {
    refAddress:refAddress,
    wallet_contract_address: walletContract?.address.toString({bounceable: false, testOnly: true}),
    wallet_contract_balance: balance,
    wallet_owner_address: contractData?.owner_address?.toString({bounceable: false, testOnly: true}),
    wallet_referal_address: contractData?.referal_address?.toString({bounceable: false, testOnly: true}),
    wallet_master_address: contractData?.master_address?.toString({bounceable: false, testOnly: true}),
    ...contractData,
    send_buy_chicken_order: (chicken_to_buy: number) => {
      return walletContract?.send_buy_chicken_order(sender, toNano(0.1), chicken_to_buy);
    },
    send_sell_chicken_order: (chicken_to_sell: number) => {
      return walletContract?.send_sell_chicken_order(sender, toNano(0.01), chicken_to_sell);
    },
    send_recive_eggs_order: () => {
      return walletContract?.send_recive_eggs_order(sender, toNano(0.01));
    }
  };

}
