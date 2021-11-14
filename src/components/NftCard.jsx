import React, { useState, useEffect } from 'react'
import { useStore } from '../store'
import Tilt from 'react-tilt'
import { ArrowRight } from 'phosphor-react'
import SmallCountdown from './SmallCountdown'



export default function NftCard(props) {
    const { state, dispatch } = useStore()

    const {index, data, nft, type} = props;
    console.log("data-props")
    console.log(data)
    return (<>{ data &&
        <a href={'/nfts/' + data.auction_id}>
        <Tilt className="Tilt" options={{
            glare: true,
            maxGlare: .5,
            max: 10,
            scale: type == 'xl' ? 1.0 : 1.0,
            transition: true,
            reset: true,
            easing: "cubic-bezier(.03,.98,.52,.99)"
        }}>
            <div className="Tilt-inner">
                <div className={'card bg-dark text-white nft-card ratio ratio-1x1 ' + type} style={{background: 'url(' + '' + ')'}}>
                    <button className="btn btn-primary"><ArrowRight size={24} color={'#000'}/></button>
                   
                    { data.end_time > 0 &&
                        <SmallCountdown expiryTimestamp={data.end_time} />
                    }
                    
                    <img src={data.image_url} className="card-img" alt="..."/>

                    <div className="card-img-overlay">
                        <div className="d-flex h-100 w-100">
                            <div className="nft-info align-self-end w-100">
                                {type != 'xl' &&
                                (
                                    <>
                                        <h5 className="card-title m-0">{data.title}</h5>
                                        {/* <p className="m-0 text-muted">Highest bid: <strong>{data.highest_bid / 1000000} UST</strong></p>
                                        <p className="m-0 text-muted">Total bids: <strong>{data.total_bids}</strong></p>                                        */}
                                            
                                    </>
                                )
                                }
                                                               
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </Tilt>  
    </a>
}</>
    )
}