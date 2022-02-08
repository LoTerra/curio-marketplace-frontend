import React, { useState, useEffect, useMemo } from 'react'
import numeral from 'numeral';
import { Rss, X } from 'phosphor-react';
import {useStore} from "../store";
import { Link } from 'react-router-dom';

export default function LiveFeed(props) {
    const { state, dispatch } = useStore()
    let { data } = props
    const [toggle,setToggle] = useState(false)
    const [change,setChange] = useState(false)


    useEffect(() => {
        console.log("$2$")
        console.log(state.liveFeed)
        if(state.liveFeed && state.liveFeed.length > 0){
            if(!change){
                setChange(true);
                setTimeout(() => {
                    setChange(false);
                },3000)
            }
        }
        
    },[state.liveFeed])
   

    return (
        <>
            <button className={"live-feed-toggle" + (change ? ' new' : '')} onClick={() => setToggle(!toggle)}><span>{state.liveFeed && state.liveFeed.length > 0 ? state.liveFeed.length : 0}</span>Live feed</button>
            <div className={"live-feed-screen" + (toggle ? ' show' : '')}>
                <div className="live-feed-screen-body h-100">
                    <X size={24} className="float-end" onClick={() => setToggle(!toggle)}/>
                    <h3>Live feed</h3>
                { state.liveFeed && state.liveFeed.length > 0 && state.liveFeed.map( a => {
                    //console.log(JSON.parse(a.obj))
                    let obj = a.auction[0]
                    return (<li>
                        <div className="image">
                            <img src={obj.image_url}/>
                        </div>
                        <div className="information">
                            <p className="type">New bid</p>
                            <p className="title">{obj.title}</p>
                            <p className="price">{numeral(obj.highest_bid / 1000000).format('0,0.00')} UST</p>                        
                        </div>    
                        <Link to={`/token/${ obj.auction_id }`} className="btn btn-secondary btn-sm w-100">
                       View Auction</Link>              
                    </li>)
                })}
                { state.liveFeed && state.liveFeed.length == 0 &&
                    <div className=" align-self-center mx-auto py-4 text-center opacity-50">
                        <Rss size={45}/>
                    <p>No items found yet</p>
                    </div>
                }
                </div>
            </div>
        </>
    )
}
