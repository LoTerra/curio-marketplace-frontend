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
     
        </>
    )
}

