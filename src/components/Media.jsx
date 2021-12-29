import { Check } from 'phosphor-react';
import React, { useState, useEffect } from 'react'
import axios from 'axios';

export default function Media(props) {

    const {data} = props;


    useEffect(() => {

        const fetchData = async () => {
            const result = await axios(
                data.token_uri.replace('ipfs://','https://ipfs.io/ipfs/'),
            );
      
            data.extension.image = result.data.image
          };
          if(data && data.token_uri && (!data.extension.image || data.extension.image == null)){
            fetchData()
          }
    },[data])


    return (
        <>             
        {data.image_url && (<img
        src={data.image_url}
        className="card-img"
        alt="..."
        />)}
        {data.extension && data.extension.image && (                          
        <img src={data.extension.image.replace('ipfs://','https://ipfs.io/ipfs/')} className="card-img"/>
        )}
        {data.extension && data.extension.animation_url && (                                                                
        <video playsinline="" autoplay="" muted loop src={data.extension.animation_url.replace('ipfs://','https://ipfs.io/ipfs/')} className="img-fluid"></video>

        )}
        </>
    )

}
