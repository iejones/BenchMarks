# BenchMarks

A word game for desktops. 

## Game Rules
Transform the start word to the final word.

For each step:
* Change one letter to any other letter
* All instances of the letter must change
* Only real words are allowed
* Scrambling the letters is allowed

For example, with e->o, "these" becomes "shoot".     
 
You have 5 steps.

### Examples
There can be more than one solution path. Here are some for "bench" to "marks".

bench -> beach -> reach -> march -> marsh -> marks

bench -> beach -> reach -> share -> shark -> marks
# Hackathon Start
This project started at a the WSU Crimson Code Hackathon 2022.
The origonal repo is https://github.com/realassnerdclaire/Cougle.git

# React App
App made with [create react app](https://create-react-app.dev/).  You will need to have [Node >= 14.0.0 and npm >= 5.6](https://nodejs.org/en/). Once npm installed, run with `npm start`.

Published with github pages. Published part is on gh-pages branch. Run `npm run deploy` to deploy current branch.

# References
[Five letter word list](https://www-cs-faculty.stanford.edu/~knuth/sgb-words.txt)

We were inspired to make a word game by [wordle](https://www.nytimes.com/games/wordle/index.html), but our game is distinct.

We started by referencing this [tutorial](https://www.youtube.com/watch?v=BE25Mf8t5DE&t=0s) that was a rough attempt at copying wordle.
