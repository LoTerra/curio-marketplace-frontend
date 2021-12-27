import React, { useState, useEffect } from 'react'
import { useStore } from '../../store'
import Tilt from 'react-tilt'
import Countdown from './Countdown'
import Media from '../Media'

export default function Card(props) {
    const { state, dispatch } = useStore()

    const { nft } = props
    //console.log("data-props")
    ///console.log(data)
    return (
        <>
            {nft && (
                <>
                
                    <div className="nft-preview ratio ratio-1x1">
                        <Media data={nft}/>                  
                    </div>
                </>
            )}
        </>
    )
}
