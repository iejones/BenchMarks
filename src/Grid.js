import React from 'react'
import Word from "./Word"


export default function Grid() {
  return (
    <div>
        <Word input/>
        <Word/>
        <Word/>
        <Word/>
        <Word/>
        <Word/>
        <Word/>
    </div>
  )
}


const input = [
    { className: "third-box" },
    { style: { "color": "green" } },
  ]  