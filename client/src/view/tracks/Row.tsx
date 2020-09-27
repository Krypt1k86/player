import React, { useCallback } from 'react'
import { joinClasses } from '../../utils/lib'
import { API } from '../../types'

interface RowProps {
  loaded: boolean
  isCurrentTrack: boolean
  animationDelay: number
  track: API.Track
  style: Record<string, string>
  setTrack: (track: string) => void
}

export default function Row(props: RowProps) {
  const { track, loaded, setTrack, animationDelay, style } = props

  const handleSetTrack = useCallback(() => setTrack(track.url), [setTrack])

  const classes = joinClasses(
    !loaded ? style.animate : '',
    props.isCurrentTrack ? style.active : ''
  )

  return (
    <tr
      key={track.title}
      className={classes}
      style={{
        animationDuration: `${animationDelay}s`,
      }}
    >
      <td className={style['action-play']} onClick={handleSetTrack}>
        {track.title}
      </td>
      <td>{track.artist}</td>
      <td>{track.album?.slice(0, 10)}</td>
      <td>{track.year}</td>
      <td>{track.genre}</td>
    </tr>
  )
}