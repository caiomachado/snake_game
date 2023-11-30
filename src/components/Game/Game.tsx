import { useState, useEffect } from 'react'

import { GameMode, MapSize } from '../../App'
import { Board, Map, SnakeHead, SnakeBody } from './styles'
import { Modal } from '../Modal/Modal'
import { Button } from '../Button/Button'

type GameProps = {
    gameMode: GameMode
    mapSize: MapSize
    onFinish: (newScore: number) => void;
    handleQuit: () => void;
}

type ModalInfo = {
    isShown: boolean;
    text: string
}

type MapTile = {
    id: number;
    isOccupiedBySnake: boolean;
    hasSnakeHead: boolean;
    hasFood: boolean;
    row: number;
    firstTileInRow: number;
    lastTileInRow: number;
    isLeftCorner: boolean;
    isRightCorner: boolean;
    isTop: boolean;
    isBottom: boolean;
    isFirstTileInRow: boolean;
    isLastTileInRow: boolean;
    snakeDirection: string;
    bodyOrder: number;
}

enum KeyCode {
    ArrowLeft = 37,
    ArrowUp = 38,
    ArrowRight = 39,
    ArrowDown = 40
}

const MODAL_INITIAL_STATE = {
    isShown: false,
    text: ''
}

export const Game = ({ handleQuit, gameMode, mapSize, onFinish }: GameProps) => {
    const [mapTiles, setMapTiles] = useState<MapTile[]>([])
    const [snakeDirection, setSnakeDirection] = useState('')
    const [automaticMove, setAutomaticMove] = useState(false)
    const [messageModalInfo, setMessageModalInfo] = useState<ModalInfo>(MODAL_INITIAL_STATE)
    
    const STARTING_POSITION = mapSize === 'large' ? 128 : mapSize === 'medium' ? 84 : 40
    const TILES_COUNT = mapSize === 'large' ? 256 : mapSize === 'medium' ? 168 : 72
    const ROW_SIZE = mapSize === 'large' ? 16 : mapSize === 'medium' ? 12 : 8
    const foodTile = mapTiles.find(tile => tile.hasFood)
    const tilesOccupiedBySnake = mapTiles.filter(tile => tile.isOccupiedBySnake).sort((a, b) => a.bodyOrder - b.bodyOrder)
    const points = (tilesOccupiedBySnake.length * 10) - 10
    
    const checkIfIsSurrounded = () => {
        const snakeHead = tilesOccupiedBySnake[0]

        let adjacentTiles: (MapTile | undefined)[] = []

        if (snakeHead?.isTop && snakeHead?.isFirstTileInRow) {
            adjacentTiles = [
                mapTiles.find(tile => tile.id === snakeHead.id + 1),
                mapTiles.find(tile => tile.id === snakeHead.id + ROW_SIZE),
            ]
        } else if (snakeHead?.isTop && snakeHead?.isLastTileInRow) {
            adjacentTiles = [
                mapTiles.find(tile => tile.id === snakeHead.id - 1),
                mapTiles.find(tile => tile.id === snakeHead.id + ROW_SIZE),
            ]
        } else if (snakeHead?.isTop && !snakeHead?.isFirstTileInRow && !snakeHead?.isLastTileInRow) {
            adjacentTiles = [
                mapTiles.find(tile => tile.id === snakeHead.id - 1),
                mapTiles.find(tile => tile.id === snakeHead.id + 1),
                mapTiles.find(tile => tile.id === snakeHead.id + ROW_SIZE),
            ]
        } else if (snakeHead?.isBottom && snakeHead?.isFirstTileInRow) {
            adjacentTiles = [
                mapTiles.find(tile => tile.id === snakeHead.id - ROW_SIZE),
                mapTiles.find(tile => tile.id === snakeHead.id + 1),
            ]
        } else if (snakeHead?.isBottom && snakeHead?.isLastTileInRow) {
            adjacentTiles = [
                mapTiles.find(tile => tile.id === snakeHead.id - ROW_SIZE),
                mapTiles.find(tile => tile.id === snakeHead.id - 1),
            ]
        } else if (snakeHead?.isBottom && !snakeHead?.isFirstTileInRow && !snakeHead?.isLastTileInRow) {
            adjacentTiles = [
                mapTiles.find(tile => tile.id === snakeHead.id - ROW_SIZE),
                mapTiles.find(tile => tile.id === snakeHead.id - 1),
                mapTiles.find(tile => tile.id === snakeHead.id + 1),
            ]
        } else if (!snakeHead?.isTop && !snakeHead?.isBottom && snakeHead?.isFirstTileInRow && !snakeHead?.isLastTileInRow) {
            adjacentTiles = [
                mapTiles.find(tile => tile.id === snakeHead.id - ROW_SIZE),
                mapTiles.find(tile => tile.id === snakeHead.id + 1),
                mapTiles.find(tile => tile.id === snakeHead.id + ROW_SIZE),
            ]
        } else if (!snakeHead?.isTop && !snakeHead?.isBottom && snakeHead?.isLastTileInRow && !snakeHead.isFirstTileInRow) {
            adjacentTiles = [
                mapTiles.find(tile => tile.id === snakeHead.id - ROW_SIZE),
                mapTiles.find(tile => tile.id === snakeHead.id - 1),
                mapTiles.find(tile => tile.id === snakeHead.id + ROW_SIZE),
            ]
        } else {
            adjacentTiles = [
                mapTiles.find(tile => tile.id === snakeHead.id - ROW_SIZE),
                mapTiles.find(tile => tile.id === snakeHead.id - 1),
                mapTiles.find(tile => tile.id === snakeHead.id + 1),
                mapTiles.find(tile => tile.id === snakeHead.id + ROW_SIZE),
            ];
        }

        if (adjacentTiles.length > 0) {
            return adjacentTiles.every(tile => tile && tile.isOccupiedBySnake);
        }

        return false
    };

    const isSnakeSurrounded = checkIfIsSurrounded()

    const generateMap = () => {
        let arrayOfTiles = [] as MapTile[]
        for (let i = 1; i <= TILES_COUNT; i++) {
            let amountOfRows = i / ROW_SIZE
            const rowNumber = Math.ceil(amountOfRows)
            const firstTileInRow = (ROW_SIZE * rowNumber) - ROW_SIZE + 1
            const lastTileInRow = ROW_SIZE * rowNumber
            if (i === STARTING_POSITION) {
                arrayOfTiles.push({
                    id: i,
                    isOccupiedBySnake: true,
                    hasSnakeHead: true,
                    hasFood: false,
                    row: STARTING_POSITION / ROW_SIZE,
                    firstTileInRow: firstTileInRow,
                    lastTileInRow: lastTileInRow,
                    isLeftCorner: i === firstTileInRow,
                    isRightCorner: i === lastTileInRow,
                    isTop: rowNumber === 1,
                    isBottom: rowNumber === (TILES_COUNT / ROW_SIZE),
                    isFirstTileInRow: i === firstTileInRow,
                    isLastTileInRow: i === lastTileInRow,
                    snakeDirection: 'up',
                    bodyOrder: 1
                })
            } else {
                arrayOfTiles.push({
                    id: i,
                    isOccupiedBySnake: false,
                    hasFood: false,
                    hasSnakeHead: false,
                    row: rowNumber,
                    firstTileInRow: firstTileInRow,
                    lastTileInRow: lastTileInRow,
                    isLeftCorner: i === firstTileInRow,
                    isRightCorner: i === lastTileInRow,
                    isTop: rowNumber === 1,
                    isBottom: rowNumber === (TILES_COUNT / ROW_SIZE),
                    isFirstTileInRow: i === firstTileInRow,
                    isLastTileInRow: i === lastTileInRow,
                    snakeDirection: 'up',
                    bodyOrder: 0
                })
            }
        }

        const generatedFoodTile = generateFoodTile(arrayOfTiles)

        const initialMap = arrayOfTiles.map(tile => {
            if (tile.id === generatedFoodTile?.id) {
                return generatedFoodTile
            }
            return tile
        })

        setMapTiles(initialMap)
    }

    const generateFoodTile = (arrayOfTiles: MapTile[]): MapTile => {
        const randomNumber = Math.ceil(Math.random() * TILES_COUNT)
        const newFoodTile = arrayOfTiles.find(tile => tile.id === randomNumber)!
     
        if (newFoodTile?.isOccupiedBySnake) {
          return generateFoodTile(arrayOfTiles)
        }
    
        return {
          ...newFoodTile,
          hasFood: true
        }
    }

    const moveBody = (arrayOfTiles: MapTile[], headTile: MapTile | undefined) => {
        const filteredTiles = arrayOfTiles
          .filter(filteredTile => filteredTile.isOccupiedBySnake && !filteredTile.hasSnakeHead)
          .sort((a, b) => a.bodyOrder - b.bodyOrder)
    
        const newPositionedArray: MapTile[] = []
    
        for (let i = filteredTiles.length - 1; i >= 0; i--) {
          if (headTile && i === 0) {
            newPositionedArray.push({
              ...headTile,
              bodyOrder: filteredTiles[i].bodyOrder,
              hasSnakeHead: false
            })
          } else {
            newPositionedArray.push({
              ...filteredTiles[i - 1],
              bodyOrder: filteredTiles[i].bodyOrder
            })
          }
        }
    
        const modifiedArray = arrayOfTiles.map(tile => {
          const foundBodyPart = newPositionedArray.find(item => item.id === tile.id)
          if (foundBodyPart && tile.id === foundBodyPart.id) {
            return foundBodyPart
          }
          
          // this if is to replace the tip of the body with an empty space so that the body moves
          if (filteredTiles.length && tile.id === filteredTiles[filteredTiles.length - 1].id) {
            return {
              ...tile,
              bodyOrder: 0,
              isOccupiedBySnake: false
            }
          }

          return tile
        })
    
        return modifiedArray
    }

    const moveHead = (direction: string | undefined = undefined) => {    
        switch (direction ?? snakeDirection) {
            case 'up':
                setMapTiles((prevState) => {
                    const filteredTiles = prevState
                        .filter(filteredTile => filteredTile.isOccupiedBySnake)
                        .sort((a, b) => a.bodyOrder - b.bodyOrder)
                    const headTile = filteredTiles[0]
                    const tileAbove = prevState.find(tile => tile.id === (headTile && headTile.id - ROW_SIZE))
            
                    // This if is to not allow the snake to move backwards into the body
                    if (
                        filteredTiles.length >= 2 && 
                        (headTile.id - ROW_SIZE === filteredTiles[1].id || 
                        (tileAbove?.isOccupiedBySnake && headTile.id - ROW_SIZE === tileAbove?.id))
                    ) {
                        return prevState
                    }
            
                    const newArray = prevState.map(tile => {
                        // This if is to eat the food and replace with the head
                        if (headTile && tile.hasFood && tile.id === (headTile.id - ROW_SIZE)) {
                            return {
                                ...tile,
                                hasSnakeHead: true,
                                isOccupiedBySnake: true,
                                hasFood: false,
                                snakeDirection: 'up',
                                bodyOrder: 1
                            }
                        }
                
                        // This if is to remove the head from the previous block
                        if (headTile && !tile.isTop && !tile.hasFood && tile.id === headTile.id) {
                            return tileAbove?.isOccupiedBySnake ? tile : {
                                ...tile,
                                hasSnakeHead: false,
                                isOccupiedBySnake: false,
                                snakeDirection: 'up',
                                bodyOrder: 0
                            }
                        }
            
                        // This if is to move the head to the top row
                        if (headTile && tile.isTop && !tile.hasFood && tile.id === (headTile.id - ROW_SIZE)) {
                            return {
                                ...tile,
                                hasSnakeHead: true,
                                isOccupiedBySnake: true,
                                snakeDirection: 'up',
                                bodyOrder: 1
                            }
                        }
            
                        // This if is to move the head
                        if (headTile && !tile.isTop && !tile.hasFood && tile.id === (headTile.id - ROW_SIZE)) {
                            return tileAbove?.isOccupiedBySnake ? tile : {
                                ...tile,
                                hasSnakeHead: true,
                                isOccupiedBySnake: true,
                                snakeDirection: 'up',
                                bodyOrder: 1
                            }
                        }
            
                        return tile
                    })
                    
                    // This new array is to move the body based on the moved head
                    const modifiedArray = moveBody(newArray, headTile)
                    return modifiedArray
                })
                break;
            case 'down':
                setMapTiles((prevState) => {
                    const filteredTiles = prevState
                        .filter(filteredTile => filteredTile.isOccupiedBySnake)
                        .sort((a, b) => a.bodyOrder - b.bodyOrder)
                    const headTile = filteredTiles[0]
                    const tileBelow = prevState.find(tile => tile.id === (headTile && headTile.id + ROW_SIZE))

                    // This if is to not allow the snake to move backwards into the body
                    if (
                        filteredTiles.length >= 2 && 
                        (headTile.id + ROW_SIZE === filteredTiles[1].id || 
                        (tileBelow?.isOccupiedBySnake && headTile.id + ROW_SIZE === tileBelow?.id))
                    ) {
                        return prevState
                    }
            
                    const newArray = prevState.map(tile => {
                        // This if is to eat the food and replace with the head
                        if (headTile && tile.hasFood && tile.id === (headTile.id + ROW_SIZE)) {
                            return {
                                ...tile,
                                hasSnakeHead: true,
                                isOccupiedBySnake: true,
                                hasFood: false,
                                snakeDirection: 'down',
                                bodyOrder: 1
                            }
                        }
            
                        // This if is to remove the head from the previous block
                        if (headTile && !tile.isBottom && !tile.hasFood && tile.id === headTile.id) {
                            return tileBelow?.isOccupiedBySnake ? tile : {
                                ...tile,
                                hasSnakeHead: false,
                                isOccupiedBySnake: false,
                                snakeDirection: 'down',
                                bodyOrder: 0
                            }
                        }
            
                        // This if is to move the head to the bottom row
                        if (headTile && tile.isBottom && !tile.hasFood && tile.id === (headTile.id + ROW_SIZE)) {
                            return {
                                ...tile,
                                hasSnakeHead: true,
                                isOccupiedBySnake: true,
                                snakeDirection: 'down',
                                bodyOrder: 1
                            }
                        }
            
                        // This if is to move the head
                        if (headTile && !tile.isBottom && !tile.hasFood && tile.id === (headTile.id + ROW_SIZE)) {
                            return tileBelow?.isOccupiedBySnake ? tile : {
                                ...tile,
                                hasSnakeHead: true,
                                isOccupiedBySnake: true,
                                snakeDirection: 'down',
                                bodyOrder: 1
                            }
                        }
                        return tile
                    })
            
                    // This new array is to move the body based on the moved head
                    const modifiedArray = moveBody(newArray, headTile)
                    return modifiedArray
                })
                break;
            case 'left':
                setMapTiles((prevState) => {
                    const filteredTiles = prevState
                        .filter(filteredTile => filteredTile.isOccupiedBySnake)
                        .sort((a, b) => a.bodyOrder - b.bodyOrder)
                    const headTile = filteredTiles[0]
                    const tileToTheLeft = prevState.find(tile => tile.id === (headTile && headTile.id - 1))
                    
                    // This if is to not allow the snake to move backwards into the body
                    if (
                        filteredTiles.length >= 2 && 
                        (headTile.id - 1 === filteredTiles[1].id || 
                        (tileToTheLeft?.isOccupiedBySnake && headTile.id - 1 === tileToTheLeft?.id))
                    ) {
                        return prevState
                    }
                    
                    const newArray = prevState.map(tile => {
                        // This if is to eat the food and replace with the head
                        if (headTile && tile.hasFood && tile.id === (headTile.id - 1)) {
                            return {
                                ...tile,
                                hasSnakeHead: true,
                                isOccupiedBySnake: true,
                                hasFood: false,
                                snakeDirection: 'left',
                                bodyOrder: 1
                            }
                        }
            
                        // This if is to remove the head from the previous block
                        if (headTile && !tile.isLeftCorner && !tile.hasFood && tile.id === headTile.id) {
                            return tileToTheLeft?.isOccupiedBySnake ? tile : {
                                ...tile,
                                hasSnakeHead: false,
                                isOccupiedBySnake: false,
                                snakeDirection: 'left',
                                bodyOrder: 0
                            }
                        }
            
                        // This if is to move the head to the first tile in the row
                        if (headTile && tile.isLeftCorner && !tile.hasFood && tile.id === (headTile.id - 1)) {
                            return {
                                ...tile,
                                hasSnakeHead: true,
                                isOccupiedBySnake: true,
                                snakeDirection: 'left',
                                bodyOrder: 1
                            }
                        }
            
                        // This if is to move the head
                        if (headTile && !tile.isLeftCorner && !tile.hasFood && tile.id === (headTile.id - 1) && tile.row === headTile.row) {
                            return tileToTheLeft?.isOccupiedBySnake ? tile : {
                                ...tile,
                                hasSnakeHead: true,
                                isOccupiedBySnake: true,
                                snakeDirection: 'left',
                                bodyOrder: 1
                            }
                        }
                        return tile
                    })
            
                    // This new array is to move the body based on the moved head
                    const modifiedArray = moveBody(newArray, headTile)
                    return modifiedArray
                })
                break;
            case 'right':
                setMapTiles((prevState) => {
                    const filteredTiles = prevState
                        .filter(filteredTile => filteredTile.isOccupiedBySnake)
                        .sort((a, b) => a.bodyOrder - b.bodyOrder)
                    const headTile = filteredTiles[0]
                    const tileToTheRight = prevState.find(tile => tile.id === (headTile && headTile.id + 1))
                    
                    // This if is to not allow the snake to move backwards into the body
                    if (
                        filteredTiles.length >= 2 && 
                        (headTile.id + 1 === filteredTiles[1].id || 
                        (tileToTheRight?.isOccupiedBySnake && headTile.id + 1 === tileToTheRight?.id))
                    ) {
                        return prevState
                    }
            
                    const newArray = prevState.map(tile => {
                        // This if is to eat the food and replace with the head
                        if (headTile && tile.hasFood && tile.id === (headTile.id + 1)) {
                            return {
                                ...tile,
                                hasSnakeHead: true,
                                isOccupiedBySnake: true,
                                hasFood: false,
                                snakeDirection: 'right',
                                bodyOrder: 1
                            }
                        }
            
                        // This if is to remove the head from the previous block
                        if (headTile && !tile.isRightCorner && !tile.hasFood && tile.id === headTile.id) {
                            return tileToTheRight?.isOccupiedBySnake ? tile : {
                                ...tile,
                                hasSnakeHead: false,
                                isOccupiedBySnake: false,
                                snakeDirection: 'right',
                                bodyOrder: 0
                            }
                        }
            
                        // This if is to move the head to the last tile in the row
                        if (headTile && tile.isRightCorner && !tile.hasFood && tile.id === (headTile.id + 1)) {
                            return {
                                ...tile,
                                hasSnakeHead: true,
                                isOccupiedBySnake: true,
                                snakeDirection: 'right',
                                bodyOrder: 1
                            }
                        }
            
                        // This if is to move the head
                        if (headTile && !tile.isRightCorner && !tile.hasFood && tile.id === (headTile.id + 1) && tile.row === headTile.row) {
                            return tileToTheRight?.isOccupiedBySnake ? tile : {
                                ...tile,
                                hasSnakeHead: true,
                                isOccupiedBySnake: true,
                                snakeDirection: 'right',
                                bodyOrder: 1
                            }
                        }
                        return tile
                    })
                    
                    // This new array is to move the body based on the moved head
                    const modifiedArray = moveBody(newArray, headTile)
                    return modifiedArray
                })
                break;
            default:
                break;
        }
    }

    const handleKeyDown = (event: any) => {
        switch (event.keyCode) {
            case (KeyCode.ArrowUp):
                setSnakeDirection('up')
                if (!automaticMove) {
                    moveHead('up')
                }
                break;
            case (KeyCode.ArrowDown):
                setSnakeDirection('down')
                if (!automaticMove) {
                    moveHead('down')
                }
                break;
            case (KeyCode.ArrowLeft):
                setSnakeDirection('left')
                if (!automaticMove) {
                    moveHead('left')
                }
                break;
            case (KeyCode.ArrowRight):
                setSnakeDirection('right')
                if (!automaticMove) {
                    moveHead('right')
                }
                break;
            default:
                break;
        }
    }

    const handleBodyCurve = (id: number) => {
        if (tilesOccupiedBySnake.length < 2) return
        const foundItemIndex = tilesOccupiedBySnake.findIndex((tile) => tile.id === id)
        const currentTile = tilesOccupiedBySnake[foundItemIndex]
        const nextTile = tilesOccupiedBySnake[foundItemIndex - 1]

        if (currentTile?.snakeDirection === 'down' && nextTile?.snakeDirection === 'left') {
            return 'curved top-left'
        }
        
        if (currentTile?.snakeDirection === 'right' && nextTile?.snakeDirection === 'up') {
            return 'curved top-left'
        }
       
        if (currentTile?.snakeDirection === 'down' && nextTile?.snakeDirection === 'right') {
            return 'curved top-right'
        }
        
        if (currentTile?.snakeDirection === 'left' && nextTile?.snakeDirection === 'up') {
            return 'curved top-right'
        }
        
        if (currentTile?.snakeDirection === 'up' && nextTile?.snakeDirection === 'left') {
            return 'curved bottom-left'
        }
        
        if (currentTile?.snakeDirection === 'right' && nextTile?.snakeDirection === 'down') {
            return 'curved bottom-left'
        }
       
        if (currentTile?.snakeDirection === 'up' && nextTile?.snakeDirection === 'right') {
            return 'curved bottom-right'
        }
        
        if (currentTile?.snakeDirection === 'left' && nextTile?.snakeDirection === 'down') {
            return 'curved bottom-right'
        }

        return ''
    }

    const handleRotation = (direction: string) => {
        switch (direction) {
            case 'up':
            return '0deg'
            case 'down':
            return '180deg'
            case 'left':
            return '270deg'
            case 'right':
            return '90deg'
            default:
            return '0deg'
        }
    }

    useEffect(() => {
        if (!foodTile) {
          setMapTiles((prevState) => {
            const generatedFoodTile = generateFoodTile(prevState)
            const lastSnakeTile = tilesOccupiedBySnake[tilesOccupiedBySnake.length - 1]
    
            const newArray = prevState.map(tile => {
              if (tile.id === generatedFoodTile?.id) {
                return generatedFoodTile
              }
        
              if (lastSnakeTile?.snakeDirection === 'up') {
                if (tile.id === (lastSnakeTile.id + ROW_SIZE)) {
                  return {
                    ...tile,
                    hasSnakeHead: false,
                    isOccupiedBySnake: true,
                    snakeDirection: 'up',
                    bodyOrder: lastSnakeTile.bodyOrder + 1
                  }
                } 
              }
              
              if (lastSnakeTile?.snakeDirection === 'down') {
                if (tile.id === (lastSnakeTile.id - ROW_SIZE)) {
                  return {
                    ...tile,
                    hasSnakeHead: false,
                    isOccupiedBySnake: true,
                    snakeDirection: 'down',
                    bodyOrder: lastSnakeTile.bodyOrder + 1
                  }
                } 
              }
        
              if (lastSnakeTile?.snakeDirection === 'left') {
                if (tile.id === (lastSnakeTile.id + 1)) {
                  return {
                    ...tile,
                    hasSnakeHead: false,
                    isOccupiedBySnake: true,
                    snakeDirection: 'left',
                    bodyOrder: lastSnakeTile.bodyOrder + 1
                  }
                } 
              }
        
              if (lastSnakeTile?.snakeDirection === 'right') {
                if (tile.id === (lastSnakeTile.id - 1)) {
                  return {
                    ...tile,
                    hasSnakeHead: false,
                    isOccupiedBySnake: true,
                    snakeDirection: 'right',
                    bodyOrder: lastSnakeTile.bodyOrder + 1
                  }
                } 
              }
        
              return tile
            })
            return newArray
          })
        }
    }, [foodTile])

    useEffect(() => {
        if (tilesOccupiedBySnake.length === TILES_COUNT - 1 && !messageModalInfo.isShown) {
            setMessageModalInfo({
                isShown: true,
                text: 'You won!'
            })
        } else if ((tilesOccupiedBySnake.length > 0 && !tilesOccupiedBySnake[0].hasSnakeHead) || isSnakeSurrounded) {
            setMessageModalInfo({
                isShown: true,
                text: 'You lost!'
            })
        }
    }, [tilesOccupiedBySnake.length, isSnakeSurrounded])

    useEffect(() => {
        let interval: number

        if (automaticMove) {
            interval = setInterval(() => {
                moveHead()
            }, 1000)
        }

        return () => {
            clearInterval(interval)
        }
    }, [messageModalInfo.isShown, snakeDirection])

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown)
        generateMap()

        if (gameMode === 'hard') {
            setAutomaticMove(true)
        }
        
        return () => {
          document.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    return (
        <Board>
            <div className="header">
                <span>Your score: {points}</span>
                <Button
                    text='Go to menu'
                    handleClick={handleQuit}
                />
            </div>
            <Map mapSize={mapSize}>
                {mapTiles && mapTiles.map((tile) => {
                    return (
                        <div key={tile.id} className="block">
                            {tile.hasFood ? (
                                <div className="food" />
                            ) : null}
                            {tile.isOccupiedBySnake && tile.hasSnakeHead ? (
                                <SnakeHead direction={handleRotation(tile.snakeDirection)}>
                                    <div className="tongue" />
                                    <div className="neck" />
                                </SnakeHead>
                            ) : null}
                            {tile.isOccupiedBySnake && !tile.hasSnakeHead ? (
                                <SnakeBody 
                                    direction={handleRotation(tile.snakeDirection)} 
                                    className={`${handleBodyCurve(tile.id)}`}
                                >
                                    <div className="dot" />
                                </SnakeBody>
                            ) : null}
                        </div>
                    )
                })}
            </Map>

            {messageModalInfo.isShown ? (
                <Modal
                    isOpen={messageModalInfo.isShown}
                    handleCloseModal={() => {
                        setMessageModalInfo(MODAL_INITIAL_STATE)
                        onFinish(points + 10)
                        handleQuit()
                    }}
                    buttonText='Exit' 
                    text={messageModalInfo.text}
                />
            ) : null}
        </Board>
    )
}