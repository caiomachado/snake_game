import { useState, useRef } from 'react'
import {
  Wrapper
} from "./styles"
import { Game } from './components/Game/Game';
import { Button } from './components/Button/Button';

export type GameMode = 'easy' | 'hard'

export type MapSize = 'small' | 'medium' | 'large'

function App() {
  const [gameMode, setGameMode] = useState<GameMode>('easy')
  const [mapSize, setMapSize] = useState<MapSize>('small')
  const [isPlaying, setIsPlaying] = useState(false)
  const scoreRef = useRef(0)
 
  const handlePoints = (newScore: number) => {
    scoreRef.current = newScore
  }

  return (
    <Wrapper>
      {!isPlaying ? (
        <>
          <h1 className="heading">Snake Game</h1>
          <section className="setting-block">
            <h2 className="subHeading">Game mode</h2>
            <div className="button-block">
              <Button
                className={gameMode === 'easy' ? 'active' : ''}
                text='Easy'
                handleClick={() => {
                  if (gameMode === 'easy') return
                  setGameMode('easy')
                }}
              />
              <Button
              className={gameMode === 'hard' ? 'active' : ''}
              text='Hard'
              handleClick={() => {
                if (gameMode === 'hard') return
                setGameMode('hard')
              }}
            />
            </div>
          </section>
          <section className="setting-block">
            <h2 className="subHeading">Map size</h2>
            <div className="button-block">
              <Button
                className={mapSize === 'small' ? 'active' : ''}
                text='Small'
                handleClick={() => {
                  if (mapSize === 'small') return
                  setMapSize('small')
                }}
              />
              <Button
                className={mapSize === 'medium' ? 'active' : ''}
                text='Medium'
                handleClick={() => {
                  if (mapSize === 'medium') return
                  setMapSize('medium')
                }}
              />
              <Button
                className={mapSize === 'large' ? 'active' : ''}
                text='Large'
                handleClick={() => {
                  if (mapSize === 'large') return
                  setMapSize('large')
                }}
              />
            </div>
          </section>
          <section className="play-block">
            <span>Your previous score: {scoreRef.current}</span>
            <Button
              text='Play'
              handleClick={() => setIsPlaying(true)}
            />
          </section>
        </>
      ) : (
        <Game 
          gameMode={gameMode} 
          mapSize={mapSize} 
          onFinish={handlePoints} 
          handleQuit={() => setIsPlaying(false)}
        />
      )}
    </Wrapper>
  )
}

export default App
