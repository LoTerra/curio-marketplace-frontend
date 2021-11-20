import React, { useState, useEffect, useRef } from 'react'

export default function Step1(props) {

      const [contractAddress, setContractAddress] = useState('');
      const [tokenId, setTokenId] = useState('');

      const isValidated = () => {
        console.log('isValidate called');
        if (contractAddress !== '') {
          return true;
        }
        
        return false;
      }


  
     
    return (
        <>
        <div className="row">
                      <div className="col-12">
                        <h5>Main details</h5>
                      </div>
                      <div className="col-12 mb-3">
                          <label>Nft contract address</label>

                          <input type="text"                       
                          value={contractAddress}
                          onChange={(e) => setContractAddress(e.target.value)}
                          className="form-control"
                          name="contract_address"
                          required/>                    
                      </div>
                      <div className="col-12 mb-3">
                      <label>Token ID</label>
                          <input type="text"
                          onChange={(e) => setTokenId(e.target.value)}
                          value={tokenId}              
                          className="form-control"
                          name="token_id"
                          required/>
                         
                      </div>
                     
                      
                  </div>
        </>
    )
}

