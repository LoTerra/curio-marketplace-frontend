import React, { useEffect, useState } from 'react'
import axios from 'axios';
import NftCard from '../../components/NftCard';
import CollectionHeading from './CollectionHeading';
import MainLoader from '../../components/Loaders/MainLoader';
import { ArrowLeft } from 'phosphor-react';
import {  
    Link,
    useParams
  } from "react-router-dom";

export default (props) => {

    const [collectionItems, setCollectionItems] = useState([]);
    const [loading, setLoading] = useState(true)
    let { collectioncontract } = useParams();
    useEffect( ()=> {
        (async () => {
   
         
        setLoading(true)
        var config = {
            method: 'get',
            url: 'https://privilege.digital/api/get-items',
            params: {
                nftContract: collectioncontract,
                inAuction: Date.now()
            },
        }

        await axios(config)
            .then(function (response) {
                console.log(response)
                setCollectionItems(response.data.filterItems)
            });
            setLoading(false)
        })();
    },[])

    return (
        <>
            <section className="nfts-big" style={{minHeight:'100vh'}}>                
                <div className="container-fluid">    
                <div className={'collection-banner'}>        
                                <div className={'row'}>
                                    <div className="col-md-6">
                                        { collectioncontract &&
                                    <CollectionHeading contractAddress={collectioncontract} />                                   
                                        }
                                    </div>
                                </div>
                    </div>                
                </div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                        <Link
                                    to="/"
                                    className="btn btn-secondary btn-sm mb-3 px-0 py-2 text-center text-md-start"
                                    style={{
                                        fontWeight: 300,
                                        display: 'block',
                                        opacity: 0.5,
                                        background: 'transparent',
                                    }}
                                >
                                    <ArrowLeft
                                        size={16}
                                        style={{
                                            position: 'relative',
                                            top: '-1px',
                                        }}
                                    />{' '}
                                    Back to home
                                </Link>
                        </div>
                    { collectionItems && collectionItems.map((obj, id) => {
                        return (
                            <div className={'col-md-4 col-lg-3'}>
                                <NftCard
                                    key={id}
                                    data={obj}
                                    auctionsData={[]}
                                    type={'small'}
                                    index={99}
                                />
                            </div>
                        )
                     })}
                     { collectionItems.length == 0 &&
                        <p className="w-100 py-3 text-center" style={{opacity:0.6}}>No auctions found for this collection</p>
                     }
                    </div>                    
                </div>
            </section>
            <MainLoader loading={loading}/>
        </>
    )
}
