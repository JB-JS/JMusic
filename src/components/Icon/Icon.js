import React from 'react'
import * as svg from './svg'

const Icon = ({ name, ...opts }) => {
  return React.createElement(svg[name], { ...opts })
}

export default Icon
