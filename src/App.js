import { useEffect, useState } from 'react';
import styled from "styled-components";
import './App.css';

const colors = {0:"#53565A", 1:"grey", 2: "red", 3:"orange", 4:"yellow", 5:"green", 6:"blue"};


function App() {
  const [wordGrid, setWordGrid] = useState([]);
  const [currentColor, setCurrentColor] = useState(2);
  const [currentFocusedRow, setCurrentFocusedRow] = useState(1);
  const [currentFocusedColumn, setCurrentFocusedColumn] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const start = "meals";
  const end = "bongo";
  useEffect(() => {
    function initializeWordGrid() {
      let newWordGrid = [];
      for (let i = 0; i < 6; i++) {
        newWordGrid.push([])
      }


      for (let i = 0; i < 5; i++) {
        newWordGrid[0].push({ letter: start[i], color: 0, disabled:true })
        newWordGrid[5].push({ letter: end[i], color: 0, disabled:true  })
      }

      for (let i = 1; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          newWordGrid[i].push({ letter: "", color: 1, disabled:true  })
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

  function myFocusFunction(e, row, col) {
    //document.getElementById(row.toString() + col.toString()).style.backgroundColor = "yellow";
  }

  const handleSubmit = () => {
    const newWordGrid = [...wordGrid]
    const priorWord = newWordGrid[currentFocusedRow - 1];
    const currentWord = newWordGrid[currentFocusedRow];
    let isCorrect = true;

    // todo check to see if its in giant word list

    // check word is "one away"/meets transform rules
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
    }
    setWordGrid(newWordGrid);

  };

  function backspace(event, row, column){
    var key = event.keyCode || event.charCode;
    if (key === 8)
    {
      const newWordGrid = [...wordGrid];
      newWordGrid[row][column].letter = '';
      if (currentFocusedColumn > 0){
        setCurrentFocusedColumn(currentFocusedColumn - 1);
        newWordGrid[row][column].disabled = true;
        newWordGrid[row][column - 1].disabled = false;
        document.getElementById(row.toString() + column.toString()).blur();
        let nextBox = document.getElementById(row.toString() + (column - 1).toString());
        nextBox.focus();
      }
      setWordGrid(newWordGrid);
    }
    else if(key === 13){
      handleSubmit();
    }
  }

  return (
    <Div>
      {isGameOver && <div>YOU WIN</div>}
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
            />
          ))}
        </RowWrapper>
      ))}
      <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
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
  padding: 2px;
  width: 60px;
  height: 60px;
  text-align: center;
  border-radius: 5px;
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
  font-size: 24px;
  border-radius: 8px;
  background-color: #981E32;
  padding: 14px;
  margin: 16px;
`;

export default App;
