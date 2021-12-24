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
                            {nft.image_url && !nft.animation_url && (                     
                            <img src={nft.image_url.replace('ipfs://','https://ipfs.io/ipfs/')} className="img-fluid"/>

                            )}
                            {nft.image_url && !nft.animation_url && (                              
                                <img src={nft.image_url.replace('ipfs://','https://ipfs.io/ipfs/')} className="img-fluid"/>

                            )}
                            {nft.animation_url && (                                                                
                                <video playsinline="" autoplay="" muted loop src={nft.animation_url.replace('ipfs://','https://ipfs.io/ipfs/')} className="img-fluid"></video>
                            )}
                    </div>
                </>
            )}
        </>
    )
}
