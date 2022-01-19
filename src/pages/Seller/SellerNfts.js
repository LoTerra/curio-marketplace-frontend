import React, { useEffect, useState } from 'react'
import axios from 'axios';
import ContractVerification from '../../components/ContractVerification';
import NftCard from '../../components/NftCard';
import { useStore } from '../../store';
import MainLoader from '../../components/Loaders/MainLoader';

export default (props) => {
    const { state, dispatch } = useStore()

    const [sellerNfts, setSellerNfts] = useState([]);
    const [loading, setLoading] = useState(true)

    useEffect(async ()=> {
        setLoading(true)
        var config = {
            method: 'get',
            url: 'https://privilege.digital/api/get-items',
            params: {
                creatorAddress: props.sellerAddress,
                inAuction: Date.now()
            },
        }

        await axios(config)
            .then(function (response) {
                console.log(response)
                setSellerNfts(response.data.filterItems)
            });
            setTimeout(() => {
                setLoading(false)
            },1000)
    },[])

    return (
        <>
            <section className="nfts-big" style={{minHeight:'100vh'}}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-10 intro mx-auto text-center">
                            { props.sellerAddress &&
                                <h1>
                                { props.sellerAddress && props.sellerAddress == state.wallet.walletAddress ?
                                    <span>Your Auctions</span>
                                    :
                                    <span>Creator Auctions <span style={{display:'block',fontSize:'14px', fontWeight:400}}>{props.sellerAddress}</span></span>
                                }                                
                                </h1>
                            }
                                           
                        </div>
                      
                    </div>
                </div>
                <div className="container-fluid">
                    <div className="row">
                    { sellerNfts && sellerNfts.map((obj, id) => {
                        return (
                            <div className={'col-md-3'}>
                                <NftCard
                                    key={id}
                                    data={obj}
                                    auctions={[]}
                                    type={'small'}
                                    index={99}
                                />
                            </div>
                        )
                     })}
                    </div>                    
                </div>
            </section>
            <MainLoader loading={loading}/>

        </>
    )
}
