import React, { useState, useEffect } from 'react'
import { useStore } from '../store'
import Tilt from 'react-tilt'
import { ArrowRight } from 'phosphor-react'
import SmallCountdown from './SmallCountdown'
import NftBadge from './NftBadge'
import NftPrice from './NftPrice'
import Media from './Media'
import { Link } from 'react-router-dom'

export default function NftCard(props) {
    const { state, dispatch } = useStore()

    const { index, data, nft, auctions, type, isEnded } = props

    //console.log("data-props")
    //console.log(data)
    return (
        <>
            {data && (
                <Link to={`/nfts/${ data.auction_id }`}>               
                    <div
                        className={
                            'card text-white nft-card ratio ratio-1x1 ' + type
                        }
                    >
                        {/* <button className="btn btn-plain"><ArrowRight size={24} color={'#fff'}/></button> */}

                        {!isEnded && <NftBadge data={data} />}

                        <Media data={data} />

                        <div className="card-img-overlay">
                            <div className="d-flex h-100 w-100">
                                <div className="nft-info align-self-end w-100">
                                    {type != 'xl' && (
                                        <>
                                            <h5 className="card-title m-0">
                                                {data.title
                                                    ? data.title
                                                    : data.extension.name}
                                            </h5>

                                            {!isEnded && (
                                                <NftPrice
                                                    data={data}
                                                    auctions={auctions}
                                                />
                                            )}

                                            {data.end_time &&
                                                data.end_time > 1 && (
                                                    <SmallCountdown
                                                        expiryTimestamp={
                                                            data.end_time
                                                        }
                                                        start={data.start_time}
                                                    />
                                                )}
                                            {/* <p className="m-0 text-muted">Highest bid: <strong>{data.highest_bid / 1000000} UST</strong></p>
                                        <p className="m-0 text-muted">Total bids: <strong>{data.total_bids}</strong></p>                                        */}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            )}
        </>
    )
}
