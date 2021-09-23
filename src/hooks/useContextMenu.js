import { useCallback, useEffect, useState } from 'react'

export default function useContextMenu(ref, playlistId) {
  const [contextMenu, setContextMenu] = useState({
    show: false,
    itemId: null,
    resourceId: null,
    x: 0,
    y: 0,
  })

  const [over, setOver] = useState({
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

  useEffect(() => {
    console.log('re rendering')

    ref.current &&
      ref.current.offsetWidth + contextMenu.x > window.innerWidth &&
      setOver({ overX: true })
  }, [ref, contextMenu.x])

  return { contextMenu, onShow, onClose, over }
}
