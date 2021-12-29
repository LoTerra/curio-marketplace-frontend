import { Check } from 'phosphor-react';
import React, { useState, useEffect } from 'react'

export default function PreviewImage(props) {

    const {obj,tokenId} = props;

    console.log('obj',obj)

    return (
        <>
        {tokenId &&
            tokenId ==
                obj.token_id && (
                <span className="nft-selected">
                    {' '}                    
                    <Check
                        size={24}
                        weight={
                            'bold'
                        }
                    />{' '}
                </span>
            )}
            {obj.image && (
            <img
            src={obj.image.replace('ipfs://','https://ipfs.io/ipfs/')}
            className="img-fluid"
            />)}
          

            {obj.image_url && !obj.animation_url && (
            <img src={obj.image_url.replace('ipfs://','https://ipfs.io/ipfs/')} className="img-fluid"/>
            )}

            {obj.animation_url && (
            <video playsinline="" autoplay="" muted loop src={obj.animation_url.replace('ipfs://','https://ipfs.io/ipfs/')} className="img-fluid"></video>
            )}
            
            <p>{obj.name}</p>
        </>
    )

}
