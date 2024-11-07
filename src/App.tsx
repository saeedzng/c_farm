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
  function setDeployed(Deployed: string) { localStorage.setItem("deployed", Deployed); }

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
  const [isDataLoaded, setIsDataLoaded] = useState(false);

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

  const { wallet_contract_address, wallet_contract_balance, wallet_owner_address, wallet_referal_address,
    ch_number, first_buy, send_buy_chicken_order, send_sell_chicken_order, send_recive_eggs_order
  } = useWalletContract(Address.parse(getTonAddress()));

  useEffect(() => {
    // Check if wallet_contract_address is available
    if (wallet_contract_address) {
        setIsDataLoaded(true);
    } else {
        setIsDataLoaded(false);
    }
}, [wallet_contract_address]); // Dependency array to run effect on address change

  const realeggnumber: number = wallet_contract_balance ? wallet_contract_balance / 3333333 : 0;
  const showbalance: number = wallet_contract_balance ? wallet_contract_balance / 1000000000 : 0;
  const toggleMenu = () => { setShowMenu(!showMenu); };
  const [showDialog, setShowDialog] = useState(false);
  const [chickenCount, setChickenCount] = useState(1);
  const [actionType, setActionType] = useState<'buy' | 'sell'>('buy'); // State to track action type

  const handleDialogOpen = (type: 'buy' | 'sell') => {
    setActionType(type);
    setShowDialog(true);
  };

  const confirmPurchase = () => {
    if (chickenCount > 0) {
      if (actionType === 'buy') {
        send_buy_chicken_order(chickenCount);
      } else {
        send_sell_chicken_order(chickenCount);
      }
      setShowDialog(false); // Close dialog after purchase
    } else {
      WebApp.showAlert("Please enter a valid number of chickens.");
    }
  };

  const increaseCount = () => {
    setChickenCount(prevCount => prevCount + 1);
  };

  const decreaseCount = () => {
    setChickenCount(prevCount => Math.max(1, prevCount - 1));
  };

  function runreciveeggs() {
    send_recive_eggs_order();
  };
  function warningloweggs() {
    WebApp.showConfirm('Transactions under one egg (0.033 tons) will fail to avoid extra fees. Avoid confirming likely-to-fail transactions. Each transaction incurs a fee of 0.002 tons.', runreciveeggs)
  }
  
  return (
    <div className="wrapper">
      <div className="top-section">
        <div className="header">
          <div className="left">
            <img src="./logo.png" alt="Logo" className="logo" />
          </div>
          <div className="right">
            <TonConnectButton />
          </div>
        </div>
        <nav className="menu">
          <ul>
            <li><button onClick={() => setPageN(2)}>Wallet</button></li>
            {/* <li><button onClick={() => toggleMenu}></button>Details</li> */}
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
              <div>
                <div className="offchain-data">
                  <div><p>Owner Address</p></div>
                  <div>{owner_address}</div>
                  <div><p>Referral address</p></div>
                  <div>{referal_address}</div>
                  <div><p>Wallet Address</p></div>
                  <div></div>
                </div>
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
                  let impoDate: Date = new Date;
                  if (first_buy) { impoDate = new Date(first_buy) }
                  WebApp.showAlert((impoDate + " + " + Date() + " + " + getDeployed() + " + "
                    + isdeployed + "+" + first_buy + "+" + Date()))
                }}>show alert</button>               
                <div className="three-dot-menu" onClick={toggleMenu}>&#x2022;&#x2022;&#x2022;</div>
                {showMenu && (
                  <div className="menu-content">
                    <div><b>Wallet contract Address</b></div>
                    <div className='Hint'>{wallet_contract_address}</div>
                    <div><b>Wallet owner Address</b></div>
                    <div className='Hint'>{wallet_owner_address}</div>
                    <div><b>Wallet referral Address</b></div>
                    <div className='Hint'>{wallet_referal_address}</div>
                  </div>
                )}
              </div>
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
                        <div className="status-indicator">
                {isDataLoaded ? (
                    <div style={{ color: 'green' }}>
                        <span>🟢</span> You are connected
                    </div>
                ) : (
                    <div style={{ color: 'red' }}>
                        <span>🔴</span> You are offline
                    </div>
                )}
            </div>
            <h1>Wallet Contract</h1>
            {connected === true ? (
              <div>
                {isdeployed === true ? (
                  <>
                    <div className="image-row">
                      <div className="image-container">
                        <img src="./hen.png" alt="Chicken" className="wallet-image" />
                        <div className="image-value">Hens : {ch_number}</div>
                      </div>
                      <div className="image-container">
                        <img src="./coin.png" alt="Chicken" className="wallet-image" />
                        <div className="image-value">TON : {showbalance.toFixed(3)}</div>
                      </div>
                      <div className="image-container">
                        <img src="./egg.png" alt="Egg" className="wallet-image" />
                        <div className="image-value">Eggs : {realeggnumber?.toFixed(1)}</div>
                      </div>
                    </div>
                    <div className="button-container">
                      <div className="buy-row">
                        <div className="buy-label">
                          <label>Buy Chicken</label>
                        </div>
                        <div className="button-row">
                          <button className="action-button" onClick={() => handleDialogOpen('buy')}>From Wallet</button>
                          <button className="action-button" onClick={() => handleDialogOpen('sell')}>From Eggs</button>
                        </div>
                      </div>
                      <div className="buy-row">
                        <div className="buy-label">
                          <label>Get Reward</label>
                        </div>
                        <div className="button-row">
                          <button className="action-button" onClick={warningloweggs}>Get Earned Eggs</button>
                          <button className="action-button" onClick={() => {
                            const telegramShareUrl = `https://t.me/Ch_farm_bot/ChickenFarm?startapp=${wallet_contract_address}`;
                            navigator.share({
                              title: 'Chicken Farm Wallet Contract',
                              text: 'Check out this wallet contract address!',
                              url: telegramShareUrl,
                            });
                          }}>Share Referal</button>
                        </div>
                      </div>
                      <div className="">
                      <button className="action-button" onClick={() => handleDialogOpen('buy')}>Withdraw To Wallet</button>
                      </div>
                    </div>
                    {/* Buy/Sell Chicken Dialog */}
                    {showDialog && (
                      <div className="dialog-overlay">
                        <div className="dialog-content">
                          <h2>{actionType === 'buy' ? 'Buy Chickens' : 'Sell Chickens'}</h2>
                          <div className="input-container">
                            <button onClick={decreaseCount}>-</button>
                            <input
                              type="number"
                              value={chickenCount}
                              onChange={(e) => setChickenCount(Number(e.target.value))}
                              min="1"
                              style={{ width: '50%' }} // Set width to half of parent
                            />
                            <button onClick={increaseCount}>+</button>
                          </div>
                          <div className="dialog-buttons">
                            <button onClick={() => setShowDialog(false)}>Cancel</button>
                            <button onClick={confirmPurchase}>Confirm</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (<p>Please create a wallet contract first.</p>)}
              </div>
            ) : (<p>Please Log in To Continue</p>)}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
