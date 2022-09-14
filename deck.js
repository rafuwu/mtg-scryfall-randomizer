import {generateCodContents} from "./deck.cod.js"
import {generateDecContents} from "./deck.dec.js"

let card_list = new Array


// Function to download data to a file. Doesn't return anything.
function downloadFile(text, filename, type) {
    var file = new Blob([text], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

// Adds leading zeros so that numbers have two digits.
// RETURNS: Two-digit number
function addLeadingZeros(x) {
    if (x < 10) {
        x = "0" + x
    }

    return x
}


// Defines date.
// RETURNS: date (string)
function defineDate() {
    // https://www.w3schools.com/jsref/jsref_obj_date.asp
    let d = new Date()
    let year = d.getFullYear()
    let month = addLeadingZeros(d.getMonth()+1)
    let day = addLeadingZeros(d.getDate())
    let hour = addLeadingZeros(d.getHours())
    let minutes = addLeadingZeros(d.getMinutes())
    let seconds = addLeadingZeros(d.getSeconds())

    let date = `${year}-${month}-${day}_${hour}-${minutes}-${seconds}`
    console.log(date)

    return date
}


// If the input is the number 0, it empties the list and returns an empty list.
// If the input is the number 1, it just returns the list.
// If the input is a card, it adds it (its name) to the card array list, later used for saving decks.
function editCardList(card) {
    switch (card) {
        case 0:
            card_list = []
            console.log("Emptied card list")
            return card_list
        case 1:
            return card_list
        default:
            card_list.push(card.name)
            console.debug("Card list array: ", card_list)
            return card_list
    }
}


// This function creates a complex list of cards that stores cards only once along with its count.
// This complex list is used for generating a Cockatrice deck and is only generated once per needed deck creation.
// RETURNS: card_list_complex (Array)
function generateComplexCardList() {
    let card_list_complex = new Array
    /*   ------- Array example ------- 
     *
     *   [
     *       {
     *           "number" : 3,
     *           "name" : "Example 1"
     *       },
     *       {
     *           "number" : 1,
     *           "name" : "Example 2"
     *       }
     *   ]
    */

    for (let i = 0; i < card_list.length; i++) {
        // If card_list[i] doesn't exist somewhere in the array of objects that is card_list_complex, add it
        if (!card_list_complex.some(elem => elem.name === card_list[i])) {
            card_list_complex.push({
                "number" : 1,
                "name" : card_list[i]
            })
        } else { // If if exists already somewhere, find it and add +1 to the counter
            for (let j = 0; j < card_list_complex.length; j++) {
                if (card_list_complex[j].name == card_list[i]) {
                    card_list_complex[j].number += 1
                    break
                }
                
            }
        }
        
    }

    console.debug("Complex card list object array:\n",card_list_complex)

    return card_list_complex
}


// This function calls all necessary functions to download a Cockatrice deck, and it does so. Doesn't return anything.
function downloadCod() {
    let date = defineDate()
    let card_list_complex = generateComplexCardList()
    let codFile = generateCodContents(card_list_complex, date)
    downloadFile(codFile, "Cockatrice_" + date + ".cod", "text/plain")
}


// This function calls all necessary functions to download a .dec file, and it does so. Doesn't return anything.
function downloadDec() {
    let date = defineDate()
    let card_list_complex = generateComplexCardList()
    let decFile = generateDecContents(card_list_complex)
    downloadFile(decFile, date + ".cod", "text/plain")
}


// This function calls all necessary functions to copy .dec deck to the clipboard, and it does so. Doesn't return anything.
// Browser support: https://caniuse.com/mdn-api_clipboard_writetext | https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText#browser_compatibility
function copyDecToClipboard() {
    let card_list_complex = generateComplexCardList()
    let decFile = generateDecContents(card_list_complex)
    
    try {
        navigator.clipboard.writeText(decFile);
    } catch (error) {
        alert("Copying deck to clipboard failed!\nThe browser needs to support the Clipboard API.\n\nPlease see browser compatibility.")
        window.open("https://caniuse.com/mdn-api_clipboard_writetext", "_blank", "height=560,width=853,resizable=yes")
    }
}


export {editCardList as addCardToList, downloadCod, downloadDec, copyDecToClipboard}
