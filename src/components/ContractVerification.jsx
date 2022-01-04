import { CheckCircle, WarningCircle } from 'phosphor-react'
import React, { useState, useEffect, useMemo } from 'react'
import contractData from '../contracts.json'

export default function ContractVerification(props) {

    const {contractAddress} = props;

    const verifyAddress = (address) => {
        let contracts_json = JSON.parse(JSON.stringify(contractData))
        let data =  JSON.parse(JSON.stringify(contracts_json['mainnet']))
        let verified = {icon: '', name: ''};



        Object.values(data).forEach(obj => {
            Object.values(obj).forEach(a => {
                if(a.contract == address){
                    verified.icon = a.icon
                    verified.name = a.name
                }
            })
        })
        
        if(verified.name === ''){
            return (
                <>
                  <p style={{
                    fontSize:'14px'
                }}><WarningCircle size={16}/>Unverified contract</p>
                <span style={{
                    fontWeight:400
                }}>{address}</span>
                </>
            );
        } else {
            return (
                <>
                <p style={{
                    fontSize:'14px'
                }}><CheckCircle size={16}/>{verified.name}</p>
                <img src={verified.icon} className="me-1 rounded-border" width="25" height="25"/> 
                <span style={{
                    fontWeight:400
                }}>{address}</span>
                </>
            );
        }
        

    }


    return (
        <>
        { contractAddress && 
            <div className="contract-verification">
            <p style={{
                        fontSize:'14px',
                        color:'#fff',
                        opacity:0.6
                    }}>{verifyAddress(contractAddress)}</p>
        </div>
        }
        </>
    )
}
