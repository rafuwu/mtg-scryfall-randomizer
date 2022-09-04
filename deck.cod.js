const COD_DECK_FILE_TEMPLATE = `<?xml version="1.0" encoding="UTF-8"?>
<cockatrice_deck version="1">
    <deckname>{DECKNAME}</deckname>
    <comments>{COMMENTS}</comments>
    <zone name="main">
        {CARDS}
    </zone>
</cockatrice_deck>
`

const COD_DECK_CARD_TEMPLATE = '<card number="{NUMBER}" name="{NAME}"/>'


function generateCodContents(card_list_complex, date) {
    // Card tenplate replacement
    let codXmlCardArray = new Array
    for (let i = 0; i < card_list_complex.length; i++) {
        var a = COD_DECK_CARD_TEMPLATE
        var a = a.replace("{NUMBER}", card_list_complex[i].number)
        var a = a.replace("{NAME}", card_list_complex[i].name)
        
        codXmlCardArray.push(a)
        
    }
    console.debug(codXmlCardArray)

    // Card XML plain text
    let codXmlCardText = codXmlCardArray.join("\n        ")
    console.debug(codXmlCardText)

    // COD file final template replacement
    let codFile = COD_DECK_FILE_TEMPLATE
    codFile = codFile.replace("{DECKNAME}", date)
    codFile = codFile.replace("{COMMENTS}", 'This deck was generated using "MTG card randomizer"')
    codFile = codFile.replace("{CARDS}", codXmlCardText)
    console.debug(codFile)

    return codFile
}

export {generateCodContents}
