import React, { useState, useEffect } from 'react'
import { useStore } from '../../store'
import Tilt from 'react-tilt'
import Countdown from './Countdown'
import Media from '../Media'
import { Head } from 'react-static'

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
                        {nft.image_url && !nft.animation_url && (
                            <Head>
                                <meta charSet="UTF-8" />
                                <title>{nft.name}</title>
                                <meta property="og:title" content={nft.name} />
                                <meta
                                    property="og:image"
                                    content={nft.image_url.replace(
                                        'ipfs://',
                                        'https://ipfs.io/ipfs/',
                                    )}
                                />
                                <meta
                                    property="twitter:title"
                                    content={nft.name}
                                />
                                <meta
                                    property="twitter:image"
                                    content={nft.image_url.replace(
                                        'ipfs://',
                                        'https://ipfs.io/ipfs/',
                                    )}
                                />
                            </Head>
                        )}
                        {nft.animation_url && (
                            <Head>
                                <meta charSet="UTF-8" />
                                <title>{nft.name}</title>
                                <meta property="og:title" content={nft.name} />
                                <meta
                                    property="og:video"
                                    content={nft.animation_url.replace(
                                        'ipfs://',
                                        'https://ipfs.io/ipfs/',
                                    )}
                                />
                                <meta
                                    property="twitter:title"
                                    content={nft.name}
                                />
                                <meta
                                    property="twitter:video"
                                    content={nft.animation_url.replace(
                                        'ipfs://',
                                        'https://ipfs.io/ipfs/',
                                    )}
                                />
                            </Head>
                        )}
                        <Media data={nft} />
                    </div>
                </>
            )}
        </>
    )
}
