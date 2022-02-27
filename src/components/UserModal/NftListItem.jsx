import { Eye, TelegramLogo, TwitchLogo, TwitterLogo } from 'phosphor-react'
import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { IsActiveAuction } from '../../helpers/IsActiveAuction'

export default function NftListItem(props) {
    const { obj } = props
    console.log(obj)

    return (
        <>
            <li
                className={
                    'list-group-item bg-transparent nft-list-item' +
                    (IsActiveAuction(obj) ? ' active' : ' inactive')
                }
            >
                <Link
                    to={`/token/${obj.auction_id}`}
                    className="btn btn-secondary float-end"
                >
                    <Eye size={18} />
                </Link>
                <img src={obj.image_url} loading="lazy" />
                <Link to={`/token/${obj.auction_id}`}>{obj.title}</Link>
                <p className="text-white small fw-bolder mb-0">
                    Highest bid: {parseInt(obj.highest_bid) / 1000000} UST
                </p>
            </li>
        </>
    )
}
