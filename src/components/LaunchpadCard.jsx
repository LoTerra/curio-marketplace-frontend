import { Clock, Flag, Rocket, flag } from 'phosphor-react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Media from './Media'

export default function LaunchpadCard(props) {
    const { a, link } = props

    const formatDate = (date) => {
        let formatted = new Date(date * 1000)
        return formatted.toLocaleString()
    }

    return (
        <div className="col-lg-3">
            {link ? (
                <Link
                    to={'/mint/' + a.launchpad_contract}
                    className="card text-white nft-card ratio ratio-1x1"
                >
                    <Media data={{ image_url: a.background_image }} />
                    <div className="card-img-overlay">
                        <div className="d-flex h-100 w-100">
                            <div className="nft-info align-self-end w-100">
                                <h5 className="card-title m-0">{a.title}</h5>
                                <p className="m-0" style={{ opacity: 0.8 }}>
                                    <Clock
                                        className={'me-1'}
                                        size={16}
                                        weight={'bold'}
                                    />
                                    {formatDate(a.opening_time)}
                                </p>
                                <p className="m-0" style={{ opacity: 0.8 }}>
                                    <Flag
                                        className={'me-1'}
                                        size={16}
                                        weight={'bold'}
                                    />
                                    {formatDate(a.closing_time)}
                                </p>
                            </div>
                        </div>
                    </div>
                </Link>
            ) : (
                <a className="card text-white nft-card ratio ratio-1x1">
                    <Media data={{ image_url: a.background_image }} />
                    <div className="card-img-overlay">
                        <div className="d-flex h-100 w-100">
                            <div className="nft-info align-self-end w-100">
                                <h5 className="card-title m-0">{a.title}</h5>
                                <p className="m-0" style={{ opacity: 0.8 }}>
                                    <Rocket
                                        className={'me-1'}
                                        size={16}
                                        weight={'bold'}
                                    />
                                    {formatDate(a.opening_time)}
                                </p>
                            </div>
                        </div>
                    </div>
                </a>
            )}
        </div>
    )
}
