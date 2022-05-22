import { useCallback, useEffect, useState } from 'react'

export default function useContextMenu() {
  const [contextMenu, setContextMenu] = useState({
    show: false,
    itemId: null,
    resourceId: null,
    x: 0,
    y: 0,
    offsetWidth: 0,
    overX: false,
  })

  const onShow = useCallback((e, resourceId) => {
    const rect = e.target.getBoundingClientRect()
    console.log(rect)

    setContextMenu((prevState) => ({
      ...prevState,
      x: rect.x,
      y: rect.y + rect.height,
    }))

    setContextMenu((prevState) => ({
      ...prevState,
      show: true,
      itemId: e.target.dataset.id,
      resourceId,
    }))
  }, [])

  const onClose = useCallback(() => {
    setContextMenu((prevState) => ({ ...prevState, show: false }))
  }, [])

  const measuredRef = useCallback((node) => {
    if (node !== null) {
      setContextMenu((prevState) => ({
        ...prevState,
        offsetWidth: node.offsetWidth,
      }))
    }
  }, [])

  useEffect(() => {
    console.log('re rendering')

    contextMenu.offsetWidth + contextMenu.x > window.innerWidth &&
      setContextMenu((prevState) => ({ ...prevState, overX: true }))
  }, [contextMenu.x, contextMenu.offsetWidth])

  return { contextMenu, onShow, onClose, measuredRef }
}
