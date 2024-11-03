import "./App.css";
import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react";
import { useMasterContract } from "./hooks/useMasterContract";
import { useWalletContract } from "./hooks/useWalletContract";
import { useTonConnect } from "./hooks/useTonConnect";
import { fromNano, address, Address } from "ton-core";
import { useState, useEffect } from 'react';
import WebApp from "@twa-dev/sdk";

declare global {
  interface Window {
    Telegram: any;
  }
}

function App() {
  function setTonAddress(tonAddress: string) { localStorage.setItem("tonAddress", tonAddress); }
  function setDeployed(Deployed: string) { localStorage.setItem( "deployed", Deployed); }
  function getTonAddress() {
    const tonAddress = localStorage.getItem("tonAddress");
    return tonAddress ? tonAddress : "0QDAz5XMJoGW3TJE8a6QwreoTTGjPcPGvAOWm_yD1_k-SyUO";
  }
  function getDeployed() {
    const Deployed = localStorage.getItem("deployed");
    return Deployed ? Deployed : "false";
  }
  const [page_n, setPageN] = useState(0);
  const { connected } = useTonConnect();
  const owner_address = useTonAddress();
  const [isdeployed, setIsdeployed] = useState<boolean>(false);
  const [referal_address, setReferal_address] = useState("EQDkzMK31Gn9nad9m1jnhEXXl8nKHJCf4006iyP6lSNyGs2C");
  const [showMenu, setShowMenu] = useState(false);
  
  useEffect(() => {
    const walletAddressFromUrl = window.Telegram.WebApp.initDataUnsafe.start_param;
    if (walletAddressFromUrl) {
      setReferal_address(walletAddressFromUrl);
    }
    const deployedValue = getDeployed() === "true";
    setIsdeployed(deployedValue);
  }, []);

  const { master_contract_address, sendDeployByMaster, master_contract_balance, wc_addressss } = useMasterContract(
    Address.parse("0QDbP6nFnSSS1dk9EHL5G_bYG0cIqPBwv1eje7uOGiVZcno8"),
    Address.parse(referal_address)
  );

  useEffect(() => {
    if (wc_addressss && isdeployed == true && getDeployed() == "false") {
      setTonAddress(wc_addressss.toString());
      setDeployed("true");
    }
  }, [isdeployed]);

  // const [check , setcheck] = useState <number>(0);

  const { wallet_contract_address, wallet_contract_balance, wallet_master_address, wallet_owner_address, wallet_referal_address,
    ch_number, eggs_number, send_recive_eggs_order, send_buy_chicken_order, send_sell_chicken_order,
  } = useWalletContract(Address.parse(getTonAddress()));

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };
  
  return (
    <div className="wrapper">
    
    <div className="top-section"> 
      <div className="header">
        <div className="left">
          <TonConnectButton />
        </div>
        <div className="right">
          <img src="./logo.png" alt="Logo" className="logo" />
        </div>
      </div>
      <nav className="menu">
        <ul>
          <li><button onClick={() => setPageN(2)}>Wallet</button></li>
          {/* <li><button onClick={() => setPageN(1)}>Master Contract</button></li> */}
          <li><button onClick={() => setPageN(0)}>Home</button></li>
        </ul>
      </nav>
      </div >
      <div className="down-section" >
      {page_n === 0 && (
        <>
          <h1>Welcome to Chicken Farm</h1>
          {!connected && <p>Please Log in To Continue</p>}
          {connected && (
            <>
              <label>Referral address: {referal_address}</label><br /><br />
              <button className='button' onClick={async () => {
                  await sendDeployByMaster(address(referal_address));
                  setIsdeployed(true); // Set deployed state only after successful approval
              }}>Create Wallet Contract</button><br />
              <div>
                <label>Deployed contract at: <a>{wc_addressss && <div>{wc_addressss.toString()}</div>}</a></label>
              </div>
              <button onClick={() => {
                setIsdeployed(true);
                setPageN(2);
              }}>set and Open Wallet Contract</button><b></b>
              <button onClick={() => {
                WebApp.showAlert((wc_addressss + " + " + getTonAddress() + " + " + getDeployed() + " + " + isdeployed ))
              }}>show alert</button>
              <p>owner : {owner_address}</p>
            </>
          )}
        </>
      )}
      {page_n === 1 && (
        <div>
          <h1>Master Contract</h1>
          <b>Master contract Address</b>
          <div className='Hint'>{master_contract_address}</div>
          <b>Master contract Balance</b>
          {master_contract_balance && <div className='Hint'>{fromNano(master_contract_balance)} ton</div>}
        </div>
      )}
      {page_n === 2 && (
        <div>
          {isdeployed === true ? (
            <>
              <h1>Wallet Contract</h1>
           {/* Image Row Section */}
           <div className="image-row">           
            <div className="image-container">
              <img src="./hen.png" alt="Chicken" className="wallet-image" />
              <div className="image-value">{ch_number} Chickens</div>
            </div>
            <div className="image-container">
              <img src="./hen.png" alt="Chicken" className="wallet-image" />
              <div className="image-value">{ch_number} Chickens</div>
            </div>          
            <div className="image-container">
              <img src="./egg.png" alt="Egg" className="wallet-image" />
              <div className="image-value">{eggs_number} Eggs</div>
            </div>
          </div>
          <div className="image-row"> 
          <div className="image-container">
          <div className="wallet-image">
          <button  onClick={() => { send_buy_chicken_order(1); }}>Buy Chicken</button>
          </div>
          </div>
          <div className="image-container">
          <div className="wallet-image">
          <button  onClick={() => { send_sell_chicken_order(1); }}>Sell Chicken</button>
          </div>
          </div>
          <div className="image-container">
          <div className="wallet-image">
          <button  onClick={() => { send_recive_eggs_order(); }}>Get Earned Eggs</button>
          </div>
          </div>
          </div>
              <div className='Card'>
                <div><b>Wallet contract balance</b></div>
                {wallet_contract_balance && <div className='Hint'>{fromNano(wallet_contract_balance)} ton</div>}

                <div><b>Wallet eggs number</b></div>
                {eggs_number && <div className='Hint'>{fromNano(eggs_number)} ton</div>}
                <div><b>Wallet chicken number</b></div>
                <div className='Hint'>{ch_number}</div>
                {connected && (
  <>
    <button  onClick={() => { send_buy_chicken_order(1); }}>Buy 1 Chicken</button><br />
    <button  onClick={() => { send_sell_chicken_order(1); }}>Sell 1 Chicken</button><br />
    <button  onClick={() => { send_recive_eggs_order(); }}>Get Earned Eggs</button>
  </>
)}
              </div>
              <button onClick={() => {
                const telegramShareUrl = `https://t.me/Ch_farm_bot/ChickenFarm?startapp=${wallet_contract_address}`;
                navigator.share({
                  title: 'Chicken Farm Wallet Contract',
                  text: 'Check out this wallet contract address!',
                  url: telegramShareUrl,
                });
              }}>Share Wallet Address</button>
                              {/* Three-dot menu */}
                              <div className="three-dot-menu" onClick={toggleMenu}>
                  &#x2022;&#x2022;&#x2022; {/* Three dots */}
                </div>
                {showMenu && (
                  <div className="menu-content">
                    <div><b>Wallet contract Address</b></div>
                    <div className='Hint'>{wallet_contract_address}</div>
                    <div><b>Wallet owner Address</b></div>
                    <div className='Hint'>{wallet_owner_address}</div>
                    <div><b>Wallet referral Address</b></div>
                    <div className='Hint'>{wallet_referal_address}</div>
                    <div><b>Wallet master Address</b></div>
                    <div className='Hint'>{wallet_master_address}</div>
                  </div>
                )}
            </>
          ) : (
            <h2>Wallet Contract is not yet deployed. Please create a wallet contract first.</h2>
          )}
        </div>
      )}
    </div>
    </div>
  );
}

export default App;
