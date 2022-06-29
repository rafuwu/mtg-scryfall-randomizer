const COCKATRICE_DECK_TEMPLATE_START = `<?xml version="1.0" encoding="UTF-8"?>
<cockatrice_deck version="1">
    <deckname>{DECKNAME}</deckname>
    <comments>{COMMENTS}</comments>
    <zone name="main">
        {CARDS}
    </zone>
</cockatrice_deck>
`

const COCKATRICE_DECK_TEMPLATE_CARD = '<card number="{NUMBER}" name="{NAME}"/>'

let card_list = new Array


// Function to download data to a file
function download(text, filename, type) {
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

function addCardToList(card) {
    card_list.push(card.name)
    console.log(card_list)
    return card_list
}

function downloadCod() {
    
}