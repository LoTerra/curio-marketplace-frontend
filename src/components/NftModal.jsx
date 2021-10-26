import React, { useState, useEffect } from 'react'
import { useStore } from '../store'

export default function NftModal(props) {
    const {index,data} = props;
    const { state, dispatch } = useStore()


    return (
      <div className="modal nft-modal fade" id={'nft'+index} tabIndex="-1" aria-labelledby={'nftlabel'+index} aria-hidden="true">
         <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content" style={{background:'url('+data.bg+')'}}>
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">{data.name}</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">        
        <div className="row">
            <div className="col-12">
              <div className="nft-art" style={{background:'url('+data.art+')'}}>
              </div>
              <div className="nft-counter d-flex">
                        <p className="align-self-center w-100">00:00:00:00</p>
                    </div>
              </div>
              {/* <div className="col-md-4 mt-3">
                  <p className="title">Rules:</p>
                  <ul>
                    <li>Max 100 tickets</li>
                    <li>X amount of X</li>
                    <li>Another rule we made</li>
                  </ul>
              </div> */}
              <div className="col-md-12 mt-3">
                  <p className="title">Description:</p>
                  <p>{data.desc}</p>
              </div>
           
        </div>
      </div>
      <div className="modal-footer">
        <div className="btn-group w-100">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" className="btn btn-primary">Buy tickets</button>
        </div>
      </div>
    </div>
  </div>
      </div>
    )
}