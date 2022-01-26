import { CheckCircle, WarningCircle } from 'phosphor-react'
import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import contractData from '../contracts.json'

export default function ContractVerification(props) {
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
                            fontSize: '14px',
                        }}
                    >
                        <WarningCircle size={16} />
                        Unverified contract
                    </p>
                    <span
                        style={{
                            fontWeight: 400,
                        }}
                    >
                        {address}
                    </span>
                </>
            )
        } else {
            return (
                <>
                    <p
                        style={{
                            fontSize: '14px',
                        }}
                    >
                        <CheckCircle size={16} />
                        {verified.name}
                    </p>
                   
                    <Link
                    className="btn btn-simple mt-2 btn-sm"
                    to={'/collection/'+contractAddress} >
                        View more                      
                        </Link>
                </>
            )
        }
    }

    return (
        <>
            {contractAddress && (
                <div className="contract-verification">
                    <p
                        style={{
                            fontSize: '14px',
                            color: '#fff',                    
                        }}
                    >
                        {verifyAddress(contractAddress)}
                    </p>
                </div>
            )}
        </>
    )
}
