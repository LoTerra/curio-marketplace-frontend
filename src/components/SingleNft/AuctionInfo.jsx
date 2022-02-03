import React, { useState, useEffect } from 'react'
import { useStore } from '../../store'
import numeral from 'numeral'
import { Match } from '@reach/router'
import ContractVerification from '../ContractVerification'
import { UserCircle } from 'phosphor-react'
import { Link } from 'react-router-dom'

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
        <div className="col-md-12">
        <div className="nft-stats big w-100 my-2">
                    <h6>Highest bid</h6>
                    <p className="highest_bid mb-0">
                        {numeral(
                            Math.floor(nftData.highest_bid / 1000000),
                        ).format('0,0')}
                        <span>
                            {numeral(nftData.highest_bid / 1000000).format(
                                '.000000',
                            )}
                        </span>{' '}
                        <small>UST</small>
                    </p>
                    <small                      
                        style={{ marginTop: '-4px', display: 'block' }}
                    >
                        Total of <strong>{bidInfo.length} bids</strong>
                    </small>
                </div>
        </div>
        
            <div className="col-12">
                
                
            </div>
           

            <div className="col-6">
                <div className="nft-stats">
                    <h6>Reserve price (UST)</h6>
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
                            ? (
                                  parseFloat(nftData.charity.fee_percentage) *
                                  100
                              ).toFixed(2) + '%'
                            : 'No'}
                    </p>
                </div>
            </div>

            {nftData.charity ? (
                <div className="col-12 pb-2">
                    <small
                        className="d-block"
                        style={{
                            fontSize: '12px',
                            opacity: 0.6,
                            wordBreak: 'break-word',
                            fontWeight: 300,
                        }}
                    >
                        Charity address: {nftData.charity.address}
                    </small>
                </div>
            ) : (
                ''
            )}

            <div className="col-6">
                <div className="nft-stats">
                    <h6>Opening bid (UST)</h6>
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
                    <h6>Buyout (UST)</h6>
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
            {imageNftData.attributes && imageNftData.attributes.length > 0 && (
                <div className="col-12">
                    <button
                        className="btn btn-simple w-100 mb-2"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseExample"
                        aria-expanded="false"
                        aria-controls="collapseExample"                       
                    >
                        View NFT Attributes ({imageNftData.attributes.length})
                    </button>
                    <div className="collapse" id="collapseExample">
                        <div className="row">
                            {imageNftData.attributes.map((obj,i) => {
                                return (
                                    <div className="col-6 col-lg-4 mb-2" key={i}>
                                        <div
                                            className="attribute-info"
                                            style={{
                                                background: '#0000004f',
                                                padding: '7px',
                                            }}
                                        >
                                            <p
                                                className="m-0"
                                                style={{
                                                    color: '#20ff93',
                                                    fontSize: '14px',
                                                }}
                                            >
                                                {obj.trait_type}
                                            </p>
                                            <p
                                                className="m-0"
                                                style={{
                                                    fontSize: '14px',
                                                }}
                                            >
                                                {obj.value ? obj.value : 'None'}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}
            <div className="col-md-6">
        <div className="nft-stats big w-100 my-2 mb-1">                   
                    {nftData && (
                        <ContractVerification
                            contractAddress={nftData.nft_contract}
                        />
                    )}
                </div>
        </div>
        <div className="col-md-6">
        <div className="nft-stats big w-100 my-2">                   
                    {nftData && nftData.creator && 
                        <>
                        <p style={{
                            fontSize:'14px'
                        }}>
                            <UserCircle size={16} />{nftData.creator.substring(0, 15).concat('...')}
                           </p>                            
                            <Link to={`/creator/${ nftData.creator }`}                       
                        className="btn btn-simple mt-2 btn-sm"
                        >View more</Link>
                        </>
                    }
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
