function generateDecContents(card_list_complex) {
    // Card array
    let decCardArray = new Array
    for (let card of card_list_complex) {
        decCardArray.push(card.number + " " + card.name)
    }
    console.debug(decCardArray)

    // Card list as text
    let decCardText = decCardArray.join("\n")
    console.debug(decCardText)

    // Terminate file with a newline
    let decFile = decCardText + "\n"
    return decFile
}

export {generateDecContents}
