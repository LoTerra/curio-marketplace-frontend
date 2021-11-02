import React, { useState, useEffect } from 'react'
import { useStore } from '../store'

export default function CreateNft(props) {

    const { state, dispatch } = useStore()

    return (
        <div class="modal fade" id="createNftModal" tabindex="-1" aria-labelledby="createNftModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="createNftModalLabel">Create NFT</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              ...
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>
    )
}