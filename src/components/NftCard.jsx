import React, { useState, useEffect } from 'react'
import { useStore } from '../store'
import NftModal from './NftModal'
import Tilt from 'react-tilt'



export default function NftCard(props) {
    const { state, dispatch } = useStore()

    const {index, data, nft, type} = props;

    return (
        
          <a href={'/nfts/'+data.id}>              
          <Tilt className="Tilt" options={{ glare: true,maxGlare: .5,max : 20, scale:type == 'xl' ? 1.0 : 1.05, transition:true, reset:true, easing:"cubic-bezier(.03,.98,.52,.99)" }}>
          <div className="Tilt-inner">
           <div className={'card bg-dark text-white nft-card ' + type} style={{background:'url('+data.bg+')'}}>
           
                 <img src={nft ? nft.image : data.art} className="card-img" alt="..."/>

            <div className="card-img-overlay">
                <div className="d-flex h-100 w-100">
                    <div className="nft-info align-self-end w-100">
                        { type != 'xl' &&
                        (
                            <>
                        <h5 className="card-title m-0">{data.name}</h5>    
                        <p className="m-0">Author name</p>    
                        </>
                        )
                        }
                    </div>
                </div>
            </div>

         
           </div>
           </div>
           </Tilt>
           <NftModal index={index} data={data}/>
          </a>
        
    )
}