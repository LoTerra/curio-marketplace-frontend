import { CheckCircle, WarningCircle } from 'phosphor-react'
import React, { useState, useEffect, useMemo } from 'react'
import contractData from '../../contracts.json'

export default function CollectionHeading(props) {
    const { contractAddress } = props

    const verifyAddress = (address) => {
        let contracts_json = JSON.parse(JSON.stringify(contractData))
        let data = JSON.parse(JSON.stringify(contracts_json['mainnet']))
        let verified = { icon: '', name: '' }

        Object.values(data).forEach((obj) => {
            Object.values(obj).forEach((a) => {
                if (a.contract == address) {
                    verified.icon = a.icon
                    verified.name = a.name
                }
            })
        })

        if (verified.name === '') {
            return (
                <>
                    <p
                        style={{
                            fontSize: '18px',
                            marginBottom:0
                        }}
                    >
                        <WarningCircle size={16} />
                        Unverified contract
                        <small
                                            className="d-block mt-3"
                                            style={{
                                                opacity: 0.6,
                                                color: '#fff',
                                                fontSize: '13px',
                                                display:'block'
                                            }}
                                        >
                                            Contract not verified? Contact us on{' '}
                                            <a
                                                href="https://t.me/curio_nft"
                                                className="text-white"
                                            >
                                                Telegram
                                            </a>
                                        </small>
                    </p>
                    <span
                        style={{
                            fontWeight: 400,
                            fontSize:'21px'
                        }}
                    >
                        {address}
                    </span>
                </>
            )
        } else {
            return (
                <>
                 <img
                        src={verified.icon}
                        className="me-1 rounded-border"

                    />
                    <h1>       
                        {verified.name}
                    </h1>                   
                    
                </>
            )
        }
    }

    return (
        <>
            {contractAddress && (
                <div className="collection-verification">                   
                        {verifyAddress(contractAddress)}               
                </div>
            )}
        </>
    )
}
