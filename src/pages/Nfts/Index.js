import React from 'react'
import { useStore } from '../../store'

export default () => {
    const { state, dispatch } = useStore()

    return (
        <>
            <h1>Test</h1>
        </>
    )
}
