import { TelegramLogo, TwitchLogo, TwitterLogo } from 'phosphor-react'
import React, { useState, useEffect, useMemo } from 'react'
import numeral from 'numeral'

export default function NftPrice(props) {
    const { data, auctions } = props
    const [price, setPrice] = useState(0)
    const [start_price, setStartPrice] = useState(0)
    const [instantBuy, setInstantBuy] = useState(0)

    useEffect(() => {
           const a = parseInt(data.start_price) / 1000000;
        if(a > 0)
            setStartPrice(a)

        const b = parseInt(data.instant_buy) / 1000000;
        if(b > 0)
            setInstantBuy(b)

        const c = parseInt(data.highest_bid) / 1000000;
        if(c > 0)
            setPrice(c)
   
    }, [])
    return (

        <div className="nft-price">
            {price > 0 && (
                <p className="m-0">
                    <small className="d-block">HIGHEST BID</small>
                    <img src="/img/UST.svg" className="me-1" width="20" />
                    {numeral(price).format('0,0.00')} UST
                </p>
            )}
            {price == 0 && start_price > 0 && (
                <p className="m-0">
                    <small className="d-block">START BIDDING</small>
                    <img src="/img/UST.svg" className="me-1" width="20" />
                    {numeral(start_price).format('0,0.00')} UST
                </p>
            )}
            {price == 0 && start_price == 0 && instantBuy > 0 && (
                <p className="m-0">
                    <small className="d-block">INSTANT BUY</small>
                    <img src="/img/UST.svg" className="me-1" width="20" />
                    {numeral(instantBuy).format('0,0.00')} UST
                </p>
            )}
            {price == 0 && start_price == 0 && instantBuy == 0 && (
                <p className="m-0">
                    <small className="d-block">START BIDDING</small>
                    <img src="/img/UST.svg" className="me-1" width="20" />
                    0.00 UST
                </p>
            )}
        </div>
      
    )
}
