import React, { useState, useEffect, useMemo } from 'react'
import { useTimer } from 'react-timer-hook'

export default function Animation(props) {
    const { minting } = props

    return (
        <div className={'minting d-flex' + (minting ? ' show' : '')}>
            <div className="align-self-center text-center w-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <h3 className="mb-0">Mint in progress...</h3>
                <p className="text-muted">
                    Minting process can take 30 Seconds to 1 Minute
                </p>
            </div>
        </div>
    )
}
