import { useEffect, useState } from 'react';
import React, { Component }  from 'react';

import styled from "styled-components";
import './App.css';
import './style.css';
import Popup from './Popup';
import words from "./words.js"

const phrases = {
  "tutor":"Stuck on a homework assignment? Don’t go it alone - visit a TUTOR! Access tutoring for your VCEA classes in person or online. Visit the VCEA tutoring schedule for more information.",
  "meals":"Cougs don't let cougs go hungry. Get assistance from the cougar food pantry!",
  "cream":"Visit the WSU Creamery - Ferdinands - for some delicious cheese and ice CREAM.",
  "frank":"Interested in entrepreneurship? The Harold FRANK Engineering Entrepreneurship Institute has opportunities for you!",
  "apply":"Are you ready to apply for internships and full-time positions? Don't be intimidated. VCEA Internships and Career Services has the resources, workshops, and one-on-one help you need.",
  "clubs":"Meet your peers and gain hands-on experience by joining a club! Look at all the clubs VCEA has to offer."
}
const phraseLink = {0:"https://vcea.wsu.edu/student-success/tutoring/tutoring-schedule/", 1:"https://studentcare.wsu.edu/student-resources/food-assistance/wsu-pullman/", 2:"https://creamery.wsu.edu/ferdinands-ice-cream-shoppe/", 3:"https://vcea.wsu.edu/entrepreneurship/", 4:"https://vcea.wsu.edu/student-success/internships-careers/", 5:"https://vcea.wsu.edu/student-success/clubs/"};
const keyWordsStart = {0:"tutor", 1:"meals", 2:"cream", 3:"frank", 4:"apply", 5:"clubs"};
const keyWordsEnd = {0:"apple",1:"brood", 2:"bunks", 3: "boils" , 4:"shoes" ,5:"troop"};
const colors = {0:"#53565A", 1:"grey", 2: "#4172F3", 3:"#A012DA", 4:"#DC267F", 5:"#FE6100", 6:"#FFB000"};

function App() {
  const [wordGrid, setWordGrid] = useState([]);
  const [currentColor, setCurrentColor] = useState(2);
  const [currentFocusedRow, setCurrentFocusedRow] = useState(1);
  const [currentFocusedColumn, setCurrentFocusedColumn] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const start = "meals";
  const end = "bongo";
  // const start = "tutor";
  // const end = "apple";
  console.log(typeof(words));
  const [isVictoryOpen, setVictoryIsOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [rulesIsOpen, setRulesIsOpen] = useState(true);
  const [startWord, setStartWord] = useState(0);
  const [endWord, setEndWord] = useState(0);
  const togglePopup = () => {
    setIsOpen(!isOpen);
    console.log(isOpen);
  }
  const toggleRulesPopup = () => {
    setRulesIsOpen(!rulesIsOpen);
    console.log(rulesIsOpen);
  }

  const toggleVictoryPopup = () => {
    setVictoryIsOpen(!isVictoryOpen);
    console.log("Disabling")
    console.log(isVictoryOpen);
  }

  useEffect(() => {
    function initializeWordGrid() {
      let newWordGrid = [];
      for (let i = 0; i < 6; i++) {
        newWordGrid.push([])
      }

      for (let i = 0; i < 5; i++) {
        newWordGrid[0].push({ letter: keyWordsStart[startWord][i], color: 0, disabled:true, wrong:false })
        newWordGrid[5].push({ letter: keyWordsEnd[endWord][i], color: 0, disabled:true, wrong:false   })
      }

      for (let i = 1; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          newWordGrid[i].push({ letter: "", color: 1, disabled:true, wrong:false  })
        }
      }
      newWordGrid[1][0].disabled=false;

      setWordGrid(newWordGrid);
    }

    if (wordGrid.length === 0) {
      initializeWordGrid();
    }
  });


  const handleChange = (e, row, column) => {
    const newWordGrid = [...wordGrid]
    console.log(e.nativeEvent.inputType);
    if ( e.nativeEvent.inputType=== "deleteContentBackward"){
      newWordGrid[row][column].letter = '';
      if (currentFocusedColumn > 0){
        setCurrentFocusedColumn(currentFocusedColumn - 1);
        newWordGrid[row][column].disabled = true;
        newWordGrid[row][column - 1].disabled = false;
      }
    }

    if (e.target.value.match(/^[a-z]$/)) {
      newWordGrid[row][column].letter = e.target.value;
      console.log(newWordGrid[row][column].letter)
      
      if (currentFocusedColumn  < 4){
        setCurrentFocusedColumn(currentFocusedColumn + 1);
        console.log(column+1);
        newWordGrid[row][column + 1].disabled = false;

        document.getElementById(row.toString() + column.toString()).blur();
        let nextBox = document.getElementById(row.toString() + (column + 1).toString());
        nextBox.focus();
        //newWordGrid[row][column ].disabled = true;
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

    for (let i = 0; i < priorWord.length; i++) {
      if (origonalCurrentWord.includes(priorWord[i].letter)) {
        priorWordCopy = priorWordCopy.replace(priorWord[i].letter, "");
        currentWordCopy = currentWordCopy.replace(priorWord[i].letter, "");
        discarded += priorWord[i].letter;
      }
    }
    console.log(priorWordCopy);
    console.log(currentWordCopy);
    for (let i = 1; i < priorWordCopy.length; i++) {
      if (priorWordCopy[i] !== priorWordCopy[0]) {
        isCorrect = false;
        console.log("hit1");
      }
    }
    if (priorWordCopy.length === 0 && currentWordCopy.length === 0) {
      isCorrect = false;
    }
    if (priorWordCopy.length !== currentWordCopy.length) {
      console.log("hit2");
      isCorrect = false;
    }
    if (discarded.includes(priorWordCopy[0])) {
      isCorrect = false;
      console.log("hit3");
    }

    if (!isCorrect)
      return [isCorrect];
    else
      return [isCorrect, priorWordCopy[0], currentWordCopy[0], priorWordCopy.length];
  }
  const handleNewGame = () => {
    let newWordGrid = [];
    for (let i = 0; i < 6; i++) {
      newWordGrid.push([])
    }
    setStartWord(startWord + 1 % 6);
    setEndWord(endWord + 1 % 6);
    setIsOpen(true);
    for (let i = 0; i < 5; i++) {
      newWordGrid[0].push({ letter: keyWordsStart[startWord + 1][i], color: 0, disabled:true, wrong:false })
      newWordGrid[5].push({ letter: keyWordsEnd[endWord + 1][i], color: 0, disabled:true, wrong:false   })
    }
    for (let i = 1; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        newWordGrid[i].push({ letter: "", color: 1, disabled:true, wrong:false  })
      }
    }
    newWordGrid[1][0].disabled=false;
    setWordGrid(newWordGrid);
  }

  const handleRules = () => {
    setRulesIsOpen(!rulesIsOpen);
  }

  const handleSubmit = () => {
    const newWordGrid = [...wordGrid]
    const priorWord = newWordGrid[currentFocusedRow - 1];
    const currentWord = newWordGrid[currentFocusedRow];
    let isCorrect = true;

    // todo check to see if its in giant word list

    // check word is "one away"/meets transform rules
    let wordCheck = "";
    for(let i = 0; i < currentWord.length; i++){
      wordCheck += currentWord[i].letter;
    }
    if (words.includes(wordCheck))
    {
      let output = checkOneAway(priorWord, currentWord, false);
      isCorrect = output[0];

      if (isCorrect === true) {
        let priorChanged = output[1];
        let currentChanged = output[2];
        let times = output[3];
        for(let i = 0; i < priorWord.length; i++){
          if(priorWord[i].letter === priorChanged){
            newWordGrid[currentFocusedRow - 1][i].color = currentColor;
          }
          if(currentWord[i].letter === currentChanged){
            if (times > 0){
              newWordGrid[currentFocusedRow][i].color = currentColor;
              times = times - 1;
            }
          }
        }
        setCurrentColor(currentColor + 1);
        console.log(isCorrect);
        newWordGrid[currentFocusedRow + 1][0].disabled=false;
        for (let i =0; i < 5; i++){
          newWordGrid[currentFocusedRow][i].disabled=true;
        }
        document.getElementById((currentFocusedRow + 1).toString() + "0").focus();
        setCurrentFocusedRow(currentFocusedRow + 1);
        setCurrentFocusedColumn(0);

      }
      output = checkOneAway(currentWord, end, true)
      if (isCorrect && output[0]) {
        let currentChanged = output[1];
        let endChanged = output[2];
        let times = output[3];
        for(let i = 0; i < priorWord.length; i++){
          if(currentWord[i].letter === currentChanged){
            newWordGrid[currentFocusedRow][i].color = currentColor+1;
          }
          if(newWordGrid[5][i].letter === endChanged){
            if(times > 0){
              newWordGrid[5][i].color = currentColor+1;
              times = times - 1;
            }
          }
        }
        setIsGameOver(true);
        document.getElementById((currentFocusedRow + 1).toString() + "0").blur();
        newWordGrid[currentFocusedRow + 1][0].disabled = true;
      }
    } else{
      isCorrect = false;
    }
    if (!isCorrect){
      for(let i = 0; i < 5; i++){
        newWordGrid[currentFocusedRow][i].wrong = true;
      }
      setIsGameOver(true);
      setVictoryIsOpen(true);
    }
    setWordGrid(newWordGrid);
  };


  function backspace(event, row, column){
    var key = event.keyCode || event.charCode;
    let currentColumn = 4;
    if (key === 8 && (row !== 0 && row !== 5 && row >= currentFocusedRow))
    {
      const newWordGrid = [...wordGrid];
      
      while (currentColumn >= 0){
        newWordGrid[row][currentColumn].letter = '';
        newWordGrid[row][currentColumn].disabled = true;
        newWordGrid[row][currentColumn].wrong = false;
        document.getElementById(row.toString() + column.toString()).blur();
        currentColumn--;
      }
      newWordGrid[row][0].disabled = false;
      document.getElementById(row.toString() + "0").focus();
      setCurrentFocusedColumn(0);
      setWordGrid(newWordGrid);
    }
    else if(key === 13){
      handleSubmit();
    }
  }

  return (
    <Div>
      {rulesIsOpen && <Popup
      content={<>
        <b className='victory'>Rules</b>
        <p>Transform and scramble words letter at a time. Change one of the letters in the word at a time and turn it into a new word.<br/> 
          Changing one letter in a word changes all the other letters in that word that are the same.<br/> For example, for o-{'>'}e, woody becomes weedy. 
          The goal is to transform the starting word to the final word!<br/>
        </p>
        
        </>}
      handleClose={toggleRulesPopup}
      />}

    {isOpen && <Popup
      content={<>
        <b>Cougs help Cougs!</b>
        <p>Coug Word Game</p>
        <b>"{keyWordsStart[startWord]}"</b>
        <p>{phrases[keyWordsStart[startWord]]}</p>
        <a href={phraseLink[startWord]}>Click Here To Learn More!</a>
        </>}
      handleClose={togglePopup}
      />}

      <CougleTitle><span style={{ color: '#981E32' }}>Coug</span><span style={{ color: '#53565A' }}>le</span></CougleTitle>
      {isGameOver && isVictoryOpen && <Popup
      content={<>
        <b className='victory'>Victory!</b>
        <br></br>
        <b className='center'>Go Cougs!</b>
        </>
        }
        handleClose={toggleVictoryPopup}
      />}
      {wordGrid.map((row, rowIndex) => (
        <RowWrapper key={rowIndex}>
          {row.map((col, colIndex) => (
            <Letter
              status={col.color}
              key={colIndex}
              value={wordGrid[rowIndex][colIndex].letter}
              onChange={(e) => handleChange(e, rowIndex, colIndex)}
              readOnly={wordGrid[rowIndex][colIndex].disabled}
              autoFocus={!wordGrid[rowIndex][colIndex].disabled}
              onKeyDown = {(e) => backspace(e, rowIndex, colIndex)}
              id = {rowIndex.toString() + colIndex.toString()}
              style={wordGrid[rowIndex][colIndex].wrong ? { color: '#D2042D' } : { color: 'black' }}
            />
          ))}
        </RowWrapper>
      ))}
      <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
      <row>
        <SubmitButton style={{marginRight: "4px"}} onClick={handleNewGame}>New Game</SubmitButton>
        <SubmitButton onClick={handleRules}>Rules</SubmitButton>
      </row>
    </Div>
  );
}

const Letter = styled.input`
  font-size:56px;
  background-color: ${(props) => {
    return colors[props.status];
  }};
  margin-right: 2px;
  margin-bottom: 6px;
  margin-top: 2px;
  padding: 5px;
  border-color: #53565A;
  width: 60px;
  height: 60px;
  text-align: center;
  border-radius: 8px;
`;

const Div = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const RowWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

const SubmitButton = styled.button`
  font-size: 30px;
  border-radius: 8px;
  background-color: #981E32;
  border-color: #981E32;
  padding: 14px;
  margin: 32px;
`;

const CougleTitle = styled.h1`
  font-size: 52px;
`

export default App;