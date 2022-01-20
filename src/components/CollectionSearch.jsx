import React, { useState, useEffect, useMemo,Component  } from 'react'
import Select from 'react-select'
import axios from 'axios'
import numeral from 'numeral'

import contractData from '../contracts.json'

const contracts_json = JSON.parse(JSON.stringify(contractData))
const data = JSON.parse(JSON.stringify(contracts_json["mainnet"]))

export default function CollectionSearch(props) {

    const [collections,setCollections] = useState([])
    const [collectionStats,setCollectionStats] = useState([])
    const [loading,setLoading] = useState(true)
      
  
   
        useEffect(async()=>{
            console.log('select loaded')
            const stats = await axios.get('https://privilege.digital/api/get-info-collections');
            setCollectionStats(collectionStats => (
                [...collectionStats,stats.data.infoCollections]
            ))
            console.log(stats.data.infoCollections)

            const obj_stats = (address) => stats.data.infoCollections.find((a) => {
                // console.log(a)
                return a._id == address
            })
        Object.values(data).forEach((obj) => {
            Object.values(obj).forEach((a) => {
                const stats = obj_stats(a.contract);
                console.log(stats)

                const auction_count = stats ? stats.elements : 0;
                const price_floor = stats ? stats.price_floor : 0;
                const highest_bid = stats ? stats.highest_bid : 0;

                const label_html = `<div class="collection-img">
                <img src="`+a.icon+`"/></div>
                <div class="collection-info"><span>`+a.name+`</span>
                <span>Auctions: `+auction_count+`, Floor: `+numeral(price_floor / 1000000).format('0,0.00')+`, Highest bid: `+numeral(highest_bid / 1000000).format('0,0.00')+`</span>
                <div>`
                setCollections(collections => [...collections,
                    {
                    value:a.contract,
                    label:label_html,
                    price_floor:price_floor,
                    auction_count:auction_count,
                    highest_bid:highest_bid
                }])
                
                // if (a.contract == address) {
                //     verified.icon = a.icon
                //     verified.name = a.name
                // }
            })
        })        
        setLoading(false) 
        },[])

    


    return (
    <>
    { !loading && collections.length > 0 &&
        <Select className="ui-select" placeholder={'Search Collections...'}
        onChange={(data) =>{
            //console.log(data)
            if(data.value){
                window.location.href = window.location.protocol + "//" + window.location.host + "/" + 'collection/' + data.value
            }
        }}
        formatOptionLabel={function(data) {
            return (
              <span dangerouslySetInnerHTML={{ __html: data.label }} />
            );
          }} defaultValue={''} isSearchable={true} isClearable={true} options={collections.sort((a,b) => { return b.auction_count - a.auction_count;})}  classNamePrefix={'ui-select'}/>       
    }     
    </>        
    )
}
