import React, { useState, useEffect, useRef } from 'react'

export default function Step1(props) {

      const [state,setState] = useState({
        contract_address: '',
        token_id:''
    })
  
      let validateOnDemand = true; // this flag enables onBlur validation as user fills forms

      const contract_address = useRef(null);
      const token_id = useRef(null);


      const isValidated = () =>  {
        const userInput = grabUserInput(); // grab user entered vals
        const validateNewInput = validateData(userInput); // run the new input against the validator
        let isDataValid = false;
    
        // if full validation passes then save to store and pass as valid
        if (Object.keys(validateNewInput).every((k) => { return validateNewInput[k] === true })) {          
            isDataValid = true;
        }
        else {
            // if anything fails then update the UI validation state but NOT the UI Data State
            setState(Object.assign(userInput, validateNewInput, validationErrors(validateNewInput)));
        }
    
        return isDataValid;
      }
      const validationCheck = () => {
        if (validateOnDemand)
          return;
    
        const userInput = grabUserInput(); // grab user entered vals
        console.log(userInput)
        const validateNewInput = validateData(userInput); // run the new input against the validator
    
        setState(Object.assign(userInput, validateNewInput, validationErrors(validateNewInput)));
        return;
      }

      const validateData = (data) => {
        return  {
          contract_addressVal: (data.contract_address != 0), // required: anything besides N/A
          token_idVal: (data.token_id != 0), // required: regex w3c uses in html5
        }
      }

      const validationErrors = (val) => {
        const errMsgs = {
            contract_addressValMsg: val.contract_addressVal ? '' : 'A gender selection is required',
            token_idValMsg: val.token_idVal ? '' : 'A valid email is required'
        }
        return errMsgs;
      }

      const grabUserInput = () => {
          console.log(contract_address.current)
        return {
            contract_address: contract_address.current,
            token_id: token_id.current
        };
      }

      let notValidClasses = {};

    if (typeof state.contract_addressVal == 'undefined' || state.contract_addressVal) {
      notValidClasses.contract_addressCls = 'no-error col-md-8';
    }
    else {
       notValidClasses.contract_addressCls = 'has-error col-md-8';
       notValidClasses.contract_addressValGrpCls = 'val-err-tooltip';
    }

    if (typeof state.token_idVal == 'undefined' || state.token_idVal) {
        notValidClasses.token_idCls = 'no-error col-md-8';
    }
    else {
       notValidClasses.token_idCls = 'has-error col-md-8';
       notValidClasses.token_idValGrpCls = 'val-err-tooltip';
    }

    return (
        <>
        <div className="row">
                      <div className="col-12">
                        <h5>Main details</h5>
                      </div>
                      <div className="col-12 mb-3">
                          <label>Nft contract address</label>
                          <input type="text" ref={contract_address} defaultValue={state.contract_address} onBlur={() => validationCheck} className="form-control" name="contract_address" required/>
                          <div className={notValidClasses.contract_addressValGrpCls}>{state.contract_addressValMsg}</div>
                      </div>
                      <div className="col-12 mb-3">
                      <label>Token ID</label>
                          <input type="text" ref={token_id} defaultValue={state.token_id} onBlur={() => validationCheck} className="form-control" name="token_id" required/>
                          <div className={notValidClasses.genderValGrpCls}>{state.token_idValMsg}</div>
                      </div>
                     
                      
                  </div>
        </>
    )
}

