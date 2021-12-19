import React, { useState, useEffect, useMemo } from 'react'

export default function NftBadge(props) {
    const { data } = props

    return (
        <>
            {data.restricted && <span className="nft-badge">Restricted</span>}

            {data.private_sale !== undefined &&
                data.private_sale !== null &&
                data.private_sale == true && (
                    <span className="nft-badge">Private Auction</span>
                )}

            {data.instant_buy > 0 && (
                <span className="nft-badge">Instant Buy</span>
            )}
        </>
    )
}
