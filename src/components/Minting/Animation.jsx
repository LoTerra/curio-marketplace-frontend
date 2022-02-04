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
                        <h3 className="mb-0">We are minting now...</h3>
                        <p className="text-muted">Please wait a few seconds for your nft</p>
                    </div>
                </div>
    )
}
