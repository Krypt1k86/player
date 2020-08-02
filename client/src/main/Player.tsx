// @ts-ignore: Object is possibly 'null'.
import React, { useCallback, useState, useRef, useEffect } from 'react';
import FontAwesome from 'react-fontawesome';
import { formatDuration } from '../utils/lib';
import { STATICS } from '../utils/http';

import style from './Player.module.css';

type PlayerProps = {
  track: string;
};

export const Player = ({ track }: PlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [assetURL, setAssetURL] = useState<string>('');
  const [isPlayed, setPlayed] = useState<boolean>(false);
  const [museDuration, setMuseDuration] = useState<number>(0);
  const [currentSec, setCurrentSec] = useState<number>(0);

  const audioReady = audioRef !== null && audioRef.current !== null;
  const playerReady = audioReady && assetURL.endsWith('.mp3') && museDuration > 0;

  useEffect(() => {
    if (track !== '') {
      setAssetURL(STATICS + track);
    }
  }, [track]);

  useEffect(() => {
    if (assetURL !== '') {
      setCurrentSec(0);
      // @ts-ignore: Object is possibly 'null'.
      audioRef.current.currentTime = 0;
      // @ts-ignore: Object is possibly 'null'.
      audioRef.current.play();
      setPlayed(true);
    }
  }, [assetURL]);

  const handleLoadMetaData = useCallback(
    (event) => setMuseDuration(Math.ceil(event.target.duration)),
    [setMuseDuration]
  );

  const handleMuseTimeUpdate = useCallback((event) => setCurrentSec(event.target.currentTime), [
    setCurrentSec,
  ]);

  const handleRangeChange = useCallback(
    (event) => {
      if (playerReady) {
        const { value } = event.target;
        // @ts-ignore: Object is possibly 'null'.
        audioRef.current.currentTime = parseInt(value);
        setCurrentSec(parseInt(value));
      }
    },
    [playerReady, setCurrentSec]
  );

  const handlePlayOrPause = useCallback(() => {
    if (playerReady) {
      // @ts-ignore: Object is possibly 'null'.
      if (audioRef.current.paused) {
        // @ts-ignore: Object is possibly 'null'.
        audioRef.current.play();
        setPlayed(true);
      } else {
        // @ts-ignore: Object is possibly 'null'.
        audioRef.current.pause();
        setPlayed(false);
      }
    }
  }, [playerReady, audioRef, setPlayed]);

  const handleRestart = useCallback(() => {
    if (playerReady) {
      // @ts-ignore: Object is possibly 'null'.
      audioRef.current.currentTime = 0;
      // @ts-ignore: Object is possibly 'null'.
      audioRef.current.play();
      setCurrentSec(0);
      setPlayed(true);
    }
  }, [playerReady, setCurrentSec, setPlayed]);

  const handleSkip = useCallback(
    (sec: number, value: number) => {
      if (playerReady) {
        const audio = audioRef.current;
        // @ts-ignore: Object is possibly 'null'.
        if ((sec >= 0 && audio.currentTime + sec < museDuration) || audio.currentTime + sec >= 0) {
          // @ts-ignore: Object is possibly 'null'.
          audioRef.current.currentTime = audioRef.current.currentTime + sec;
          setCurrentSec(value + sec);
        }
      }
    },
    [playerReady, museDuration, setCurrentSec]
  );

  return (
    <div className={style['player-container']}>
      <div className={style['player-buttons']}>
        <button onClick={handleRestart}>
          <FontAwesome name="refresh" />
        </button>
        <button onClick={() => handleSkip(-10, currentSec)}>
          <FontAwesome name="step-backward" />
        </button>
        <button onClick={handlePlayOrPause}>
          <FontAwesome name={isPlayed ? 'pause' : 'play'} />
        </button>
        <button onClick={() => handleSkip(10, currentSec)}>
          <FontAwesome name="step-forward" />
        </button>
      </div>
      <div className={style['player-slider']}>
        {playerReady ? <h3>{track.slice(track.indexOf('/') + 1, -4)}</h3> : null}
        <input
          type="range"
          name="playbackRate"
          min={0}
          max={museDuration}
          onChange={handleRangeChange}
          value={currentSec}
        />
        <audio
          ref={audioRef}
          onLoadedMetadata={handleLoadMetaData}
          onTimeUpdate={handleMuseTimeUpdate}
          src={assetURL}
        />
        {playerReady ? (
          <>
            <span className={style['time-start']}>{formatDuration(0)}</span>
            <span className={style['time-stop']}>{formatDuration(museDuration)}</span>
          </>
        ) : null}
      </div>
    </div>
  );
};
