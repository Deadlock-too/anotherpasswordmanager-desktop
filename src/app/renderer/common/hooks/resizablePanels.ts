import { useEffect, useState } from 'react'
import { getResizeHandleElementsForGroup } from 'react-resizable-panels'

export const useMinPanelSizeHelper = (minPixelWidths: number[]) => {
  const [ minSize, setMinSize ] = useState(minPixelWidths.map(w => w / window.innerWidth * 100))
  useEffect(() => {
    const handleResize = () => {
      setMinSize(minPixelWidths.map(w => w / window.innerWidth * 100))
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return {
    minSize
  }
}

export const useHandleVisibilityManager = (groupId: string) => {
  useEffect(() => {
    const handles = getResizeHandleElementsForGroup(groupId)
    const handleVisibility = (e) => {
      handles.forEach(handle => {
        if (handle.getAttribute('data-resize-handle-state') === 'drag') return

        const rect = handle.getBoundingClientRect()
        const distX = Math.max(0, Math.abs(e.clientX - rect.left) - rect.width)
        const distY = Math.max(0, Math.abs(e.clientY - rect.top) - rect.height)
        const dist = Math.sqrt(distX ** 2 + distY ** 2)

        if (dist <= 7) {
          handle.style.opacity = '100'
        } else {
          handle.style.opacity = '0'
        }
      })
    }
    const handleMouseUp = (e) => {
      const rect = window.document.body.getBoundingClientRect()
      if (!(e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom)) {
        handles.forEach(handle => {
          handle.style.opacity = '0'
        })
      }
    }

    window.addEventListener('mousemove', handleVisibility)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleVisibility)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  })
}