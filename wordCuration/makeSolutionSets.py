import json
import random

# check two strings don't share any letters
def checkWordsDisjoint(word1, word2):
    firstSet = set(word1)
    secondSet = set(word2)
    return firstSet.isdisjoint(secondSet)

# try to find a 5 step (or less) solution
def findSolution(oneAwayDictionary, start):
        solution = []
        removed = set()
        remaining = set(start)
        current = start
        for i in range(5):
            # get all the words that are one letter away, do not contain any removed letters, and will remove one of the letters remaining in our start word
            options = [(word, letter) for word, letter in oneAwayDictionary[current] if removed.isdisjoint(word) and letter in remaining]
            if len(options) > 0:
                next, letter = options[random.randint(0, len(options) - 1)]
                solution.append(current)
                removed.add(letter)
                remaining.remove(letter)
                current = next
            else:
                # no options, dead solution
                return None
            if checkWordsDisjoint(start, current):
                    # start and current word are disjoint (no overlap of letters), this is a solution
                    solution.append(current)
                    return solution
        return None

def makeCougSolutionSets():
    with open("cougWords.json", 'r') as f:
        cougWords = json.load(f)

    with open("oneAwayDictionary.json", "r") as f:
        oneAwayDictionary = json.load(f)
    
    solutions = {}
    for start in cougWords.keys():
        for i in range(5): # give 5 tries in case unlucky
            solution = findSolution(oneAwayDictionary, start)
            if solution is not None:
                break
        if solution is not None:
            solutions[start] = solution
    
    return solutions
            
            

if __name__ == "__main__":
    soltuions = makeCougSolutionSets()
    with open("solutionSets.json", 'w') as f:
        json_object = json.dumps(soltuions, indent = 4) 
        f.write(json_object)
