from collections import Counter
import json

def loadWords():
    with open('fiveletterwords.txt', 'r') as f:
        words = f.read().splitlines() 
    print("Number of words: ", len(words))
    return words

def checkOneAway(start, end):
    # if not the same length, reject
    if len(start) != len(end):
        return False, None

    # could number of each letter
    startCounter = Counter(start) 
    endCounter = Counter(end)
    oldLetter = None
    newLetter = None

    # for every letter in start word, check for that letter in end word
    for key, value in startCounter.items():
        if key not in endCounter:
            if oldLetter:
                # more than one letter in end word that is not in end word
                # so more than one away
                return False, None
            # fould which letter was removed from the start word
            oldLetter = value
            removedLetter = key
        else:
            endValue = endCounter[key]
            # if more instance of the letter, could be the new letter
            if  endValue > value:
                if newLetter is None:
                    newLetter = endValue - value
                else:
                    # more than one new letter
                    return False, None
            elif endValue < value:
                # Can't have less of a letter than before (all change - so either same, more, or none)
                return False, None
        # remove letter from end counter        
        del endCounter[key]
    
    if len(endCounter) == 1 and newLetter is None:
        # if one remaining letter and haven't already found new letter, that is the new letter
        newLetter = list(endCounter.values())[0]
    if len(endCounter) > 1:
        # more than one letter changed
        return False, None
    else:
        if newLetter is None or oldLetter is None:
            # same word/anagram
            return False, None 
        # check new letter and old letter have same value
        if newLetter == oldLetter:
            return True, removedLetter
        return False, None

def testOneAway():
    goods = [("first", "frost"), ("cross", "scars"), ("catch", "cache"), ("tract", "attic"), ("frogs", "gross"), ("abccd", "cdcca"), ("aaada", "aaaaa")]
    bads = [("first", "roast"), ("abcde", "fghjk"), ("cacti", "ashes"), ("frogs", "cross"), ("shore", "epoch")]
    passing = True
    for start, end in goods:
        if not checkOneAway(start, end)[0]:
            print("Fail: thinks ({0},{1}) is not one away".format(start, end))
            passing = False
    for start, end in bads:
        if checkOneAway(start, end)[0]:
            print("Fail: thinks ({0},{1}) is one away when it is not".format(start, end))
            passing = False
    print(passing)
    return passing

def makeOneAwayDictionary(words):
    oneAwayDictionary = dict()
    for startWord in words:
        for endWord in words:
            result, removedLetter = checkOneAway(startWord, endWord)
            if result:
                partners = oneAwayDictionary.get(startWord, list())
                partners.append((endWord, removedLetter))
                oneAwayDictionary[startWord] = partners
    return oneAwayDictionary

if __name__ == "__main__":
    if testOneAway():
        words = loadWords()
        oneAwayDictionary = makeOneAwayDictionary(words[:2000]) # limiting to earlier words so more frequent words are used
        with open("oneAwayDictionary.json", "w") as f:
            json_object = json.dumps(oneAwayDictionary, indent = 4) 
            f.write(json_object)
