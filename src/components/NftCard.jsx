import React, { useState, useEffect } from 'react'
import { useStore } from '../store'
import NftModal from './NftModal'
import Tilt from 'react-tilt'
import { ArrowRight } from 'phosphor-react'
import SmallCountdown from './SmallCountdown'



export default function NftCard(props) {
    const { state, dispatch } = useStore()

    const {index, data, nft, type} = props;
    console.log("data-props")
    console.log(data)
    return (<>{ data &&
        <a href={'/nfts/' + data[0]}>
        <Tilt className="Tilt" options={{
            glare: true,
            maxGlare: .5,
            max: 20,
            scale: type == 'xl' ? 1.0 : 1.05,
            transition: true,
            reset: true,
            easing: "cubic-bezier(.03,.98,.52,.99)"
        }}>
            <div className="Tilt-inner">
                <div className={'card bg-dark text-white nft-card ratio ratio-1x1 ' + type} style={{background: 'url(' + '' + ')'}}>
                    <button className="btn btn-primary"><ArrowRight size={24} color={'#000'}/></button>
                    <img src={nft ? nft.image : 'https://i.pinimg.com/736x/1d/00/6c/1d006cafea4ebb657e1bee4d38043569.jpg'} className="card-img" alt="..."/>

                    <div className="card-img-overlay">
                        <div className="d-flex h-100 w-100">
                            <div className="nft-info align-self-end w-100">
                                {type != 'xl' &&
                                (
                                    <>
                                        <h5 className="card-title m-0">{data[1].nft_id}</h5>
                                        <p className="m-0 text-muted">Highest bid: <strong>{data[1].highest_bid / 1000000} UST</strong></p>
                                        <p className="m-0 text-muted">Total bids: <strong>{data[1].total_bids}</strong></p>                                       
                                            
                                    </>
                                )
                                }
                                <SmallCountdown expiryTimestamp={data[1].end_time} />                                      
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </Tilt>
        <NftModal index={index} data={data}/>
    </a>
}</>
    )
}