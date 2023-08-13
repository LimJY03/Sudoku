// Game initialization
const specialTile = [
    document.querySelector('#row1 > div.col2'),
    document.querySelector('#row2 > div.col5'),
    document.querySelector('#row1 > div.col7'),
    document.querySelector('#row5 > div.col3'),
    document.querySelector('#row6 > div.col6'),
    document.querySelector('#row6 > div.col8'),
    document.querySelector('#row7 > div.col1'),
    document.querySelector('#row9 > div.col4'),
    document.querySelector('#row9 > div.col7')
]
let selectedTileElem = null;
var rowArr = []
var colArr = []
var blockArr = []

// Tile initialization
var tileGridArr = Array.from(document.querySelectorAll('[class^=col]'))
for (let elem of tileGridArr) elem.addEventListener('click', selectTile)

// Keypad initialization
var keypadGridArr = Array.from(document.querySelectorAll('[id^=keypad]'))
for (let elem of keypadGridArr) elem.addEventListener('click', insertDigit)
document.getElementById('erase').addEventListener('click', removeDigit)

// Decode initialization
const decodeMap = {
    code1: 'J',
    code2: 'I',
    code3: 'E',
    code4: 'H',
    code5: 'U',
    code6: 'I',
    code7: '5',
    code8: '2',
    code9: '0'
}

// Delay function
const delay = (ms) => new Promise((res) => setTimeout(res, ms))

// Select tile to insert digit
function selectTile() {

    // Deselect initial tile
    if (selectedTileElem != null) {
        selectedTileElem.classList.remove('tile-selected')
    }

    // Select new tile
    selectedTileElem = this

    // Update selected state
    if (!selectedTileElem.classList.contains('fixed')) {  
        
        selectedTileElem.classList.add('tile-selected')

        let [row, col, block] = selectedTileElem.id.split('-')
        rowArr = Array.from(document.querySelectorAll(`#row${row} > div`)).map((elem) => elem.innerHTML)
        colArr = Array.from(document.getElementsByClassName(`col${col}`)).map((elem) => elem.innerHTML)
        blockArr = Array.from(document.getElementsByClassName(`block${block}`)).map((elem) => elem.innerHTML)
    }
}

// Select digit from keypad
function insertDigit() {

    let selectedDigitElem = this

    if (selectedDigitElem && selectedTileElem != null && !selectedTileElem.classList.contains('fixed')) {
        
        let digit = selectedDigitElem.innerHTML
        selectedTileElem.innerHTML = digit

        // Validate
        if (rowArr.includes(digit) || colArr.includes(digit) || blockArr.includes(digit)) {
            selectedTileElem.classList.add('wrong-digit')
        }
        else if (selectedTileElem.classList.contains('wrong-digit')) {
            selectedTileElem.classList.remove('wrong-digit')
        }
        // checkError()
        completed()
    }
}

// Remove digit from tile
function removeDigit() {
    if (!selectedTileElem.classList.contains('fixed')) {
        selectedTileElem.innerHTML = null
    }
    if (selectedTileElem.classList.contains('wrong-digit')) {
        selectedTileElem.classList.remove('wrong-digit')
    }
}

// // Verify error state
// function checkError() {
//     errorArr = Array.from(document.getElementsByClassName('wrong-digit'))
//     console.log(errorArr)
//     for (let elem of errorArr) {
//         let digit = elem.innerHTML
//         let [row, col, block] = elem.id.split('-')
//         rowArr = Array.from(document.querySelectorAll(`#row${row} > div`)).map((elem) => elem.innerHTML)
//         colArr = Array.from(document.getElementsByClassName(`col${col}`)).map((elem) => elem.innerHTML)
//         blockArr = Array.from(document.getElementsByClassName(`block${block}`)).map((elem) => elem.innerHTML)
//         console.log(rowArr)
//         console.log(colArr)
//         console.log(blockArr)
//         if (!rowArr.includes(digit) && !colArr.includes(digit) && !blockArr.includes(digit)) {
//             elem.classList.remove('wrong-digit')
//         }
//     }
// }

// Check game completion
function completed() {

    tileGridArr = Array.from(document.querySelectorAll('[class^=col]'))
    
    for (let elem of tileGridArr) {
        if (elem.classList.contains('wrong-digit')) return
        if (elem.innerHTML == null || elem.innerHTML == '') return
    }

    // Completion
    predecode()
}

// Predecode
async function predecode() {

    // Loading
    await delay(1_000)
    
    // Highlight blocks
    for (let elem of specialTile) elem.style.backgroundColor = 'orange'

    // Display at left panel
    var leftPanelArr = Array.from(document.getElementsByClassName('code'))
    for (let i = 0; i < leftPanelArr.length; i++) {
        leftPanelArr[i].innerHTML = specialTile[i].innerHTML
        leftPanelArr[i].style.backgroundColor = 'orange'
    }

    // Display equivalent text    
    await delay(2_000)

    document.getElementById('overlay').classList.remove('hidden')
    document.getElementById('overlay').innerHTML = `
        <div id="stage-complete">
            <span id="checkmark" class="material-symbols-outlined">check_circle</span>
            Stage Complete
        </div>`
    document.getElementById('overlay').style.cursor = 'pointer'
    document.getElementById('overlay').addEventListener('click', decode)
}

// Decoding
async function decode() {

    document.getElementById('sudoku-board').remove()
    document.getElementById('sudoku-choose').remove()
    document.getElementById('overlay').remove()

    await delay(1_000)
    document.getElementById('sudoku-decode').style.display = 'flex'
    document.getElementById('sudoku-decode').style.left = 'auto'
    document.getElementById('sudoku-decode-text').innerHTML = 'Click Each Cell To Show Decrypted Value'

    const codeTiles = Array.from(document.getElementsByClassName('code'))
    codeTiles.forEach((tile) => tile.classList.add('code-2nd-phase'))
    codeTiles.forEach((tile) => tile.addEventListener('click', reveal))
}

function reveal() {
    this.style.backgroundColor = ""
    this.innerHTML = decodeMap[this.id]
    this.style.color = 'green'
    this.classList.add('decoded')
    complete2ndPhase()
}

function complete2ndPhase() {
    const codeTiles = Array.from(document.getElementsByClassName('code'))
    for (let tile of codeTiles) if (!tile.classList.contains('decoded')) return
    document.getElementById('sudoku-decode-text').innerHTML = 'Congratulations!'
    document.getElementById('confetti').hidden = false
    document.getElementById('confetti').innerHTML = `
    <div class="confetti">
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
    </div>`
}