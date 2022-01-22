import { Check } from 'phosphor-react'
import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Media(props) {
    const { data } = props

    useEffect(() => {
        const fetchData = async () => {
            if (data.token_uri !== null) {
                const result = await axios(
                    data.token_uri.replace('ipfs://', 'https://ipfs.io/ipfs/'),
                )
                data.extension.image = result.data.image
            }
        }
        if (
            data &&
            data.token_uri &&
            (!data.extension.image || data.extension.image == null)
        ) {
            fetchData()
        }
    }, [data])

    return (
        <>
            {data.image_url && (
                <img
                    src={data.image_url.replace(
                        'ipfs://',
                        'https://ipfs.io/ipfs/',
                    )}
                    loading="lazy"
                    className="card-img"
                    alt="..."
                />
            )}
            {!data.image_url && data.extension && data.extension.image && (
                <img
                    src={data.extension.image.replace(
                        'ipfs://',
                        'https://ipfs.io/ipfs/',
                    )}
                    loading="lazy"
                    className="card-img"
                />
            )}
            {data.extension && data.extension.animation_url && (
                <video
                playsInline=""
                    autoPlay=""
                    muted
                    loop
                    src={data.extension.animation_url.replace(
                        'ipfs://',
                        'https://ipfs.io/ipfs/',
                    )}
                    className="img-fluid"
                ></video>
            )}
        </>
    )
}
