import React, { useState, useEffect, useMemo } from 'react'
import { useTimer } from 'react-timer-hook'

export default function MainLoader(props) {
    const { loading } = props

    return (
        <div
            className={
                'nft-loader h-100 text-center d-flex ' +
                (loading && loading ? 'show' : '')
            }
        >
            <div className="align-self-center w-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    )
}
