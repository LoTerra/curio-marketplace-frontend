import { TelegramLogo, TwitchLogo, TwitterLogo } from 'phosphor-react'
import React, { useState, useEffect, useMemo } from 'react'
import numeral from 'numeral'

export default function NftPrice(props) {
    const { data, auctions } = props
    const [price, setPrice] = useState(0)
    const [start_price, setStartPrice] = useState(0)

    useEffect(() => {
        if (auctions && auctions.length > 0) {
            auctions.map((obj) => {
                if (obj[1].nft_id == data.nft_id)
                    setPrice(obj[1].highest_bid / 1000000)
            })

            if (price == 0) {
                auctions.map((obj) => {
                    if (obj[1].nft_id == data.nft_id) {
                        if (obj[1].start_price) {
                            setStartPrice(obj[1].start_price / 1000000)
                        }
                    }
                })
            }
        }
    }, [auctions])

    /*
        //////////////
        Return nothing until we resolve the wrong data displayed issue
        //////////////
     */
    // return (
    //     <></>
    // )
    return (

        // <div className="nft-price">
        //     {price > 0 && (
        //         <p className="m-0">
        //             <small className="d-block">HIGHEST BID</small>
        //             <img src="/img/UST.svg" className="me-1" width="20" />
        //             {numeral(price).format('0,0.00')} UST
        //         </p>
        //     )}
        //     {price == 0 && start_price > 0 && (
        //         <p className="m-0">
        //             <small className="d-block">OPENING BID</small>
        //             <img src="/img/UST.svg" className="me-1" width="20" />
        //             {numeral(start_price).format('0,0.00')} UST
        //         </p>
        //     )}
        //     {price == 0 && start_price == 0 && (
        //         <p className="m-0">
        //             <small className="d-block">START BIDDING</small>
        //             <img src="/img/UST.svg" className="me-1" width="20" />
        //             0.00 UST
        //         </p>
        //     )}
        // </div>
        <></>
    )
}
