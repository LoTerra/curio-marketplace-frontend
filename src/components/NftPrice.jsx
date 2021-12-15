import { TelegramLogo, TwitchLogo, TwitterLogo } from 'phosphor-react'
import React, { useState, useEffect, useMemo } from 'react'

export default function NftPrice(props){

    const {data} = props;

    let price = parseInt(data.highest_bid) / 1000000
    let start_price = data.start_price !== null ? parseInt(data.start_price) / 1000000 : null

    return (
        <div className="nft-price">          
                { price > 0 &&
                    <p className="m-0">
                        <small className="d-block">HIGHEST BID</small>
                        <img src="/img/UST.svg" className="me-1" width="20"/>{price} UST</p>
                }      
                { price == 0 && start_price !== null &&
                    <p className="m-0">
                        <small className="d-block">OPENING BID</small>
                        <img src="/img/UST.svg" className="me-1" width="20"/>{start_price} UST</p>
                }
                { price == 0 && start_price === null &&
                    <p className="m-0">
                        <small className="d-block">START BIDDING</small>
                    </p>
                }
        </div>
    )
}