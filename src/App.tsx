import "./App.css";
import { TonConnectButton } from "@tonconnect/ui-react";
import { useMasterContract } from "./hooks/useMasterContract";
import { useWalletContract } from "./hooks/useWalletContract";
import { useTonConnect } from "./hooks/useTonConnect";
import { fromNano, address } from "ton-core";
import { useState } from 'react';

<script src="https://telegram.org/js/telegram-web-app.js"></script>

function App() {

  var page_n = 0;

  const { connected } = useTonConnect();

  const { master_contract_address, sendDeployByMaster, master_contract_balance, wc_addressss } = useMasterContract();

  const { ch_number, eggs_number, wallet_contract_balance, wallet_contract_address,
    send_buy_chicken_order, wallet_owner_address, wallet_referal_address, wallet_master_address,
    send_sell_chicken_order, send_recive_eggs_order } = useWalletContract();

  const [referal_address, setReferal_address] = useState('');

  return (
    <div>

      <div>
        <TonConnectButton />
      </div>

      {page_n == 0 && (
        <>
          <h2>welcome to chicken Farm</h2>
          {connected && (
            <><label>your referal address  </label><>
              <input type="text" id="create_contract_b" value={referal_address} onChange={(e) => setReferal_address(e.target.value)} /><br />
              <br />
              <button className='button' onClick={() => {
                sendDeployByMaster(address(referal_address));
              }}> Create Wallet Contract</button><br />
            </>
              <div>
                <label>Deployed contract at: {wc_addressss && <div>{wc_addressss.toString()}</div>}</label>

              </div>
            </>
          )}
          {!connected && (
            <p>please Log in To coninue</p>
          )}
        </>
      )}


      {page_n == 1 && (
        <div>
          <h1>Master Contract</h1>
          <div>
            <TonConnectButton />
          </div>
          <b>Master contract Address</b>
          <div className='Hint'>{master_contract_address}</div>
          <b>Master contract Balance</b>
          {master_contract_balance && <div className='Hint'>{fromNano(master_contract_balance)} ton</div>}
        </div>
      )}


      <div>
        {page_n == 2 &&
          <div>
            <h1>Wallet Contract</h1>
            <div>
              <TonConnectButton />
            </div>
            <div className='Card'>
              <div>
                <b>wallet contract balance  </b>
              </div>
              {wallet_contract_balance && <div className='Hint'>{fromNano(wallet_contract_balance)} ton</div>}
              <div>

              </div>

              <b>wallet contract Address  </b>
              <div className='Hint'>{wallet_contract_address}</div>
              <b>wallet owner Address</b>
              <div className='Hint'>{wallet_owner_address}</div>
              <b>wallet referal Address</b>
              <div className='Hint'>{wallet_referal_address}</div>
              <b>wallet master Address</b>
              <div className='Hint'>{wallet_master_address}</div>
              <div>          <b>wallet eggs number</b></div>

              {eggs_number && <div className='Hint'>{fromNano(eggs_number)} ton</div>}
              <div>
                <b>wallet chicken number</b>
                <div className='Hint'>{ch_number}</div>
              </div>

              {connected && page_n == 2 && (
                <a
                  onClick={() => {
                    send_buy_chicken_order(1);
                  }}
                >
                  buy 1 chicken
                </a>

              )}<br />
              {connected && (
                <a
                  onClick={() => {
                    send_sell_chicken_order(1);
                  }}
                >
                  sell 1 chicken
                </a>
              )}<br />
              {connected && (
                <a
                  onClick={() => {
                    send_recive_eggs_order();
                  }}
                >
                  get earned eggs
                </a>
              )}
            </div>
          </div>
        }
      </div>
    </div>
  );
}

export default App;