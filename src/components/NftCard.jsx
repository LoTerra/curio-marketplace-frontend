import React, { useState, useEffect } from 'react'
import { useStore } from '../store'
import NftModal from './NftModal'
import Tilt from 'react-tilt'



export default function NftCard(props) {
    const { state, dispatch } = useStore()

    const {index} = props;

    return (
        <div className="col-md-4">
          <Tilt className="Tilt" options={{ glare: true,maxGlare: .5,max : 20, scale:1.05, transition:true, reset:true, easing:"cubic-bezier(.03,.98,.52,.99)" }}>
          <div className="Tilt-inner">
           <div className="card" >
               <div className="card-brand" style={{background:'url(/img/brand.png)'}}>                   
               </div>
               <div className="card-body">
                    <div className="nft-art" style={{background:'url(/img/bull.png)'}}>

                    </div>
                    <div className="nft-counter d-flex">
                        <p className="align-self-center w-100">00:00:00:00</p>
                    </div>
               </div>
               <div className="card-footer">
                   <button className="btn btn-primary w-100" data-bs-toggle="modal" data-bs-target={'#nft'+index}>Buy tickets</button>
               </div>
           </div>
           </div>
           </Tilt>
           <NftModal index={index} bg={'/img/cardbg.png'} nft={'url(/img/bull.png)'}/>
        </div>
    )
}