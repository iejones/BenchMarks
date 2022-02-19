import { useEffect, useState } from 'react';
import styled from "styled-components";
import './App.css';

function App() {
  const [wordGrid, setWordGrid] = useState([]);
  const [currentFocusedRow, setCurrentFocusedRow] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const solution = "daisy";

  useEffect(() => {
    function initializeWordGrid() {
      let newWordGrid = [];
      for (let i = 0; i<6; i++){
        newWordGrid.push([])
      }
      for(let i = 0; i < 6; i++){
        for (let j=0; j<5; j++){
          newWordGrid[i].push({letter:"", state:"empty"})
        }
      }

      setWordGrid(newWordGrid);
    }

    if (wordGrid.length === 0){
      initializeWordGrid();
    }
  });

  const handleChange = (e, row, column)=> {
    const newWordGrid = [...wordGrid]

    console.log(e.target.value)
    console.log(newWordGrid[row][column].letter)
    if (e.target.value.match(/^[a-z]$/))
    {
      newWordGrid[row][column].letter = e.target.value;
      console.log(newWordGrid[row][column].letter)
      setWordGrid(newWordGrid);
    }
  }

  const handleSubmit = () => {
    const newWordGrid = [...wordGrid]
    const currentWord = newWordGrid[currentFocusedRow];
    let isCorrect = true;
    for (let i = 0; i < currentWord.length; i++){
      if (currentWord[i].letter === solution[i]) {
        currentWord[i].state = "correct";
      }
      else if (solution.includes(currentWord[i].letter)){
        currentWord[i].state = "wrongposition";
        isCorrect = false;
      }
      else {
        currentWord[i].state = "incorrect";
        isCorrect = false;
      }

      if (isCorrect === false){
        setCurrentFocusedRow(currentFocusedRow + 1);
      }
      setIsGameOver(isCorrect);
      setWordGrid(newWordGrid);
    }
  };

  return(
    <Div>
      {isGameOver && <div>Game Over</div>}
      {wordGrid.map((row, rowIndex) => (
        <RowWrapper key={rowIndex}>
          {row.map((col, colIndex) => (
            <Letter
            status = {col.state}
            key={colIndex}
            value ={wordGrid[rowIndex][colIndex].letter}
            onChange={(e) => handleChange(e, rowIndex, colIndex)}
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
    if(props.status === "correct"){
      return "green";
    } else if (props.status === "wrongposition"){
      return "yellow";
    } else if (props.status === "incorrect"){
      return "red";
    } else if (props.status === "empty"){
      return "grey";
    }
  }};
  padding: 8px;
  width: 40px;
  height: 40px;
`;

const Div= styled.div`
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
  background-color: blue;
  padding: 16px;
`;

export default App;
