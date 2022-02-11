import { useConnectedWallet } from '@terra-money/wallet-provider'
import { Eye, X } from 'phosphor-react'
import React, { useState, useEffect } from 'react'
import { useStore } from '../store'
import axios from 'axios'
import NftListItem from './UserModal/NftListItem'
import { Link } from 'react-router-dom'

export default function UserModal(props) {
    const { bank, priv, connectedWallet, renderModal, setRenderModal } = props
    const [userBids, setUserBids] = useState([])
    const [userAuctions, setUserAuctions] = useState([])
    const { state, dispatch } = useStore()

    let api_url = state.network == 'mainnet' ? state.liveApi : state.testnetApi

    const getBidData = async () => {
        let array = []
        const res_bids = await axios.get(
            api_url + '/get-user?address=' + connectedWallet.walletAddress,
        )
        //console.log(res_bids.data)
        setUserBids([])
        res_bids.data.user.auction.map(async (id) => {
            const bid_auction = await axios.get(
                api_url + '/get-items?auctionId=' + id,
            )
            //console.log(bid_auction.data.filterItems[0])
            array.push(bid_auction.data.filterItems[0])
            setUserBids((userBids) => [
                ...userBids,
                bid_auction.data.filterItems[0],
            ])
        })

        // console.log('array data',array)
    }

    const getAuctionData = async () => {
        const auction_data = await axios.get(
            api_url +
                '/get-items?creatorAddress=' +
                connectedWallet.walletAddress,
        )
        //console.log('auctions',auction_data.data.filterItems)
        setUserAuctions(auction_data.data.filterItems)
    }

    useEffect(() => {
        if (renderModal && connectedWallet && connectedWallet.walletAddress) {
            getBidData()
            getAuctionData()
            //console.log(userBids,userAuctions)
        }
    }, [renderModal])

    return (
        <div
            className="modal right fade"
            id="userModal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="userModalLabel"
        >
            <div className="modal-dialog " role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title" id="userModalLabel">
                            Your profile
                        </h4>
                        <button
                            type="button"
                            className="btn btn-secondary p-2"
                            onClick={() => setRenderModal()}
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        >
                            <X size={24} color={'#fff'} />
                        </button>
                    </div>

                    <div className="modal-body">
                        {connectedWallet && connectedWallet.walletAddress && (
                            <Link
                                className="btn btn-secondary w-100 mb-3"
                                to={`/creator/${connectedWallet.walletAddress}`}
                            >
                                <Eye size={21} /> Your Auctions
                            </Link>
                        )}

                        <h5 className="modal-heading">Your balance</h5>
                        <div className="row">
                            <div className="col-6 text-center">
                                <p className="fs-5 my-2">{bank} UST</p>
                            </div>
                            <div className="col-6">
                                <p className="fs-5 my-2">
                                    {parseFloat(priv / 1000000)} SITY
                                </p>
                            </div>
                        </div>

                        <h5 className="modal-heading">Your biddings</h5>
                        {userBids.length == 0 && (
                            <p className="p-2 text-center text-muted">
                                No biddings
                            </p>
                        )}
                        <div className="nft-list-container">
                            {userBids.length > 0 &&
                                userBids
                                    .sort((a, b) => b.end_time - a.end_time)
                                    .map((obj) => {
                                        if (obj)
                                            return (
                                                <NftListItem
                                                    key={obj.auction_id + 'a'}
                                                    obj={obj}
                                                />
                                            )
                                    })}
                        </div>
                        <h5 className="modal-heading">Your Auctions</h5>
                        {userBids.length == 0 && (
                            <p className="p-2 text-center text-muted">
                                No Auctions
                            </p>
                        )}
                        <div className="nft-list-container">
                            {userAuctions.length > 0 &&
                                userAuctions
                                    .sort((a, b) => b.end_time - a.end_time)
                                    .map((obj) => {
                                        if (obj)
                                            return (
                                                <NftListItem
                                                    key={obj.auction_id + 'b'}
                                                    obj={obj}
                                                />
                                            )
                                    })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
