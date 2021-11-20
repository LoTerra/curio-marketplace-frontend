import React, { useState, useEffect } from 'react'
import { useStore } from '../../store'
import Tilt from 'react-tilt'
import Countdown from './Countdown';



export default function Card(props) {
    const { state, dispatch } = useStore()

    const {index, data, nft, type, expiryTimestamp} = props;
    console.log("data-props")
    console.log(data)
    return (<>{ data &&
        <>
      
            
            <div className="nft-preview ratio ratio-1x1">
                <img src={nft ? nft.image : 'https://i.pinimg.com/736x/1d/00/6c/1d006cafea4ebb657e1bee4d38043569.jpg'} />
        
            </div>                
       
       
    </>
}</>
    )
}