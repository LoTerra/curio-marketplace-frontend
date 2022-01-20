import { CheckCircle, WarningCircle } from 'phosphor-react'
import React, { useState, useEffect, useMemo } from 'react'
import contractData from '../../contracts.json'
import axios from 'axios'
import numeral from 'numeral'

export default function CollectionHeading(props) {
    const { contractAddress } = props
    const [auctionStats, setAuctionStats] = useState()

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
                        className="rounded-border"
                    />
                    <h1>       
                        {verified.name}
                        <span style={{display:'block', fontSize:'14px', fontWeight:'300'}}>Auctions: {auctionStats.auction_count}, Floor: {numeral(auctionStats.price_floor / 1000000).format('0,0.00')} UST</span>
                    </h1>                   
                    
                </>
            )
        }
    }

    useEffect(async()=>{

        console.log('select loaded')
        const stats = await axios.get('https://privilege.digital/api/get-info-collections');
        console.log(stats.data.infoCollections)

        const obj_stats = (address) => stats.data.infoCollections.find((a) => {
            // console.log(a)
            return a._id == address
        })

        const stats_data = obj_stats(contractAddress);
        console.log(stats_data)

        const auction_count = stats_data ? stats_data.elements : 0;
        const price_floor = stats_data ? stats_data.price_floor : 0;        

        setAuctionStats(
            {
            price_floor:price_floor,
            auction_count:auction_count
            })

    },[])

    return (
        <>
            {contractAddress && auctionStats && (
                <div className="collection-verification">                   
                        {verifyAddress(contractAddress)}               
                </div>
            )}
        </>
    )
}
