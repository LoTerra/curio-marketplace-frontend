import React, { useState, useCallback, useEffect } from 'react'
import NftCard from '../../components/NftCard'
import { useStore } from '../../store'
import toast, { Toaster } from 'react-hot-toast';

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
import Countdown from '../../components/SingleNft/Countdown';


export default (props) => {
  const { state, dispatch } = useStore()
  const [amount,setAmount] = useState(0)
  const [expiryTimestamp, setExpiryTimestamp] =  useState(1)
  const [nftData,setNftData] = useState(0)
  const [imageNftData,setImageNftData] = useState(0)
  const [bidInfo, setBidInfo] = useState([])

  const [loading,setLoading] = useState(true)

  const testAuctionID = parseInt(props.nftId)

  console.log(testAuctionID)
  let network = {}
  let connectedWallet = {}


if (typeof document !== 'undefined') {
  network = useWallet().network;
  connectedWallet = useConnectedWallet()
}


  const lcd = new LCDClient({
      URL: network.lcd,
      chainID: network.chainID,
  });

 

  const api = new WasmAPI(lcd.apiRequester)

    const reloadBids = useCallback(async () => {

        try {
            const bids = await api.contractQuery(
                state.privTokenContract,
                {
                    bids:{
                        auction_id:testAuctionID
                    }
                }
            )
            sortBids(bids.bids)    
            console.log(bids)
          } catch(e){
            console.log(e)
          }
    
  })

  function sortBids(bids){
    let clean = []
    bids.map(obj => {
        let found = clean.find(({bidder}) => bidder === obj.bidder);
        console.log(found)
        if(found){          
            found.amount = parseInt(found.amount) + parseInt(obj.amount)
        }else {
            clean.push({bidder:obj.bidder,amount:obj.amount})
        }
    });

    clean.sort((a,b) => {return parseInt(b.amount) - parseInt(a.amount)})


    setBidInfo(clean)
    console.log('cleaned',clean)
  }

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
        

        setExpiryTimestamp(
            parseInt(nftConfigInfo.end_time * 1000)
        )

        console.log('timestamp',expiryTimestamp)

        const nftInfo = await api.contractQuery(
            nftConfigInfo.nft_contract,
            {
                nft_info:{
                    token_id: nftConfigInfo.nft_id
                }
            }
        )

        console.log(nftInfo)
        setImageNftData(nftInfo)

        if(nftConfigInfo.total_bids > 0){
            const bids = await api.contractQuery(
                state.privTokenContract,
                {
                    bids:{
                        auction_id:testAuctionID
                    }
                }
            )
    
            console.log(bids)
            sortBids(bids.bids)  
        }
        setTimeout(() => {
            setLoading(false)
            setAmount(amount !== 0 ? amount : bidInfo && bidInfo[0] ? bidInfo[0].amount / 1000000 * 1.05 : nftData && nftData.start_price ? nftData.start_price / 1000000 * 1.05 : 0)
        },1000)

    } catch(e){
        console.log(e)
        
    }
      
  },[])

  function buyNow(){

  }

  async function placeBid(){
      console.log(amount, 'make bid')
      if (!connectedWallet) return

      /*
        Here is an example of use for a simple transaction with connect wallet
       */
      if(connectedWallet){
            console.log('walletAddress is', connectedWallet.walletAddress)
            // In this case network should be testnet bombay
            console.log('network is', connectedWallet.network)
            console.log('connectType is', connectedWallet.connectType)
      }
      
      //Check if bid is highesti
        try {
            let msg = new MsgExecuteContract(connectedWallet.walletAddress, state.privTokenContract,{
                place_bid: {auction_id: testAuctionID}
            }, {uusd: String(amount * 1000000)})

            const result = await connectedWallet.post({
                msgs: [msg]
            })
            console.log(result)            
            toast.success('Bid succesful')
            setTimeout(() => reloadBids(),3000)
        }catch (e) {
            console.log(e)       
            toast.error('Bid error')
        }



  }

  function nftValid(timestamp){
    let end = new Date(parseInt(timestamp) * 1000)
    let now = new Date()

    if(end.getTime() < now.getTime()){
        return false
    } else {
        return true
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
                            <NftCard key={1} data={state.raffles[0]} nft={imageNftData} type={'xl'} index={99}/>
                        </div>
                        <div className="col-md-5 d-flex">
                            <div className="align-self-center w-100">
                            <h3 className="title">{imageNftData.name}</h3>
                            <p className="author">Author name</p>                        
                            <p className="description">{imageNftData.description}</p>
                            <div className="row">
                            <div className="col-6">
                                    <div className="nft-stats">
                                        <h6>Starting price</h6>
                                        <p className="start-price">{nftData.start_price / 1000000} <span>UST</span></p>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="nft-stats">
                                        <h6>Instant buy</h6>
                                        <p className="start-price">{nftData.instant_buy / 1000000} <span>UST</span></p>
                                    </div>
                                </div>                                
                            </div>                          
                            {/* <Countdown expiryTimestamp={expiryTimestamp}/> */}
                            <p className="description">{state.raffles[0].desc}</p>
                            <h5>Current bids ({nftData.total_bids})</h5>
                            <div style={{maxHeight:'120px',overflowY:'scroll'}}>
                            <table className="table">
                                <tbody>
                                    {bidInfo.length > 0 ? bidInfo.sort(
                                        (a,b) => {return parseInt(b.amount) - parseInt(a.amount)}
                                    ).map((obj,key) => {                                    
                                        return (
                                            <tr key={key}>
                                            <td style={{fontSize:'10px'}}>{obj.bidder}</td>
                                            <td className="text-end"><strong>{obj.amount / 1000000} UST</strong></td>
                                        </tr>  
                                        )                                  
                                    }) 
                                    :
                                    <p className="text-muted text-center w-100 py-1 m-0">No bids yet</p>
                                    }                               
                                
                                </tbody>
                            </table>
                            </div>
                            <h5>Your bid</h5>
                            <div className="input-group mb-3">
                                    <span className="input-group-text" id="basic-addon1">
                                        <img src="/img/UST.svg" width="30px" className="img-fluid"/>
                                    </span>
                                    <input 
                                    type="number"
                                    className="form-control amount-input-staking"
                                    required={true}
                                    disabled={nftData && nftValid(nftData.end_time) ? false : true}
                                    onChange={(e) => setAmount(e.target.value)}
                                    value={amount}
                                    autoComplete="off"
                                    min={bidInfo && bidInfo[0] ? bidInfo[0].amount / 1000000 * 1.05 : nftData && nftData.start_price ? nftData.start_price / 1000000 * 1.05 : 0}
                                    step="1"
                                    placeholder="0"
                                    name="amount"
                                    />
                                </div>
                                <small className="d-block py-2 text-muted">In order to bid you need to bid <strong>5% above</strong> current bid or min start price</small>
                                <div className="row">
                                    <div className="col-6">
                                    <button 
                                className="btn btn-default btn-lg w-100"
                                disabled={nftData && nftValid(nftData.end_time) ? false : true}
                                onClick={() => placeBid()}>{nftData && nftValid(nftData.end_time) ? 'Place bid' : 'Auction expired'}
                                </button>
                                    </div>
                                    <div className="col-6">
                                    <button 
                                className="btn btn-primary btn-lg w-100"
                                disabled={nftData && nftValid(nftData.end_time) ? false : true}
                                onClick={() => buyNow()}>{nftData && nftValid(nftData.end_time) ? 'Buy now' : 'Auction expired'}
                                </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={'nft-loader h-100 text-center d-flex ' + (loading ? 'show' : '')}>
                    <div className="align-self-center w-100">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
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
  <Toaster />
            </>
  )
}