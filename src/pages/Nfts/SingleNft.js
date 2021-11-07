import React, { useState, useCallback, useEffect } from 'react'
import NftCard from '../../components/NftCard'
import { useStore } from '../../store'
import toast, { Toaster } from 'react-hot-toast';
import { Check, Warning } from "phosphor-react"; 
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
import Card from '../../components/SingleNft/Card';

export default (props) => {
  const { state, dispatch } = useStore()
  const [amount,setAmount] = useState(0)
  const [expiryTimestamp, setExpiryTimestamp] =  useState(1)
  const [nftData,setNftData] = useState(0)
  const [imageNftData,setImageNftData] = useState(0)
  const [bidInfo, setBidInfo] = useState([])
    const [bidder, setBidder] = useState( {
        bid_counter: 0,
        bids: [],
        privilege_used: null,
        total_bid: 0
    })

  const [loading,setLoading] = useState(true)
    console.log(props)
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
                    history_bids:{
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
    clean = bids;

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
                    history_bids:{
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

  async function buyNow(){
      try {
          if (!connectedWallet) return
          let final_price = parseInt(bidder.total_bid) > 0 ? parseInt(nftData.instant_buy) - parseInt(bidder.total_bid) : parseInt(nftData.instant_buy)

          let msg = new MsgExecuteContract(connectedWallet.walletAddress, state.privTokenContract,{
              instant_buy: {}
          }, {"uusd": String(final_price)})

          const result = await connectedWallet.post({
              msgs: [msg]
          })
      }catch (e) {
          console.log(e)
      }

  }

  async function placeBid(){
      if (!connectedWallet) return
      // Set a min bid
      let min_bid = nftData.highest_bid ? ((parseInt(nftData.highest_bid) + (parseInt(nftData.highest_bid) * 5 / 100)) - parseInt(bidder.total_bid)) : 0;
      if (amount * 1000000 < min_bid) return

      /*
        Here is an example of use for a simple transaction with connect wallet
       */
      if(connectedWallet){
            console.log('walletAddress is', connectedWallet.walletAddress)
            // In this case network should be testnet bombay
            console.log('network is', connectedWallet.network)
            console.log('connectType is', connectedWallet.connectType)
      }
      
      //Check if bid is highest
        try {
            let msg = new MsgExecuteContract(connectedWallet.walletAddress, state.privTokenContract,{
                place_bid: {auction_id: testAuctionID}
            }, {uusd: String(amount * 1000000)})

            const result = await connectedWallet.post({
                msgs: [msg]
            })
            console.log(result)            
            toast.success('Bid successful')
            setTimeout(() => reloadBids(),3000)
        }catch (e) {
            console.log(e)       
            toast.error('Bid error')
        }



  }
    async function retractBid(){
        console.log(amount, 'retract bid')
        if (!connectedWallet) return

        //Check if bid is highest
        try {
            let msg = new MsgExecuteContract(connectedWallet.walletAddress, state.privTokenContract,{
                retract_bids: {auction_id: testAuctionID}
            })

            const result = await connectedWallet.post({
                msgs: [msg]
            })
            console.log(result)
            toast.success('Retract bids success')
            setTimeout(() => reloadBids(),3000)
        }catch (e) {
            console.log(e)
            toast.error('Retract bids error')
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

    const getNftUserData = useCallback(async () => {
        try {

            if (connectedWallet){
                const bidderData = await api.contractQuery(
                    state.privTokenContract,
                    {
                        bidder:{
                            auction_id:testAuctionID,
                            address: connectedWallet.walletAddress
                        }
                    }
                )
                setBidder(bidderData)
            }

        }catch (e) {
            console.log(e)
        }
    }, [connectedWallet]);

  useEffect(() => {      
    getNftData()
      getNftUserData()
}, [getNftData, getNftUserData])

    

  return (
            <>
            <section className="single-nft-main" style={{padding:0}}>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-6" style={{
                                background: '#00000059',
                                padding: '8% 0'
                        }}>
                            <Card key={1} data={state.auctions} nft={imageNftData} type={'xl'}  expiryTimestamp={expiryTimestamp}  index={99}/>
                        </div>
                        <div className="col-md-6 d-flex px-md-5">
                            <div className="align-self-center w-100">
                            <h3 className="title">{imageNftData.name}</h3>
                            <p className="author">Author name</p>                        
                            <p className="description">{imageNftData.description}</p>
                            <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
  <li class="nav-item" role="presentation">
    <button class="nav-link active btn-sm" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Auction info</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link btn-sm" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Bidding</button>
  </li>
</ul>
<div class="tab-content" id="pills-tabContent">
  <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
  <div className="row">
                                {/* <div className="col-12">
                                    <div className="nft-stats">
                                        <h6>Highest bid</h6>
                                        <p className="highest_bid">{nftData.highest_bid / 1000000} <span>UST</span></p>
                                    </div>
                                </div> */}
                            
                                    <div className="col-6">
                                    <div className="nft-stats">
                                        <h6>Reserve price</h6>
                                        <p className="highest_bid">{nftData.reserve_price / 1000000} <span>UST</span></p>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="nft-stats">
                                        <h6>Charity</h6>
                                        <p className="highest_bid">{nftData.charity ? nftData.charity.fee_percentage + '%': '0%' }</p>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="nft-stats">
                                        <h6>Starting price</h6>
                                        <p className="start-price">{nftData.start_price / 1000000} <span>UST</span></p>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="nft-stats">
                                        <h6>Instant buy</h6>
                                        <p className="start-price">{nftData.instant_buy / 1000000} <span>UST</span></p>
                                    </div>
                                </div>
                             
                                                    
                            </div>     
  </div>
  <div class="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
  <div className="row">
  <div className="col-12">
                                <h5>Current bids ({nftData.total_bids})</h5>
                            <div style={{maxHeight:'120px',overflowY:'scroll'}}>
                            <table className="table">
                                <tbody>
                                    {bidInfo.length > 0 ? bidInfo.sort(
                                        (a,b) => {return parseInt(b.amount) - parseInt(a.amount)}
                                    ).map((obj,key) => {                                    
                                        return (
                                            <tr key={key} className={key == 0 ? 'highest' : ''}>                                    
                                            <td className="text-start"><strong>{obj.amount / 1000000} UST</strong>
                                            <small className="d-block text-muted" style={{fontSize:'10px'}}>{obj.bidder.slice(0, -20) + "**********"}</small>
                                            </td>
                                            </tr>  
                                        )                                  
                                    }) 
                                    :
                                    <p className="text-muted text-center w-100 py-1 m-0">No bids yet</p>
                                    }                               
                                
                                </tbody>
                            </table>
                            </div>
                                    </div>          
                                <div className="col-6">
                                <h5>Your bid</h5>
                            <div className="input-group mb-0">
                                    <span className="input-group-text" id="basic-addon1">
                                        <img src="/img/UST.svg" width="30px" className="img-fluid"/>
                                    </span>
                                    <input 
                                    type="number"
                                    className="form-control amount-input-staking"
                                    required={true}
                                    disabled={nftData && nftValid(nftData.end_time) ? false : true}
                                    onChange={(e) => setAmount(e.target.value)}                                   
                                    autoComplete="off"
                                    step="1"
                                    placeholder={nftData.highest_bid ? ((parseInt(nftData.highest_bid) + (parseInt(nftData.highest_bid) * 5 / 100)) - parseInt(bidder.total_bid)) / 1000000 : 0}
                                    name="amount"
                                    />
                                </div>
                                </div>
                                <div className="col-6">
                                    <div className={'nft-bidding d-flex ' + (nftData.highest_bid == bidder.total_bid ? 'success' : 'warning')}>
                                        <div className="align-self-center w-100 text-center">
                                        <h6>{nftData.highest_bid == bidder.total_bid ? 'You have the highest bid' : bidder.total_bid ? 'You have been overbid' : 'Start bidding'}</h6>
                                        <p>{nftData.highest_bid == bidder.total_bid ? <Check size={24} /> : <Warning size={24} /> }{bidder.total_bid / 1000000} UST</p>
                                        </div>
                                    </div>
                                </div>
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
                                disabled={nftData && nftValid(nftData.end_time) && nftData.instant_buy ? false : true}
                                onClick={() => buyNow()}>{nftData && nftValid(nftData.end_time) && nftData.instant_buy ? 'Buy now for ' + (parseInt(bidder.total_bid) > 0 ? (parseInt(nftData.instant_buy) - parseInt(bidder.total_bid)) / 1000000 : parseInt(nftData.instant_buy) / 1000000) +'UST' : 'Buy now'}
                                </button>
                                    </div>
                                    <div className="col-12 mt-5">
                                        <button
                                            className="btn btn-secondary btn-lg w-100"
                                            disabled={nftData && connectedWallet && nftData.highest_bidder != connectedWallet.walletAddress && parseInt(bidder.total_bid) > 0 ? false : true}
                                            onClick={() => retractBid()}>{nftData && nftValid(nftData.end_time) ? 'Retract bid' : 'Retract bid not allowed'}
                                        </button>
                                    </div>
                                </div>
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
          { state.auctions && state.auctions.slice(0,4).map((obj,key) => {
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