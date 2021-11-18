import React, { useState, useEffect } from 'react'

export default function Step1(props) {


    return (
        <>
        <div className="row">
                      <div className="col-12">
                        <h5>Main details</h5>
                      </div>
                      <div className="col-12 mb-3">
                          <label>Nft contract address</label>
                          <input type="text" className="form-control" name="contract_address" required/>
                      </div>
                      <div className="col-12 mb-3">
                      <label>Token ID</label>
                          <input type="text" className="form-control" name="token_id" required/>
                      </div>
                     
                      
                  </div>
        </>
    )
}

