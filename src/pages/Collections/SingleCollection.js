import React, { useEffect, useState } from 'react'
import axios from 'axios';
import NftCard from '../../components/NftCard';
import CollectionHeading from './CollectionHeading';
import MainLoader from '../../components/Loaders/MainLoader';

export default (props) => {

    const [collectionItems, setCollectionItems] = useState([]);
    const [loading, setLoading] = useState(true)

    useEffect(async ()=> {
        setLoading(true)
        var config = {
            method: 'get',
            url: 'https://privilege.digital/api/get-items',
            params: {
                nftContract: props.collectionContract,
            },
        }

        await axios(config)
            .then(function (response) {
                console.log(response)
                setCollectionItems(response.data.filterItems)
            });
            setLoading(false)
    },[])

    return (
        <>
            <section className="nfts-big" style={{minHeight:'100vh'}}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-10 intro mx-auto text-center">
                            <h1>
                                <CollectionHeading contractAddress={props.collectionContract} />
                            </h1>
                            <p className="badge">BETA MODE</p>                            
                        </div>
                      
                    </div>
                </div>
                <div className="container-fluid">
                    <div className="row">
                    { collectionItems && collectionItems.map((obj, id) => {
                        return (
                            <div className={'col-md-3'}>
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
