import React from "react"
import Confetti from "react-confetti"
import Die from "./Die"
import { nanoid } from "nanoid"

export default function App() {
    
    const [dice, setDice] = React.useState(() => generateNewDice())
    const gameWon = (
        dice.every(die => die.isHeld) && 
        dice.every(die => dice[0].value === die.value) 
    )
    const buttonRef = React.useRef(null)
    
    React.useEffect(() => {
        if (gameWon) {
            buttonRef.current.focus()
        }
    }, [gameWon])
    
    function generateNewDice() {
        return new Array(10)
            .fill(0)
            .map(() => ({
                value: Math.ceil(Math.random() * 6), 
                isHeld: false,
                id: nanoid()  
            }))
    }
        
    function rerollDice() {
        setDice(oldDice =>
            oldDice.map(die =>
                die.isHeld ? die : {...die, value: Math.ceil(Math.random() * 6)}
            )
        )
    }
    
    function newGame() {
        setDice(generateNewDice())
    }
    
    
    function hold(id) {
        setDice(oldDice => 
            oldDice.map(die =>
                die.id === id ? {...die, isHeld: !die.isHeld} : die
            )
        )
    }
    
    const diceElements = dice.map(dieObj =>
        <Die 
            value={dieObj.value}
            isHeld={dieObj.isHeld}
            key={dieObj.id} 
            hold={() => hold(dieObj.id)}
        />
    )
    
    return (
        <main>
            {gameWon && <Confetti />}
            <div aria-live="polite" className="sr-only">
                {gameWon && <p>Congratulations! You won! Press "New Game" to start again.</p>}
            </div>
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                ref={buttonRef} 
                onClick={gameWon ? newGame : rerollDice} 
                className="roll-button">
            {gameWon ? "New Game" : "Roll"}</button>
        </main>
    )
}