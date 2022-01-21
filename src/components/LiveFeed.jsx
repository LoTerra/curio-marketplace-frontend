import React, { useState, useEffect, useMemo } from 'react'
import numeral from 'numeral';
import { Rss, X } from 'phosphor-react';
import {useStore} from "../store";

export default function LiveFeed(props) {
    const { state, dispatch } = useStore()
    let { data } = props
    const [toggle,setToggle] = useState(false)
    const [change,setChange] = useState(false)
    let data_update = [];

    useEffect(() => {
        console.log("window.sessionStorage.get")
        console.log(window.sessionStorage.getItem("liveFeed"))
        if (typeof(Storage) !== "undefined") {
            data_update = [...data, window.sessionStorage.getItem("liveFeed")]
        }
            if(data_update && data_update.length > 0){
                if(!change){          
                    setChange(true);
                    setTimeout(() => {
                        setChange(false);
                    },3000)
                }
            }
        
    },[data])
   

    return (
        <>
            <button className={"live-feed-toggle" + (change ? ' new' : '')} onClick={() => setToggle(!toggle)}><span>{data_update && data_update.length > 0 ? data.length : 0}</span>Live feed</button>
            <div className={"live-feed-screen" + (toggle ? ' show' : '')}>
                <div className="live-feed-screen-body h-100">
                    <X size={24} className="float-end" onClick={() => setToggle(!toggle)}/>
                    <h3>Live feed</h3>
                { data_update && data_update.length > 0 && data_update.map( a => {
                    //console.log(JSON.parse(a.obj))
                    let obj = JSON.parse(a.obj)
                    return (<li>
                        <div className="image">
                            <img src={obj.image_url}/>
                        </div>
                        <div className="information">
                            <p className="type">New bid</p>
                            <p className="title">{obj.title}</p>
                            <p className="price">{numeral(obj.highest_bid / 1000000).format('0,0.00')} UST</p>                        
                        </div>          
                        <a href={'/nfts/'+obj.auction_id} className="btn btn-secondary btn-sm w-100">View Auction</a>              
                    </li>)
                })}
                { data_update && data_update.length == 0 &&
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
