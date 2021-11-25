import React, { useState, useEffect, useMemo } from 'react'

export default function NftBadge(props){

    const {data} = props;


    return (
        <>
        {data.restricted &&
            <span className="nft-badge">
                Restricted
            </span>
        }

        {data.instant_buy > 0 &&
            <span className="nft-badge">
                Instant buy
            </span>
        }
        </>
    )
}