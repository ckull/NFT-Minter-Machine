import React from 'react'
import Flexbox from 'flexbox-react'

const AppBar = (props) => {
    return (
        <Flexbox id="app-bar" justifyContent='flex-end'>
            { props.children }
        </Flexbox>
    )
}

export default AppBar