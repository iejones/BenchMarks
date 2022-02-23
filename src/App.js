import { useEffect, useState } from 'react';
import React from 'react';
import './App.css';
import './Components/Popup.css';
import Popup from './Components/Popup';
import { Letter, Div, RowWrapper, SubmitButton, Title } from './Components/myStyledComponents.js';
import words from "./Constants/words.js";
import { namedColors } from './Constants/colors.js';
import {startWords, endWords} from './Constants/gameWords.js';

function App() {
  const [wordGrid, setWordGrid] = useState([]);
  const [currentColor, setCurrentColor] = useState(0);
  const [currentFocusedRow, setCurrentFocusedRow] = useState(1);
  const [currentFocusedColumn, setCurrentFocusedColumn] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isVictoryOpen, setVictoryIsOpen] = useState(false);
  const [isVictory, setVictory] = useState(false);
  const [rulesIsOpen, setRulesIsOpen] = useState(false);
  const [endWord, setEndWord] = useState(-1);
  const [lettersNeeded, setLettersNeeded] = useState("");
  const [oldLetters, setOldLetters] = useState("");
  const rows = 6;
  const columns = 5;
  const games = startWords.length;

  // popup toggle functions
  const toggleRulesPopup = () => {
    if(rulesIsOpen){
      // reset focus
      document.getElementById(currentFocusedRow.toString() + currentFocusedColumn.toString()).focus();
    }
    setRulesIsOpen(!rulesIsOpen);
  }
  const toggleVictoryPopup = () => {
    setVictoryIsOpen(!isVictoryOpen);
  }

  useEffect(() => { 
    // if word grid is empty (first render), initialize
    if (wordGrid.length === 0) {
      if (localStorage.getItem("firstVisit") === null){
        setRulesIsOpen(true);
      }
      localStorage.setItem("firstVisit", "false");
      handleNewGame(true); // don't allow to focus because the element doesn't exist yet, will error. Rules window will be focus when closed.
    }
  });


  const handleLetterChange = (e, row, column) => {
    const newWordGrid = [...wordGrid]

    // check input is lowercase letter
    if (e.target.value.match(/^[a-z]$/)) {
      // update the value at the input position to the inputed letter
      newWordGrid[row][column].letter = e.target.value;
      
      // if not last letter in word
      if (currentFocusedColumn  < columns - 1){
        // move cursor/focus to the next letter
        setCurrentFocusedColumn(currentFocusedColumn + 1);
        newWordGrid[row][column + 1].disabled = false;
        document.getElementById(row.toString() + column.toString()).blur();
        document.getElementById(row.toString() + (column + 1).toString()).focus();
      }
    } 
    setWordGrid(newWordGrid);
  }

  function checkOneAway(priorWord, currentWord, endFlag) {
    // check word is "one away"/meets transform rules
    var priorWordCopy = "";
    var currentWordCopy = "";
    var origonalCurrentWord = "";
    var discarded = "";
    var isCorrect = true;
    // make a copy of the prior word and two copies of the current word
    // copies are strings of just the characters, not all the values associated with Letters
    for (let i = 0; i < priorWord.length; i++) {
      priorWordCopy += priorWord[i].letter;
      if (endFlag) {
        currentWordCopy += currentWord[i];
        origonalCurrentWord += currentWord[i];
      } else {
        currentWordCopy += currentWord[i].letter;
        origonalCurrentWord += currentWord[i].letter;
      }
    }

    // for each letter in both the prior and current word, remove the letter from the copies. Keep track of removed letters in discarded string
    for (let i = 0; i < priorWord.length; i++) {
      if (origonalCurrentWord.includes(priorWord[i].letter)) {
        priorWordCopy = priorWordCopy.replace(priorWord[i].letter, "");
        currentWordCopy = currentWordCopy.replace(priorWord[i].letter, "");
        discarded += priorWord[i].letter;
      }
    }
    
    // check every character left prior word copy is the same
    for (let i = 1; i < priorWordCopy.length; i++) {
      if (priorWordCopy[i] !== priorWordCopy[0]) {
        isCorrect = false;
      }
    }
    // if no remaining characters, the words have the same letters (no change in letters)
    if (priorWordCopy.length === 0 && currentWordCopy.length === 0) {
      isCorrect = false;
    }
    // check there is the same number of characters remaining in the prior word and current word
    if (priorWordCopy.length !== currentWordCopy.length) {
      isCorrect = false;
    }
    // check that the character in priror word copy was not also discarded (every instance must change)
    if (discarded.includes(priorWordCopy[0])) {
      isCorrect = false;
    }

    if (!isCorrect)
      return [isCorrect];
    else
      return [isCorrect, priorWordCopy[0], currentWordCopy[0], priorWordCopy.length];
  }

  const reset = () => {
    var gameIndex = parseInt(localStorage.getItem("gameIndex"));
    gameIndex = gameIndex - 1; //on refresh calls handle new game and advances a word, so counteract to stay on same words
    localStorage.setItem("gameIndex", gameIndex.toString());
    window.location.reload();
  }

  const handleNewGame = (first) => {
    // make new grid
    let newWordGrid = [];
    for (let i = 0; i < rows; i++) {
      newWordGrid.push([]);
    }

    // end word (same index for start word)
    // set won't occur until after function ends, so need temp for call below so wrapped around (+ 1 will not work for wrapping around)
    var gameIndex = localStorage.getItem("gameIndex");
    if (gameIndex === null){
      gameIndex = 0;
    }

    let newGameIndex = (parseInt(gameIndex) + 1 ) % games;
    for (let i = 0; i < columns; i++) {
      newWordGrid[0].push({ letter: startWords[newGameIndex][i], color: 'medium_grey', borderColor: 'start', disabled:true, wrong:false });
      newWordGrid[rows - 1].push({ letter: endWords[newGameIndex][i], color: 'medium_grey', borderColor: 'end', disabled:true, wrong:false});
    }

    // set middle rows
    for (let i = 1; i < columns; i++) {
      for (let j = 0; j < columns; j++) {
        newWordGrid[i].push({ letter: "", color: 'light_grey', borderColor: 'medium_grey',  disabled:true, wrong:false  });
      }
    }

    newWordGrid[1][0].disabled=false;
    if ( first === false){
      // focus/move cursor to start of first entry row
      document.getElementById("10").focus();
    }

    // set values
    setWordGrid(newWordGrid);
    setCurrentColor(0);
    setCurrentFocusedRow(1);
    setCurrentFocusedColumn(0);
    localStorage.setItem("gameIndex", newGameIndex.toString());
    setEndWord(newGameIndex);
    setVictory(false);
    setLettersNeeded(endWords[newGameIndex]);
    setOldLetters(startWords[newGameIndex]);
  }

  const handleSubmit = () => {
    const newWordGrid = [...wordGrid]
    const priorWord = newWordGrid[currentFocusedRow - 1];
    const currentWord = newWordGrid[currentFocusedRow];
    let isCorrect = true;

    // get just the letters of the entered word
    let enteredWord = "";
    for(let i = 0; i < currentWord.length; i++){
      enteredWord += currentWord[i].letter;
    }
    // check is a word
    if (words.includes(enteredWord))
    {
      // check word is "one away"/meets transform rules from last word
      let output = checkOneAway(priorWord, currentWord, false);
      isCorrect = output[0];

      // if it is valid, move forward to next word and color the transformed letters
      if (isCorrect === true) {
        let priorChanged = output[1];
        let currentChanged = output[2];
        let times = output[3];
        let lettersStillNeeded = lettersNeeded;
        let oldLettersRemaining = oldLetters;

        if (lettersStillNeeded.includes(currentChanged)){
          lettersStillNeeded = lettersStillNeeded.replace(currentChanged, "");
          oldLettersRemaining = oldLettersRemaining.replace(priorChanged, "");
        }

        // set changed letters' background colors and color border of current word according to if belongs in end or start word
        for(let i = 0; i < priorWord.length; i++){
          if(priorWord[i].letter === priorChanged){
            newWordGrid[currentFocusedRow - 1][i].color = currentColor;
          }
          if(currentWord[i].letter === currentChanged){
            if (times > 0){ // could have changed to a letter that was already in word, in which case we want to color only the exact number that were result of transformation
              newWordGrid[currentFocusedRow][i].color = currentColor;
              times = times - 1;
            }
          }
          // border color - Colors according to if letter seen in old/origonal, disregarding times/count
          if(oldLettersRemaining.includes(currentWord[i].letter)){
            newWordGrid[currentFocusedRow][i].borderColor = "start";
          } else if(endWords[endWord].includes(currentWord[i].letter)){
            newWordGrid[currentFocusedRow][i].borderColor = "end";
          } else {
            newWordGrid[currentFocusedRow][i].borderColor = "wrong_red";
          }
        }
        // advance change color for next row
        setCurrentColor(currentColor + 1);
        setLettersNeeded(lettersStillNeeded);
        setOldLetters(oldLettersRemaining);
        
        // disable entered word row
        for (let i =0; i < columns; i++){
          newWordGrid[currentFocusedRow][i].disabled=true;
        }
        // set focus to start of next word
        newWordGrid[currentFocusedRow + 1][0].disabled=false;
        document.getElementById((currentFocusedRow + 1).toString() + "0").focus();
        setCurrentFocusedRow(currentFocusedRow + 1);
        setCurrentFocusedColumn(0);

        // check if entered word is one away from the end word
        output = checkOneAway(currentWord, endWords[endWord], true)
        if ( output[0]) {
          // won game
          let currentChanged = output[1];
          let endChanged = output[2];
          let times = output[3];
          // color transform from entered word to end word
          for(let i = 0; i < priorWord.length; i++){
            if(currentWord[i].letter === currentChanged){
              newWordGrid[currentFocusedRow][i].color = currentColor+1;
            }
            if(newWordGrid[rows - 1][i].letter === endChanged){
              if(times > 0){
                newWordGrid[rows - 1][i].color = currentColor+1;
                times = times - 1;
              }
            }
          }
          // remove focus (don't allow to enter anywhere on winning board)
          document.getElementById((currentFocusedRow + 1).toString() + "0").blur();
          newWordGrid[currentFocusedRow + 1][0].disabled = true;
          // set game over and set victory pop up to open
          setIsGameOver(true);
          setVictoryIsOpen(true);
          setVictory(true);
        }else if (currentFocusedRow === rows -2){
          // did not win, but used up tries
          // do not allow to focus on end row
          document.getElementById((currentFocusedRow + 1).toString() + "0").blur();
          newWordGrid[currentFocusedRow + 1][0].disabled = true;
          // set game over and set victory false
          setIsGameOver(true);
          setVictory(false);
          setVictoryIsOpen(true);
        }
      }
    } else{
      // if entered letters are not a word, not a valid entry
      isCorrect = false;
    }

    // if not correct, set letter wrong value
    if (!isCorrect){
      for(let i = 0; i < 5; i++){
        newWordGrid[currentFocusedRow][i].wrong = true;
      }
    }

    setWordGrid(newWordGrid);
  };

  function backspace(event, row, column){
    var key = event.keyCode || event.charCode;
    let currentColumn = 4;
    // when press backspace and row is not end or start row, and row is not a previously entered row
    if (key === 8 && (row !== 0 && row !== rows-1 && row === currentFocusedRow))
    {
      const newWordGrid = [...wordGrid];
      
      // erase the letters in this row/word
      while (currentColumn >= 0){
        newWordGrid[row][currentColumn].letter = '';
        newWordGrid[row][currentColumn].disabled = true;
        newWordGrid[row][currentColumn].wrong = false;
        document.getElementById(row.toString() + column.toString()).blur();
        currentColumn--;
      }
      // set focus back on first letter of the word
      newWordGrid[row][0].disabled = false;
      document.getElementById(row.toString() + "0").focus();
      setCurrentFocusedColumn(0);
      setWordGrid(newWordGrid);
    }
    else if(key === 13){
      // treat "enter" as submit
      handleSubmit();
    }
  }

  return (
    <Div>
      {rulesIsOpen && <Popup
      content={<>
        <b className='victory'>How To Play</b>
        <div align="left" >Transform the start word to the final word.<br/>
        For each step:<br/>
        <ul display="inline-block" text-align="left">
          <li>Change one letter to any other letter</li>
          <li>All instances of the letter must change</li>
          <li>Only real words are allowed</li>
          <li>Scrambling the letters is allowed</li>
        </ul>
        For example, with e->o, these becomes shoot.     
        <br/>    
        You have 5 steps. Enjoy!
        </div>
        <b className='victory'>Controls</b>
        <div align="left">Type and press enter to submit the current word. <br/>
          Press backspace to delete current unsubmitted word.
        </div>
        </>}
      handleClose={toggleRulesPopup}
      />}


      <Title><span style={{ color: namedColors['start'] }}>Bench</span><span style={{ color: namedColors['end'] }}>Marks</span></Title>
      {isGameOver && isVictoryOpen && isVictory && <Popup
      content={<>
        <b className='victory'>Victory!</b>
        <br></br>
        <b className='center'>Go Cougs!</b>
        </>
        }
        handleClose={toggleVictoryPopup}
      />}
       {isGameOver && isVictoryOpen && ! isVictory && <Popup //need to check not victory
      content={<>
        <b className='victory'>Game Over!</b>
        <br></br>
        <b className='center'>Better luck next time.</b>
        </>
        }
        handleClose={toggleVictoryPopup}
      />}
      {wordGrid.map((row, rowIndex) => (
        <RowWrapper key={rowIndex}>
          {row.map((col, colIndex) => (
            <Letter
              bgcolor={col.color}
              borderColor = {col.borderColor}
              key={colIndex}
              value={wordGrid[rowIndex][colIndex].letter}
              onChange={(e) => handleLetterChange(e, rowIndex, colIndex)}
              readOnly={wordGrid[rowIndex][colIndex].disabled}
              onKeyDown = {(e) => backspace(e, rowIndex, colIndex)}
              id = {rowIndex.toString() + colIndex.toString()}
              style={wordGrid[rowIndex][colIndex].wrong ? { color: namedColors['wrong_red'] } : { color: 'black' }}
            />
          ))}
        </RowWrapper>
      ))}
      
      <RowWrapper>
        <SubmitButton onClick={reset}>Reset</SubmitButton>
        <SubmitButton style={{marginRight: "4px"}} onClick={() => handleNewGame(false)}>New Game</SubmitButton>
        <SubmitButton onClick={toggleRulesPopup}>Rules</SubmitButton>
      </RowWrapper>
    </Div>
  );
}

// remove submit button for now
//<SubmitButton onClick={handleSubmit}>Submit</SubmitButton>

export default App;