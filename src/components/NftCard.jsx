import React, { useState, useEffect } from 'react'
import { useStore } from '../store'
import Tilt from 'react-tilt'
import { ArrowRight } from 'phosphor-react'
import SmallCountdown from './SmallCountdown'
import NftBadge from './NftBadge'
import NftPrice from './NftPrice'

export default function NftCard(props) {
    const { state, dispatch } = useStore()

    const { index, data, nft, type, isEnded } = props

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
    //console.log("data-props")
    //console.log(data)
    return (
        <>
            {data && (
                <a href={'/nfts/' + data.auction_id}>
                    <div
                        className={
                            'card text-white nft-card ratio ratio-1x1 ' + type
                        }
                    >
                        {/* <button className="btn btn-plain"><ArrowRight size={24} color={'#fff'}/></button> */}

                        {!isEnded && <NftBadge data={data} />}




                        {data.image_url && (<img
                            src={data.image_url}
                            className="card-img"
                            alt="..."
                        />)}
                        {data.extension && (
                            <embed src={"https://ipfs.io/ipfs/" +data.extension.image.split("/").pop()} width="200" height="200" />
                           )}


                        <div className="card-img-overlay">
                            <div className="d-flex h-100 w-100">
                                <div className="nft-info align-self-end w-100">
                                    {type != 'xl' && (
                                        <>
                                            <h5 className="card-title m-0">
                                                {data.title}
                                            </h5>

                                            {!isEnded && (
                                                <NftPrice data={data} />
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
                </a>
            )}
        </>
    )
}
