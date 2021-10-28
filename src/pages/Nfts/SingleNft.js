import React, { useState, useCallback, useEffect } from 'react'
import { useRouteData } from 'react-static'
import NftCard from '../../components/NftCard'
import { useStore } from '../../store'

import { useWallet, useConnectedWallet } from '@terra-money/wallet-provider';
import {
    StdFee,
    MsgExecuteContract,
    LCDClient,
    WasmAPI,
    BankAPI,
    Denom,
    CreateTxOptions,
    MsgSend
} from '@terra-money/terra.js'


export default () => {

    const {raffle} = useRouteData()

  const { state, dispatch } = useStore()
  const [amount,setAmount] = useState(0)

  const [nftData,setNftData] = useState(0);
  const [imageNftData,setImageNftData] = useState(0);
  const [bidInfo, setBidInfo] = useState([]);

  const terra = state.lcd
  const api = new WasmAPI(terra.apiRequester)

  const testAuctionID = 1;
  const {wallets, post} = useWallet();
  const connectedWallet = useConnectedWallet();

  const getNftData = useCallback(async () => {

    try{
        const nftConfigInfo = await api.contractQuery(
            state.privTokenContract,
            {
                auction:{
                    auction_id:testAuctionID
                }
            }
        )
        
        console.log(nftConfigInfo)
        setNftData(nftConfigInfo)
        const nftInfo = await api.contractQuery(
            nftConfigInfo.nft_contract,
            {
                nft_info:{
                    token_id: nftConfigInfo.nft_id
                }
            }
        )

        console.log(nftInfo);
        setImageNftData(nftInfo)

        const bids = await api.contractQuery(
            state.privTokenContract,
            {
                bids:{
                    auction_id:testAuctionID
                }
            }
        )

        console.log(bids);
        setBidInfo(bids.bids);

    } catch(e){
        console.log(e)
    }
      
  },[])

  async function placeBid(){
      console.log(amount, 'make bid')
      if (!connectedWallet) return

      /*
        Here is an example of use for a simple transaction with connect wallet
       */
      console.log('walletAddress is', connectedWallet.walletAddress)
      // In this case network should be testnet bombay
      console.log('network is', connectedWallet.network)
      console.log('connectType is', connectedWallet.connectType)
      //Check if bid is highesti
        try {
            let msg = new MsgExecuteContract(connectedWallet.walletAddress, state.privTokenContract,{
                place_bid: {auction_id: testAuctionID}
            }, {"uusd": String(amount * 1000000)});

            const result = await connectedWallet.post({
                msgs: [msg]
            })
            console.log(result)
        }catch (e) {
            console.log(e)
        }



  }

  useEffect(() => {      
    getNftData()
}, [getNftData])

    

  return (
            <>
            <section className="single-nft-main">
                <div className="container">
                    <div className="row">
                        <div className="col-md-7">
                            <NftCard key={1} data={raffle} nft={imageNftData} type={'xl'} index={99}/>
                        </div>
                        <div className="col-md-5 d-flex">
                            <div className="align-self-center w-100">
                            <h3 className="title">{imageNftData.name}</h3>
                            <p className="author">Author name</p>
                            <p className="description">{raffle.desc}</p>
                            <h5>Current bids ({nftData.total_bids})</h5>
                            <table className="table">
                                <tbody>
                                    {bidInfo.length > 0 && bidInfo.sort(
                                        (a,b) => {return parseInt(a.amount) - parseInt(b.amount)}
                                    ).map((obj,key) => {                                    
                                        return (
                                            <tr key={key}>
                                            <td>{obj.bidder}</td>
                                            <td>{obj.amount / 1000000} UST</td>
                                        </tr>  
                                        )                                  
                                    })}                               
                                
                                </tbody>
                            </table>
                            <h5>Your bid</h5>
                            <div className="input-group mb-3">
                                    <span className="input-group-text" id="basic-addon1">
                                        <img src="/img/UST.svg" width="30px" className="img-fluid"/>
                                    </span>
                                    <input type="number" className="form-control amount-input-staking" onChange={(e) => setAmount(e.target.value)} value={amount} autoComplete="off" placeholder="0.00" name="amount"/>
                                </div>
                            <button className="btn btn-primary btn-lg w-100" onClick={() => placeBid()} disabled={amount == 0}>Place bid</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="nfts">
    <div className="container">
      <div className="row">
        <div className="col-md-12">
        <div className="heading">
            <h3>Category name</h3>
            <p>Here comes a little description about the category</p>
          </div>
        </div>
          { state.raffles && state.raffles.slice(0,4).map((obj,key) => {
            return (
              <div className="col-md-3">
                <NftCard key={key} type={'small'} data={obj} index={key}/>
              </div>
            )
          })}
      </div>
    </div>
  </section>
            </>
  )
}