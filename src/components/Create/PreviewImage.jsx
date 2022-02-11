import { Check } from 'phosphor-react'
import React, { useState, useEffect } from 'react'

export default function PreviewImage(props) {
    const { obj, tokenId } = props

    return (
        <>
            {tokenId && tokenId == obj.token_id && (
                <span className="nft-selected">
                    {' '}
                    <Check size={24} weight={'bold'} />{' '}
                </span>
            )}
            {obj.image && !obj.image_url && (
                <img
                    src={obj.image.replace('ipfs://', 'https://ipfs.io/ipfs/')}
                    className="img-fluid rounded"
                />
            )}

            {obj.image_url && !obj.animation_url && (
                <img
                    src={obj.image_url.replace(
                        'ipfs://',
                        'https://ipfs.io/ipfs/',
                    )}
                    className="img-fluid rounded"
                />
            )}

            {obj.animation_url && (
                <video
                    playsInline=""
                    autoPlay=""
                    muted
                    loop
                    src={obj.animation_url.replace(
                        'ipfs://',
                        'https://ipfs.io/ipfs/',
                    )}
                    className="img-fluid"
                ></video>
            )}

            <p>{obj.name ? obj.name : obj.token_id}</p>
        </>
    )
}
