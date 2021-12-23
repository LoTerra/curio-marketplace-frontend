import React, { useState, useCallback, useEffect, useMemo } from 'react'
import NftCard from '../../components/NftCard'
import { useStore } from '../../store'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'
import { useWallet, useConnectedWallet } from '@terra-money/wallet-provider'
import Pusher from 'pusher-js'

const auction_address = 'terra1dullgnj5cm4fgpetrrq8ctukag89upajjt8f3g'
// import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
// import 'swiper/swiper-bundle.css';
// import { Navigation, Pagination, Autoplay } from 'swiper';

import {
    StdFee,
    MsgExecuteContract,
    LCDClient,
    WasmAPI,
    BankAPI,
    Denom,
    CreateTxOptions,
    MsgSend,
} from '@terra-money/terra.js'
import Countdown from '../../components/SingleNft/Countdown'
import Card from '../../components/SingleNft/Card'
import MainLoader from '../../components/Loaders/MainLoader'
import AuctionInfo from '../../components/SingleNft/AuctionInfo'
import BiddingInterface from '../../components/SingleNft/BiddingInterface'
import { ArrowLeft, Eye } from 'phosphor-react'
import WithdrawNft from '../../components/SingleNft/WithdrawNft'
import numeral from 'numeral'

export default (props) => {
    const { state, dispatch } = useStore()
    const [amount, setAmount] = useState()
    const [expiryTimestamp, setExpiryTimestamp] = useState(1)
    const [nftData, setNftData] = useState(0)
    const [imageNftData, setImageNftData] = useState(0)
    const [recent, setRecent] = useState(0)
    const [isOwner, setIsOwner] = useState(false)
    const [bidInfo, setBidInfo] = useState([])
    const [bidder, setBidder] = useState({
        bid_counter: 0,
        bids: [],
        sity_used: null,
        total_bid: 0,
    })

    const [loading, setLoading] = useState(true)
    console.log(props)
    const testAuctionID = parseInt(props.nftId)

    console.log(testAuctionID)
  
    let wallet = ''
    let connectedWallet = ''

    if (typeof document !== 'undefined') {
        wallet = useWallet()
        connectedWallet = useConnectedWallet()
    }  

    const api = new WasmAPI(state.lcd.apiRequester)

    const reloadData = useCallback(async () => {
        try {
            const bids = await api.contractQuery(state.privAuctionContract, {
                history_bids: {
                    auction_id: testAuctionID,
                },
            })
            sortBids(bids.bids)

            const nftConfigInfo = await api.contractQuery(
                state.privAuctionContract,
                {
                    auction: {
                        auction_id: testAuctionID,
                    },
                },
            )

            setNftData(nftConfigInfo)

            if (connectedWallet && connectedWallet.walletAddress) {
                const bidderData = await api.contractQuery(
                    state.privAuctionContract,
                    {
                        bidder: {
                            auction_id: testAuctionID,
                            address: connectedWallet.walletAddress,
                        },
                    },
                )
                setBidder(bidderData)
            }
        } catch (e) {
            console.log(e)
        }
    })

    function sortBids(bids) {
        let clean = []
        clean = bids

        clean.sort((a, b) => {
            return parseInt(b.amount) - parseInt(a.amount)
        })

        setBidInfo(clean)
        console.log('cleaned', clean)
    }

    const getNftData = useCallback(async () => {
        try {
            const nftConfigInfo = await api.contractQuery(
                state.privAuctionContract,
                {
                    auction: {
                        auction_id: testAuctionID,
                    },
                },
            )

            console.log(nftConfigInfo)
            setNftData(nftConfigInfo)

            setExpiryTimestamp(parseInt(nftConfigInfo.end_time * 1000))

            console.log('timestamp', expiryTimestamp)

            var config = {
                method: 'get',
                url: 'https://privilege.digital/api/get-items',
                params: {
                    auctionId: testAuctionID,
                },
            }

            await axios(config)
                .then(function (response) {
                    console.log('repsonse', response.data)
                    let image = ''
                    let attributes = null;
                    
                    const data = response.data.filterItems[0]

                    if(data.image_url){
                        image = data.image_url
                    } else {
                        image = "https://ipfs.io/ipfs/" +data.extension.image.split("/").pop()
                    }
                    if(data.extension && data.extension.attributes){
                        attributes = data.extension.attributes
                    }

                    setImageNftData({
                        image: image,
                        name: data.title,
                        description: data.description,
                        private_sale: data.private_sale,
                        creator: data.creator.address,     
                        attributes: attributes                   
                    })
                    console.log('imageNftData',{
                        image: data.image_url,
                        name: data.title,
                        description: data.description,
                        private_sale: data.private_sale,
                    })
                })
                .catch(function (error) {
                    console.log(error)
                })

            var config_recent = {
                method: 'get',
                url: 'https://privilege.digital/api/get-items',
                params: {
                    limit: 5,
                },
            }

            await axios(config_recent)
                .then(function (response) {
                    console.log('repsonse', response.data)
                    setRecent(response.data.filterItems)
                })
                .catch(function (error) {
                    console.log(error)
                })

            //Final check for bids
            if (nftConfigInfo.total_bids > 0) {
                const bids = await api.contractQuery(
                    state.privAuctionContract,
                    {
                        history_bids: {
                            auction_id: testAuctionID,
                        },
                    },
                )

                console.log(bids)
                sortBids(bids.bids)
            }
            setTimeout(() => {
                setLoading(false)
                setAmount(
                    amount !== 0
                        ? amount
                        : bidInfo && bidInfo[0]
                        ? (bidInfo[0].amount / 1000000) * 1.05
                        : nftData && nftData.start_price
                        ? (nftData.start_price / 1000000) * 1.05
                        : 0,
                )
            }, 1000)
        } catch (e) {
            console.log(e)
        }
    }, [])

    async function unlockPrivAuction() {
        let price = getRawAmountToUnlock()
        try {
            if (!connectedWallet) {
                toast.error('Connect your wallet')
                return
            }
            let priv_msg = {
                register_private_sale: {
                    auction_id: testAuctionID,
                },
            }
            let msg = new MsgExecuteContract(
                connectedWallet.walletAddress,
                String(state.privTokenCw20Contract),
                {
                    send: {
                        contract: state.privAuctionContract,
                        amount: String(price),
                        msg: Buffer.from(JSON.stringify(priv_msg)).toString(
                            'base64',
                        ),
                    },
                },
            )

            const result = await connectedWallet.post({
                msgs: [msg],
                feeDenoms: "uusd"
            })
            toast.success('Auction unlocked!')
            setTimeout(() => reloadData(), 1000)
        } catch (e) {
            toast.error('Something went wrong, try again')
            console.log(e)
        }
    }

    async function buyNow() {
        try {
            if (!connectedWallet) {
                toast.error('Connect your wallet')
                return
            }
            let final_price =
                parseInt(bidder.total_bid) > 0
                    ? parseInt(nftData.instant_buy) - parseInt(bidder.total_bid)
                    : parseInt(nftData.instant_buy)

            let msg = new MsgExecuteContract(
                connectedWallet.walletAddress,
                state.privAuctionContract,
                {
                    instant_buy: {
                        auction_id: testAuctionID,
                    },
                },
                { uusd: String(final_price) },
            )

            const result = await connectedWallet.post({
                msgs: [msg],
                feeDenoms: "uusd"
            })
            toast.success('Instant buy succesful!')
            setTimeout(() => reloadData(), 1000)
        } catch (e) {
            console.log(e)
        }
    }

    function getAmountToUnlock(){
        if(nftData.private_sale){
            if(parseInt(nftData.highest_bid) / 1000000 > 1) {
                let bid = 1;
                let highest_bid = parseInt(nftData.highest_bid) / 1000000; 
                let add_to_bid = parseInt(nftData.highest_bid) / 100 * 2 / 1000000;
                if(highest_bid > 1){
                    bid = bid + add_to_bid;
                } 
                return numeral(bid).format('0,0.00')
            } else {
                return 1
            }
        } else {
            return 0
        }
    }

    function getRawAmountToUnlock(){
        if(nftData.private_sale){
            if(parseInt(nftData.highest_bid) > 0) {
                let bid = 1000000;
                let highest_bid = parseInt(nftData.highest_bid); 
                let add_to_bid = parseInt(nftData.highest_bid) / 100 * 2;
                if(highest_bid > bid){
                    bid = bid + add_to_bid;
                } 
                return bid; 
            } else {
                return 1000000
            }
        } else {
            return 0
        }
    }

    async function placeBid() {
        if (!connectedWallet) {
            toast.error('Connect your wallet')
            return
        }

        if (amount == 0) {
            toast.error('Please fill a amount to bid')
            return
        }

        // Set a min bid
        let min_bid = nftData.highest_bid
            ? parseInt(nftData.highest_bid) +
              (parseInt(nftData.highest_bid) * 5) / 100 -
              parseInt(bidder.total_bid)
            : nftData.start_price !== 0
            ? nftData.start_price
            : 0
        if (amount * 1000000 < min_bid) {
            toast.error('Your bid is to low')
            return
        }

        //Check if above minimum 5%
        if (amount * 1000000 > min_bid + 0.5) {
            let result = window.confirm(
                'Are you sure you want to bid above the minimun 5% ?',
            )
            if (!result) {
                return
            }
        }

        /*
        Here is an example of use for a simple transaction with connect wallet
       */
        if (connectedWallet) {
            console.log('walletAddress is', connectedWallet.walletAddress)
            // In this case network should be testnet bombay
            console.log('network is', connectedWallet.network)
            console.log('connectType is', connectedWallet.connectType)
        }

        //Check if bid is highest
        try {
            let msg = new MsgExecuteContract(
                connectedWallet.walletAddress,
                state.privAuctionContract,
                {
                    place_bid: { auction_id: testAuctionID },
                },
                { uusd: String(Math.floor(amount * 1000000)) },
            )

            const result = await connectedWallet.post({
                msgs: [msg],
                feeDenoms: "uusd"
            })
            console.log(result)
            toast.success('Bid successful')
            //Not needed, we reload on websocket event
            //setTimeout(() => reloadData(),3000)
        } catch (e) {
            console.log(e)
            toast.error('Bid error')
        }
    }
    async function retractBid() {
        console.log(amount, 'retract bid')
        if (!connectedWallet) return

        //Check if bid is highest
        try {
            let msg = new MsgExecuteContract(
                connectedWallet.walletAddress,
                state.privAuctionContract,
                {
                    retract_bids: { auction_id: testAuctionID },
                },
            )

            const result = await connectedWallet.post({
                msgs: [msg],
                feeDenoms: "uusd"
            })
            console.log(result)
            toast.success('Retract bids success')
            setTimeout(() => reloadData(), 3000)
        } catch (e) {
            console.log(e)
            toast.error('Retract bids error')
        }
    }

    function getBiddingInfo(info) {
        if (bidder.bids.length > 0 && info.highest_bid !== 0) {
            if (parseInt(bidder.total_bid) == parseInt(info.highest_bid)) {
                return 'You are the highest bidder'
            } else {
                return (
                    'Add ' +
                    (parseInt(info.highest_bid) +
                        (parseInt(info.highest_bid) * 5) / 100 -
                        parseInt(bidder.total_bid)) /
                        1000000 +
                    ' UST'
                )
            }
        }

        if (info.highest_bid == 0 && parseInt(info.start_price) > 0) {
            return (
                'Start bidding from ' +
                parseInt(info.start_price) / 1000000 +
                ' UST'
            )
        }

        return (
            'Start bidding from ' +
            (info.highest_bid
                ? (parseInt(info.highest_bid) +
                      (parseInt(info.highest_bid) * 5) / 100 -
                      parseInt(bidder.total_bid)) /
                  1000000
                : 0) +
            ' UST'
        )
    }

    function nftValid(end, start) {
        let ending = new Date(parseInt(end) * 1000)
        let starting = new Date(parseInt(start) * 1000)
        let now = new Date()

        if (ending < now) {
            return false
        }
        if (starting > now) {
            return false
        }
        return true
    }

    function nftValidEnd(end) {
        let ending = new Date(parseInt(end) * 1000)
        let now = new Date()

        //If ending is lower then filter
        if (ending.getTime() < now.getTime()) {
            return false
        }

        //If valid return true
        return true
    }

    const rightsCheck = () => {
        if (nftData.start_time * 1000 > Date.now()) {
            // console.log('check not valid start time')
            return false
        }
        if (
            (nftData.private_sale > 0 &&
                nftData.private_sale !== undefined) ||
            null
        ) {
            if (parseInt(bidder.sity_used) > 0 ) {
                // console.log('bidder unlocked')
                return true
            } else {
                // console.log('bidder not unlocked')
                return false
            }
        } else {
            // console.log('no private sale, true')
            return true
        }
    }

    const isWinner = () => {
        if (connectedWallet && connectedWallet.walletAddress) {
            if (
                (!nftValidEnd(nftData.end_time) &&
                    nftData.highest_bidder == connectedWallet.walletAddress) ||
                (!nftValidEnd(nftData.end_time) &&
                    nftData.creator == connectedWallet.walletAddress)
            ) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }

    //Componentdidmount equivalent
    useEffect(() => {
        getNftData()
    }, [])

    //Follow connectedwallet
    useEffect(() => {
        if (connectedWallet && connectedWallet.walletAddress) {
            if (
                connectedWallet &&
                connectedWallet.walletAddress == nftData.creator
            ) {
                setIsOwner(true)
            } else {
                setIsOwner(false)
            }
            (async () => {
                const bidderData = await api.contractQuery(
                    state.privAuctionContract,
                    {
                        bidder: {
                            auction_id: testAuctionID,
                            address: connectedWallet.walletAddress,
                        },
                    },
                )
                setBidder(bidderData)
                console.log('bidder', bidder)
            })()
        } else {
            setIsOwner(false)
        }
    }, [connectedWallet])

    function websocket() {
        //Pusher code
        const pusher = new Pusher('371306b233edc5c8cfb9', {
            cluster: 'eu',
        })
        const channel = pusher.subscribe('auction-channel')
        channel.bind('bid-event', function (data) {
            console.log(data)
            console.log(JSON.parse(data.message)[0].events)

            let tx = JSON.parse(data.message)[0]
            // console.log(tx)
            tx.events.map(async (ev) => {
                console.log(ev)

                if (ev.type == 'wasm') {
                    console.log(ev.attributes)
                    if (parseInt(ev.attributes[3].value) == testAuctionID) {
                        toast.success(
                            'New bid off +' +
                                ev.attributes[1].value / 1000000 +
                                'UST',
                        )
                        await reloadData()
                    }
                }
            })
        })
        channel.bind('buy-event', async function (data) {
            console.log(data)
            console.log('buy event', data)
            toast.success('Auction finished!')
            await reloadData()
        })
        return () => {
            pusher.unsubscribe('auction-channel')
        }
    }

    //Socket code
    useEffect(() => {
        websocket()
    }, [])

    return (
        <>
            <section className="single-nft-main" style={{ padding: 0 }}>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-6 nft-left">
                            <Card
                                key={1}
                                data={state.auctions}
                                nft={imageNftData}
                                type={'xl'}
                                expiryTimestamp={expiryTimestamp}
                                index={99}
                            />
                        </div>

                        <div className="col-md-6 nft-right px-xl-5 d-flex">
                            <div className="align-self-center w-100">
                                <a
                                    href="/"
                                    className="btn btn-secondary btn-sm mb-3 px-0 text-center text-md-start"
                                    style={{
                                        fontWeight: 300,
                                        display: 'block',
                                        opacity: 0.5,
                                        background: 'transparent',
                                    }}
                                >
                                    <ArrowLeft
                                        size={16}
                                        style={{
                                            position: 'relative',
                                            top: '-1px',
                                        }}
                                    />{' '}
                                    Back to home
                                </a>
                                {parseInt(nftData.private_sale) >
                                    0 && (
                                    <p className="single-nft-badge">
                                        Private
                                    </p>
                                )}
                                <h3 className="title">{imageNftData.name}</h3>
                                {isOwner && (
                                    <p style={{ color: '#ff36ff' }}>
                                        <Eye size={24} /> Viewing your own
                                        auction
                                    </p>
                                )}
                                <p className="description">
                                    {imageNftData.description}
                                </p>
                                {rightsCheck() && (
                                    <ul
                                        className="nav nav-pills mb-3"
                                        id="pills-tab"
                                        role="tablist"
                                    >
                                        <li
                                            className="nav-item"
                                            role="presentation"
                                        >
                                            <button
                                                className="nav-link active btn-sm"
                                                id="pills-home-tab"
                                                data-bs-toggle="pill"
                                                data-bs-target="#pills-home"
                                                type="button"
                                                role="tab"
                                                aria-controls="pills-home"
                                                aria-selected="true"
                                            >
                                                Auction info
                                            </button>
                                        </li>
                                        <li
                                            className="nav-item"
                                            role="presentation"
                                        >
                                            <button
                                                className="nav-link btn-sm"
                                                id="pills-profile-tab"
                                                data-bs-toggle="pill"
                                                data-bs-target="#pills-profile"
                                                type="button"
                                                role="tab"
                                                aria-controls="pills-profile"
                                                aria-selected="false"
                                            >
                                                Bidding
                                            </button>
                                        </li>
                                    </ul>
                                )}
                                <div
                                    className="tab-content"
                                    id="pills-tabContent"
                                >
                                    <div
                                        className="tab-pane fade show active"
                                        id="pills-home"
                                        role="tabpanel"
                                        aria-labelledby="pills-home-tab"
                                    >
                                        <div className="row">
                                            <div className="col-12">
                                                <Countdown
                                                    expiryTimestamp={
                                                        expiryTimestamp
                                                    }
                                                    end={nftData.end_time}
                                                    start={nftData.start_time}
                                                />
                                            </div>

                                            <AuctionInfo
                                                nftData={nftData}
                                                bidInfo={bidInfo}
                                                imageNftData={imageNftData}
                                                bidder={bidder}
                                                nftValid={(a, b) =>
                                                    nftValid(a, b)
                                                }
                                                buyNow={() => buyNow()}
                                                rightsCheck={() =>
                                                    rightsCheck()
                                                }
                                                isOwner={isOwner}
                                            />
                                            {!isOwner && nftData.private_sale &&
                                                !parseInt(bidder.sity_used) > 0 && (
                                                    <div className="col-12">
                                                        <button
                                                            className="btn btn-primary btn-lg w-100 mt-3"
                                                            onClick={() =>
                                                                unlockPrivAuction()
                                                            }
                                                        >
                                                            Unlock private
                                                            auction
                                                            <small>
                                                                <strong>
                                                                    Costs:{' '}
                                                                </strong>
                                                                {getAmountToUnlock()} SITY
                                                            </small>
                                                        </button>
                                                    </div>
                                                )}
                                            {isWinner() && (
                                                <div className="col-12 my-3">
                                                    <WithdrawNft
                                                        connectedWallet={
                                                            connectedWallet
                                                        }
                                                        auctionId={
                                                            testAuctionID
                                                        }
                                                        data={nftData}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div
                                        className="tab-pane fade"
                                        id="pills-profile"
                                        role="tabpanel"
                                        aria-labelledby="pills-profile-tab"
                                    >
                                        <div className="row">
                                            <div className="col-12">
                                                <Countdown
                                                    expiryTimestamp={
                                                        expiryTimestamp
                                                    }
                                                    end={nftData.end_time}
                                                    start={nftData.start_time}
                                                />
                                            </div>

                                            <BiddingInterface
                                                bidInfo={bidInfo}
                                                nftData={nftData}
                                                imageNftData={imageNftData}
                                                bidder={bidder}
                                                amount={amount}
                                                setAmount={(a) => setAmount(a)}
                                                nftValid={(a, b) =>
                                                    nftValid(a, b)
                                                }
                                                retractBid={() => retractBid()}
                                                connectedWallet={
                                                    connectedWallet
                                                }
                                                rightsCheck={() =>
                                                    rightsCheck()
                                                }
                                                placeBid={() => placeBid()}
                                                isOwner={isOwner}
                                                buyNow={() => buyNow()}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <MainLoader loading={loading} />
            </section>
            {/* <section className="nfts mt-0">
    <div className="container-fluid">
        <div className="row">
            <div className="col-md-12">
                <div className="heading">
                    <h3>Category name</h3>                 
                </div>
            </div>
           <div class="col-md-12">
               <div class="row">
               <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={25}
            slidesPerView={6}
            loop={true}
            breakpoints={{
              // when window width is >= 640px
              1: {         
                slidesPerView: 1,
              },
              // when window width is >= 768px
              768: {    
                slidesPerView: 2,
              },
              1000: {    
                slidesPerView: 6,
              },
            }}
            pagination={{ clickable: true }}
            navigation={false}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log(swiper)}
          >
    {
                   recent && recent.filter((a)=>{
                          if(nftValidEnd(a.end_time)){
                            return true;
                            }
                            return false;
                                              
                      }).sort((a,b) => {
                        return a.end_time - b.end_time;
                      }).slice(0,12).map((obj, id) =>{           
                            return (
                              <SwiperSlide>
                                <NftCard key={id} data={obj} type={'xs'} index={99}/>
                              </SwiperSlide>)            
                        })
                      }
                      </Swiper>
                </div>
            </div>
        </div>
    </div>
</section> */}
            <Toaster />
        </>
    )
}
