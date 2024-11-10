import "./App.css";
import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react";
import { useMasterContract } from "./hooks/useMasterContract";
import { useWalletContract } from "./hooks/useWalletContract";
import { useTonConnect } from "./hooks/useTonConnect";
import { fromNano, address, Address } from "ton-core";
import { useState, useEffect } from 'react';
import WebApp from "@twa-dev/sdk";

declare global { interface Window { Telegram: any; } }

function App() {
  function setTonAddress(tonAddress: string) { localStorage.setItem("tonAddress", tonAddress); }
  function setDeployed(Deployed: string) { localStorage.setItem("deployed", Deployed); }
  function setWalletisloaded(walletisloaded: string) { localStorage.setItem("walletisloaded", walletisloaded); }
  function getTonAddress() { const tonAddress = localStorage.getItem("tonAddress"); return tonAddress ? tonAddress : "EQA1Qws02ObwfjGcUltv4ucZaxcmWcIjS4SAtMj8ynMDwy-j"; }
  function getDeployed() { const Deployed = localStorage.getItem("deployed"); return Deployed ? Deployed : "false"; }
  function getwalletisloaded() { const walletisloaded = localStorage.getItem("walletisloaded"); return walletisloaded ? walletisloaded : "false"; }
  const [page_n, setPageN] = useState(0);
  const { connected } = useTonConnect();
  const owner_address = useTonAddress();
  const [isdeployed, setIsdeployed] = useState<boolean>(false);
  const [referal_address, setReferal_address] = useState("EQDkzMK31Gn9nad9m1jnhEXXl8nKHJCf4006iyP6lSNyGs2C");
  const [showHelp, setShowHelp] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
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

  const { wallet_contract_address, wallet_contract_balance, wallet_owner_address, wallet_referal_address, withdraw_to_owner,
    ch_number, first_buy, send_buy_chicken_order, send_buy_chicken_by_eggs, send_recive_eggs_order
  } = useWalletContract(Address.parse(getTonAddress()));

  useEffect(() => {
    // Check if wallet_contract_address is available
    if (wallet_contract_balance) {
      setIsDataLoaded(true);
      setWalletisloaded('true')
    } else {
      setIsDataLoaded(false);
    }
  }, [wallet_contract_balance]); // Dependency array to run effect on address change

  const realeggnumber: number = wallet_contract_balance ? wallet_contract_balance / 3333333 : 0;
  const showbalance: number = wallet_contract_balance ? wallet_contract_balance / 1000000000 : 0;
  const showchickennumber: number = ch_number ? ch_number : 0;
  const toggleHelp = () => { setShowHelp(!showHelp); setShowDetails(false); };
  const toggleDetails = () => { setShowDetails(!showDetails); setShowHelp(false); };
  const [showDialog, setShowDialog] = useState(false);
  const [chickenCount, setChickenCount] = useState(1);
  const [actionType, setActionType] = useState<'ton' | 'egg'>('ton'); // State to track action type

  const handleDialogOpen = (type: 'ton' | 'egg') => {
    if (!isDataLoaded) { WebApp.showAlert("You Are Offline"); return; }
    setActionType(type);
    setShowDialog(true);
  };

  const confirmPurchase = () => {
    if (chickenCount > 0) {
      if (actionType === 'ton') {
        send_buy_chicken_order(chickenCount);
      } else {
        send_buy_chicken_by_eggs(chickenCount);
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
    if (!isDataLoaded) { WebApp.showAlert("You Are Offline"); return; }
    WebApp.showConfirm('Transactions under one egg (0.033 tons) will fail to avoid extra fees. Avoid confirming likely-to-fail transactions. Each transaction incurs a fee about 0.002 tons.',
      function (result) {
        if (result) {
          runreciveeggs();
        }
      })
  }
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const handleWithdrawClick = () => {
    if (!isDataLoaded) { WebApp.showAlert("You Are Offline"); return; }
    setIsDialogVisible(true);
    setWithdrawAmount(''); // Reset amount when opening dialog
  };

  const handleWithdraw = () => {
    // Ensure amountToWithdraw is defined and a valid number
    const amountToWithdraw = withdrawAmount === 'all'
      ? (wallet_contract_balance ? (wallet_contract_balance) : (0))
      : (withdrawAmount ? (Number(withdrawAmount) * 1000000000) : (0));

    if (amountToWithdraw > (0) && amountToWithdraw <= (wallet_contract_balance ? (wallet_contract_balance) : (0))) {
      withdraw_to_owner(amountToWithdraw - 100); // Call the withdrawal function with BigInt
      setIsDialogVisible(false); // Close dialog after withdrawal
    } else {
      alert("Please enter a valid amount."); // Error handling
    }
  };


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
            <li><button onClick={() => setPageN(1)}>Master Contract</button></li>
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
              <div style={{ marginTop: '20px' }}>
                {/* <button className='action-button' onClick={async () => {
                  await sendDeployByMaster(address(referal_address));
                  setIsdeployed(true); // Set deployed state only after successful approval
                }}>Deploy Wallet Contract</button><br />     */}
                <div className="button-row">
                  <button className="action-button" onClick={toggleHelp}> Help </button>
                  {(!isdeployed || !getwalletisloaded()) && (
                    <button className='action-button' onClick={async () => {
                      await sendDeployByMaster(address(referal_address));
                      setIsdeployed(true); // Set deployed state only after successful approvale
                    }}>
                      Create Contract
                    </button>
                  )}
                  {(isdeployed && getwalletisloaded()) && (
                    <button className="action-button" onClick={toggleDetails}> Details </button>
                  )}
                </div>
                {showDetails && (
                  <div className="detail-content">
                    <div><p>Owner Address</p></div>
                    <div>{owner_address}</div>
                    <div><p>Referral address</p></div>
                    <div>{referal_address}</div>
                    <div><p>Wallet Address</p></div>
                    <div>{wallet_contract_address}</div>
                    <div><p>Wallet owner Address</p></div>
                    <div>{wallet_owner_address}</div>
                    <div><p>Wallet referral Address</p></div>
                    <div >{wallet_referal_address}</div>
                    <div><p>Deploy Address</p></div>
                    <div>{wc_addressss?.toString()}</div>
                  </div>
                )}
                {/* <div className="three-dot-menu" onClick={toggleMenu}>&#x2022;&#x2022;&#x2022;</div> */}
                {showHelp && (
                  <div className="help-content">
                    <p>1. First, log in with a wallet for authentication.</p>
                    <p>2. Each transaction on the TON platform incurs a fee of about 0.01 TON.</p>
                    <p>3. Reload the app 30 seconds after each transaction to see updates.</p>
                    <p>4. Deploy a smart contract to start using the app.</p>
                    <p>5. The wallet that pays for the contract deployment becomes the contract owner.</p>
                    <p>6. You can buy hens with TON from your wallet, earning one egg per day per hen.</p>
                    <p>7. Each hen costs 1 TON.</p>
                    <p>8. You can also purchase hens with your eggs.</p>
                    <p>9. To collect your earned eggs, you must have at least one egg and pay the gas fee.</p>
                    <p>10. Transactions requesting less than one egg will fail.</p>
                    <p>11. Each egg is worth 0.0333 TON.</p>
                    <p>12. You can withdraw your eggs to your wallet when your balance exceeds the transaction fee.</p>
                    <p>13. If your page is offline, reload the app to reconnect.</p>

                    <h3>Referral</h3>
                    <p>14. When you share the app using the referral button, your address is set as the referral address in the shared link.</p>
                    <p>15. Anyone who joins the app through your link becomes part of your referral team.</p>
                    <p>16. When a level one referral team member buys hens, you get 25% of their purchase.</p>
                    <p>17. When a level two referral team member buys hens, you get 10% of their purchase.</p>
                    <p>18. When a level three referral team member buys hens, you get 5% of their purchase.</p>

                    <h3>Errors</h3>
                    <p>Error 101: You are not the owner of the contract.</p>
                    <p>Error 102: Your balance is not enough.</p>
                    <p>Error 103: You have less than one egg.</p>


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
            <button className="action-button" onClick={() => localStorage.clear()}>delete local storage</button><br />
            <button className='action-button' onClick={() => {
              setIsdeployed(true);
              setPageN(2);
            }}>set and Open Wallet Contract</button><b></b>
            <button className='action-button' onClick={() => {
              let impoDate: Date = new Date;
              if (first_buy) { impoDate = new Date(first_buy) }
              WebApp.showAlert((impoDate + " + " + Date() + " + " + getDeployed() + " + "
                + isdeployed + "+" + first_buy + "+" + Date()))
            }}>show alert</button><br />
          </div>
        )}
        {page_n === 2 && (
          <div>
            <div className="status-indicator">
              {isDataLoaded ? (
                <div style={{ color: 'green', margin: '5px' }}>
                  <span>🟢</span>  connected
                </div>
              ) : (
                <div style={{ color: 'red', margin: '5px' }}>
                  <span>🔴</span>  offline
                </div>
              )}
            </div>
            <h1>Wallet Contract</h1>
            {connected === true ? (
              <div>
                {isdeployed === true ? (
                  <>
                    {isDataLoaded === true ? (
                      <>
                        <div className="image-row">
                          <div className="image-container">
                            <img src="./hen.png" alt="Chicken" className="wallet-image" />
                            <div className="image-value">Hens : {showchickennumber}</div>
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
                              <button className="action-button" onClick={() => handleDialogOpen('ton')}>From Wallet</button>
                              <button className="action-button" onClick={() => handleDialogOpen('egg')}>From Eggs</button>
                            </div>
                          </div>
                          <div className="buy-row">
                            <div className="buy-label">
                              <label>Get Reward</label>
                            </div>
                            <div className="button-row">
                              <button className="action-button" onClick={warningloweggs}>Get Earned Eggs</button>
                              <button className="action-button" onClick={() => {
                                if (!isDataLoaded) { WebApp.showAlert("You Are Offline"); return; }
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
                            <button className="action-button" style={{ marginBottom: "25px" }} onClick={handleWithdrawClick}>Withdraw To Wallet</button>
                          </div>
                          {/* Withdrawal Dialog */}
                          {isDialogVisible && (
                            <div className="dialog-overlay">
                              <div className="dialog-content">
                                <h2>Withdraw Funds</h2>
                                <div>
                                  <label>
                                    Amount to Withdraw:
                                    <input
                                      type="text"
                                      value={withdrawAmount}
                                      onChange={(e) => setWithdrawAmount(e.target.value)}
                                      placeholder="Enter amount or type 'all'"
                                    />
                                  </label>
                                </div>
                                <div className="dialog-buttons">
                                  <button onClick={() => setIsDialogVisible(false)}>Cancel</button>
                                  <button onClick={handleWithdraw}>Withdraw</button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        {/* Buy/Sell Chicken Dialog */}
                        {showDialog && (
                          <div className="dialog-overlay">
                            <div className="dialog-content">
                              <h2>Buy Chicken</h2>
                              <p>each chicken is {actionType === 'ton' ? 'one TON' : 'thirty eggs'}</p>
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
                    )
                      : (<p>Please Reload The Page.</p>)
                    }
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
