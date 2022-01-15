import React, { useEffect, useState } from 'react'
import axios from 'axios';

export default (props) => {

    const [collectionItems, setCollectionItems] = useState([]);

    useEffect(async ()=> {
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
                setCollectionItems(result.data.filterItems)
            });
    },[])

    return (
        <>
            <section className="nfts-big" style={{minHeight:'100vh'}}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-10 intro mx-auto text-center">
                            <h1>
                                
                            </h1>
                            <p className="badge">BETA MODE</p>
                            <p className="slogan">
                                Choosing to sell your NFTs at curio.art means
                                that bidders from around the world can bid
                                online for them.
                            </p>
                        </div>
                        <div className="col-md-10 mx-auto">
                    
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
