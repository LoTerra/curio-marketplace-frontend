import React, { useState, useCallback, useEffect } from 'react'
import NftCard from '../../components/NftCard'
import { useStore } from '../../store'
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useWallet, useConnectedWallet } from '@terra-money/wallet-provider';
const { w3cwebsocket }  = require( "websocket");
const client = new w3cwebsocket('wss://observer.terra.dev');
const auction_address = "terra1eyqqc7xkv5vcld6t5fzt8pmjvuy2mdl5gzxpcz";

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
import MainLoader from '../../components/Loaders/MainLoader';
import AuctionInfo from '../../components/SingleNft/AuctionInfo';
import BiddingInterface from '../../components/SingleNft/BiddingInterface';
import { data } from 'jquery';

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
 

const reloadData = useCallback(async () => {

   try {
    const bids = await api.contractQuery(
        state.privAuctionContract,
        {
            history_bids:{
                auction_id:testAuctionID
            }
        }
    )
    sortBids(bids.bids)    

        const nftConfigInfo = await api.contractQuery(
            state.privAuctionContract,
            {
                auction:{
                    auction_id:testAuctionID
                }
            }
        )        
    
        setNftData(nftConfigInfo)        

        if(connectedWallet && connectedWallet.walletAddress){
            const bidderData = await api.contractQuery(
                state.privAuctionContract,
                {
                    bidder:{
                        auction_id:testAuctionID,
                        address: connectedWallet.walletAddress
                    }
                }
            )
            setBidder(bidderData)
        }
    
      } catch(e){
        console.log(e)
      }

})

  function observer(){
    // const wsclient = new WebSocketClient("wss://observer.terra.dev");
     console.log("ok")
     client.onopen = () => {
         console.log('WebSocket Client Connected');
         client.send(JSON.stringify({subscribe: "new_block", chain_id: "bombay-12"}))
     };
     client.onmessage = (message) => {
         let to_json = JSON.parse(message.data)
         // console.log(to_json.data.txs[0]);
         to_json.data.txs.map(txs => {
             // console.log(txs)
             try {
                 let to_json_raw = JSON.parse(txs.raw_log)
                 to_json_raw.map(tx =>{
                     // console.log(tx)
                     tx.events.map(ev => {
                         if (ev.type == 'execute_contract'){
                             ev.attributes.map(attr => {
                                 // console.log(attr)
                                 if (attr.key == "contract_address" && attr.value == auction_address){
                                     console.log("Auction event detected")                                    
                                 }
                             })
                         }
                         if (ev.type == 'wasm'){
                            
                             ev.attributes.map(async (attr) => {                                
                                     if ( attr.key == "contract_address" && attr.value == auction_address){
                                        console.log(ev.attributes)               
                                        if(ev.attributes[3].value == testAuctionID){
                                            toast.success('New bid off +'+ (ev.attributes[1].value / 1000000)+'UST')
                                            reloadData()
                                        }    
                                        
                                     }
                                 
                             })
                         }
                     })
 
                     // console.log(tx)
                 })
             } catch (e) {
                 console.log("Not JSON parsable")
             }
         })
     };
 
     client.onclose = function(e) {
         console.log('websocket closed. reopening...');
         setTimeout(function() {
             observer();
         }, 1000);
     };
 }
 
 observer()



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
            state.privAuctionContract,
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
        
          
          var config = {
            method: 'get',
            url: 'https://privilege.digital/api/get-items',          
            params : {
                auctionId: testAuctionID
            }
          };
          
          await axios(config)
          .then(function (response) {
            console.log('repsonse',response.data);
            const data = response.data.filterItems[0]
            setImageNftData({image: data.image_url, name: data.title, description: data.description, private_sale: data.private_sale})  
            console.log({image: data.image_url, name: data.title, description: data.description, private_sale: data.private_sale})
          })
          .catch(function (error) {
            console.log(error);
          });

     
          

        //Final check for bids
        if(nftConfigInfo.total_bids > 0){
            const bids = await api.contractQuery(
                state.privAuctionContract,
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



  async function unlockPrivAuction(price){
      try{
        if (!connectedWallet) return
        let priv_msg = {
            register_private_sale:{
                auction_id: testAuctionID
            }
        };
        let msg = new MsgExecuteContract(connectedWallet.walletAddress, String(state.privTokenCw20Contract),{
            send: {
                contract: state.privAuctionContract,    
                amount: String(price),            
                msg:Buffer.from(JSON.stringify(priv_msg)).toString(
                    'base64'
                )
            }
        })

        const result = await connectedWallet.post({
            msgs: [msg]
        })
        toast.success("Auction unlocked!")
        getNftData()
        getNftUserData()
      } catch(e){
          console.log(e)
      }
  }

  async function buyNow(){
      try {
          if (!connectedWallet) return
          let final_price = parseInt(bidder.total_bid) > 0 ? parseInt(nftData.instant_buy) - parseInt(bidder.total_bid) : parseInt(nftData.instant_buy)

          let msg = new MsgExecuteContract(connectedWallet.walletAddress, state.privAuctionContract,{
              instant_buy: {
                  auction_id:testAuctionID
              }
          }, {"uusd": String(final_price)})

          const result = await connectedWallet.post({
              msgs: [msg]
          })
      }catch (e) {
          console.log(e)
      }

  }

  async function placeBid(){
      if (!connectedWallet) {
        toast.error('Connect your wallet')
        return
      }

      if(amount == 0){
        toast.error('Please fill a amount to bid')
        return 
      }
      
      // Set a min bid
      let min_bid = nftData.highest_bid ? ((parseInt(nftData.highest_bid) + (parseInt(nftData.highest_bid) * 5 / 100)) - parseInt(bidder.total_bid)) : nftData.start_price !== 0 ? nftData.start_price : 0;
      if (amount * 1000000 < min_bid) {
            toast.error('Your bid is to low')
          return
      }

      //Check if above minimum 5%
      if(amount * 1000000 > min_bid){
          let result = confirm('Are you sure you bid above the minimun 5% ?')
          if(!result){
              return
          }
      }

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
            let msg = new MsgExecuteContract(connectedWallet.walletAddress, state.privAuctionContract,{
                place_bid: {auction_id: testAuctionID}
            }, {uusd: String(amount * 1000000)})

            const result = await connectedWallet.post({
                msgs: [msg]
            })
            console.log(result)            
            toast.success('Bid successful')
            //Not needed, we reload on websocket event
            //setTimeout(() => reloadData(),3000)
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
            let msg = new MsgExecuteContract(connectedWallet.walletAddress, state.privAuctionContract,{
                retract_bids: {auction_id: testAuctionID}
            })

            const result = await connectedWallet.post({
                msgs: [msg]
            })
            console.log(result)
            toast.success('Retract bids success')
            setTimeout(() => reloadData(),3000)
        }catch (e) {
            console.log(e)
            toast.error('Retract bids error')
        }



    }



    function getBiddingInfo(info){
        if(bidder.bids.length > 0) {
            if(parseInt(bidder.total_bid) == parseInt(info.highest_bid)) {
                return 'You are the highest bidder';
            } else {
                return 'Add ' + ((parseInt(info.highest_bid) + (parseInt(info.highest_bid) * 5 / 100)) - parseInt(bidder.total_bid)) / 1000000 + ' UST'
            }
        }

        return 'Start bidding from ' + (info.highest_bid ? ((parseInt(info.highest_bid) + (parseInt(info.highest_bid) * 5 / 100)) - parseInt(bidder.total_bid)) / 1000000 : 0)+ ' UST'


    }

  function nftValid(end,start){
    let ending = new Date(parseInt(end) * 1000)
    let starting = new Date(parseInt(start) * 1000)
    let now = new Date()    

    if(ending < now){
        return false
    } 
    if(starting > now){
        return false;
    }
    return true;
  }

  const rightsCheck = () => {
      if(nftData.start_time * 1000 > Date.now()){
          console.log('check not valid start time')
        return false;
      }
      if(imageNftData.private_sale > 0 && imageNftData.private_sale !== undefined || null){
        if(bidder.privilege_used === imageNftData.private_sale){
            console.log('bidder unlocked')
            return true;
          } else {
            console.log('bidder not unlocked')
            return false;
          }
      } else {
          console.log('no private sale, true')
          return true;
      }      
  }

    const getNftUserData = useCallback(async () => {
        try {

            if (connectedWallet){
                const bidderData = await api.contractQuery(
                    state.privAuctionContract,
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
            <div className="col-md-6 nft-left">
                <Card key={1} data={state.auctions} nft={imageNftData} type={'xl'} expiryTimestamp={expiryTimestamp} index={99}/>
            </div>

            <div className="col-md-6 nft-right px-xl-5 d-flex">
                <div className="align-self-center w-100">
                    {parseInt(imageNftData.private_sale) > 0 &&
                    <p>Private auction</p>
                    }
                    <h3 className="title">{imageNftData.name}</h3>
                    <p className="author">Author name</p>
                    <p className="description">{imageNftData.description}</p>
                    {rightsCheck()  &&
                    <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button className="nav-link active btn-sm" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Auction info</button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link btn-sm" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Bidding</button>
                        </li>
                    </ul>
                    }
                    <div className="tab-content" id="pills-tabContent">
                        <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                            <div className="row">
                                <div className="col-12">
                                    <Countdown expiryTimestamp={expiryTimestamp} end={nftData.end_time} start={nftData.start_time} />
                                </div>
                                                   
                                <AuctionInfo nftData={nftData} bidInfo={bidInfo} imageNftData={imageNftData} bidder={bidder} nftValid={(a,b) => nftValid(a,b)} buyNow={() => buyNow()} rightsCheck={() => rightsCheck()}/>
                                {bidder.privilege_used === null || bidder.privilege_used === undefined && imageNftData.private_sale > 0 &&
                                <div className="col-12">
                                    <button className="btn btn-primary btn-lg w-100 mt-3" onClick={() => unlockPrivAuction(imageNftData.private_sale)}>
                                        Unlock private auction
                                        <small><strong>Costs: </strong>{parseInt(imageNftData.private_sale) / 1000000} PRIV</small>
                                    </button>
                                </div>
                                }
                            </div>
                        </div>
                        <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                            <div className="row">
                                <div className="col-12">
                                    <Countdown expiryTimestamp={expiryTimestamp} end={nftData.end_time} start={nftData.start_time} />
                                </div>

                                <BiddingInterface 
                                bidInfo={bidInfo}
                                nftData={nftData}
                                imageNftData={imageNftData}
                                bidder={bidder}
                                amount={amount}
                                setAmount={(a) => setAmount(a)}
                                nftValid={(a,b) => nftValid(a,b)}
                                retractBid={() => retractBid()}
                                connectedWallet={connectedWallet}
                                rightsCheck={() => rightsCheck()}
                                placeBid={() => placeBid()}
                                buyNow={() => buyNow()} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <MainLoader loading={loading} />
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
            { state.auctions && state.auctions.slice(0,4).map((obj,key) => { return (
            <div className="col-md-3">
                <NftCard key={key} type={'small'} data={obj} index={key}/>
            </div>
            ) })}
        </div>
    </div>
</section>
<Toaster />
            </>
  )
}