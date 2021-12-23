import React, { useState, useEffect } from 'react'
import { useStore } from '../../store'
import Tilt from 'react-tilt'
import Countdown from './Countdown'

export default function Card(props) {
    const { state, dispatch } = useStore()

    const { index, data, nft, type, expiryTimestamp } = props
    //console.log("data-props")
    ///console.log(data)
    return (
        <>
            {nft && (
                <>
                
                    <div className="nft-preview ratio ratio-1x1">
                        {nft.image && (<img
                            src={nft.image}
                            alt="..."
                        />)}
                            {nft.image_url && (
                            <img src={"https://ipfs.io/ipfs/" +nft.image_url.split("/").pop()} />
                            )}
                            {nft.animation_url && (                                
                                <video playsinline="" autoplay="" loop="" src={"https://ipfs.io/ipfs/" +nft.animation_url.split("/").pop()}></video>
                            )}
                    </div>
                </>
            )}
        </>
    )
}
