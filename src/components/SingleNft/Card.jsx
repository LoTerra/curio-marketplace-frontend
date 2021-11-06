import React, { useState, useEffect } from 'react'
import { useStore } from '../../store'
import Tilt from 'react-tilt'
import Countdown from './Countdown';



export default function Card(props) {
    const { state, dispatch } = useStore()

    const {index, data, nft, type, expiryTimestamp} = props;
    console.log("data-props")
    console.log(data)
    return (<>{ data &&
        <>
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
                <div className={'card bg-dark text-white nft-card ' + type} style={{background: 'url(' + '' + ')'}}>

                    <img src={nft ? nft.image : 'https://i.pinimg.com/736x/1d/00/6c/1d006cafea4ebb657e1bee4d38043569.jpg'} className="card-img" alt="..."/>

                    <div className="card-img-overlay">
                        <div className="d-flex h-100 w-100">
                            <div className="nft-info align-self-end w-100">
                                {type != 'xl' &&
                                (
                                    <>
                                        <h5 className="card-title m-0"></h5>
                                        <p className="m-0"></p>
                                    </>
                                )
                                }
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </Tilt>
        <Countdown expiryTimestamp={expiryTimestamp}/>        
    </>
}</>
    )
}