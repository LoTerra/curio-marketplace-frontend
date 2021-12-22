import React, { useState, useEffect } from 'react'
import { useStore } from '../../store'
import numeral from 'numeral'
import { Match } from '@reach/router'
let bootstrap = {}
if (typeof document !== 'undefined') {
    bootstrap = require('bootstrap')
}

export default function AuctionInfo(props) {
    const { state, dispatch } = useStore()

    const {
        nftData,
        bidInfo,
        imageNftData,
        nftValid,
        bidder,
        buyNow,
        rightsCheck,
        isOwner,
    } = props

    function selectBiddingTab() {
        let pill = document.querySelector('#pills-profile-tab')
        let tab = new bootstrap.Tab(pill)
        tab.show()
    }
    //console.log("data-props")
    ///console.log(data)
    return (
        <>
            <div className="col-12">
                <div className="nft-stats big w-100 my-2">
                    <h6>Highest bid</h6>
                    <p className="highest_bid mb-0">
                        {numeral(
                            Math.floor(nftData.highest_bid / 1000000),
                        ).format('0,0')}
                        <span style={{ fontSize: 'small' }}>
                            {numeral(nftData.highest_bid / 1000000).format(
                                '.000000',
                            )}
                        </span>{' '}
                        <span>UST</span>
                    </p>
                    <small
                        className="text-muted"
                        style={{ marginTop: '-8px', display: 'block' }}
                    >
                        Total of <strong>{bidInfo.length} bids</strong>
                    </small>
                </div>
            </div>

            <div className="col-6">
                <div className="nft-stats">
                    <h6>Reserve price</h6>
                    <p className="highest_bid">
                        {nftData.reserve_price ? (
                            <>
                                {numeral(
                                    Math.floor(nftData.reserve_price / 1000000),
                                ).format('0,0')}
                                <span style={{ fontSize: 'small' }}>
                                    {numeral(
                                        nftData.reserve_price / 1000000,
                                    ).format('.000000')}
                                </span>
                            </>
                        ) : (
                            'No'
                        )}{' '}
                        {nftData.reserve_price && <span>UST</span>}
                    </p>
                </div>
            </div>

            <div className="col-6">
                <div className="nft-stats">
                    <h6>Charity</h6>
                    <p className="highest_bid">
                        {nftData.charity
                            ? (parseFloat(nftData.charity.fee_percentage) * 100).toFixed(2) + '%'
                            : 'No'}
                    </p>
                </div>
            </div>

            <div className="col-6">
                <div className="nft-stats">
                    <h6>Opening bid</h6>
                    <p className="start-price">
                        {nftData.start_price ? (
                            <>
                                {numeral(
                                    Math.floor(nftData.start_price / 1000000),
                                ).format('0,0')}
                                <span style={{ fontSize: 'small' }}>
                                    {numeral(
                                        nftData.start_price / 1000000,
                                    ).format('.000000')}
                                </span>
                            </>
                        ) : (
                            'No'
                        )}{' '}
                        {nftData.start_price && <span>UST</span>}
                    </p>
                </div>
            </div>

            <div className="col-6">
                <div className="nft-stats">
                    <h6>Buyout</h6>
                    <p className="start-price">
                        {nftData.instant_buy ? (
                            <>
                                {numeral(
                                    Math.floor(nftData.instant_buy / 1000000),
                                ).format('0,0')}
                                <span style={{ fontSize: 'small' }}>
                                    {numeral(
                                        nftData.instant_buy / 1000000,
                                    ).format('.000000')}
                                </span>
                            </>
                        ) : (
                            'No'
                        )}{' '}
                        {nftData.instant_buy && <span>UST</span>}
                    </p>
                </div>
            </div>

            {rightsCheck() && !isOwner && (
                <div
                    className={
                        nftData &&
                        nftValid(nftData.end_time, nftData.start_time) &&
                        nftData.instant_buy !== null
                            ? 'col-md-6 mt-3'
                            : 'col-md-12 mt-3'
                    }
                >
                    <button
                        onClick={() => selectBiddingTab()}
                        className="btn btn-primary btn-lg w-100"
                        disabled={
                            nftData &&
                            nftValid(nftData.end_time, nftData.start_time)
                                ? false
                                : true
                        }
                    >
                        {nftData &&
                        nftValid(nftData.end_time, nftData.start_time)
                            ? 'Place bid'
                            : nftData.start_time * 1000 > Date.now()
                            ? 'Auction not started yet'
                            : 'Auction finished'}
                    </button>
                </div>
            )}

            {nftData &&
                nftValid(nftData.end_time, nftData.start_time) &&
                nftData.instant_buy &&
                rightsCheck() &&
                !isOwner && (
                    <div className="col-md-6 mt-3">
                        <button
                            className="btn btn-special btn-lg w-100"
                            disabled={
                                nftData &&
                                nftValid(
                                    nftData.end_time,
                                    nftData.start_time,
                                ) &&
                                nftData.instant_buy
                                    ? false
                                    : true
                            }
                            onClick={() => buyNow()}
                        >
                            {nftData &&
                            nftValid(nftData.end_time, nftData.start_time) &&
                            nftData.instant_buy
                                ? 'Buy now'
                                : 'Not available'}
                            <small>
                                {nftData &&
                                nftValid(
                                    nftData.end_time,
                                    nftData.start_time,
                                ) &&
                                nftData.instant_buy
                                    ? (parseInt(bidder.total_bid) > 0
                                          ? (parseInt(nftData.instant_buy) -
                                                parseInt(bidder.total_bid)) /
                                            1000000
                                          : parseInt(nftData.instant_buy) /
                                            1000000) + 'UST'
                                    : ''}
                            </small>
                        </button>
                    </div>
                )}
        </>
    )
}
