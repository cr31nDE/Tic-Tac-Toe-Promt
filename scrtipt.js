let fields = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
]

function init() {
    render();
}

function render() {
    const contentDiv = document.getElementById('content');

    let tableHtml = '<table>';
    for (let i = 0; i < 3; i++) {
        tableHtml += '<tr>';
        for (let j = 0; j < 3; j++) {
            const index = i * 3 + j;
            let symbol = '';
            if (fields[index] === 'circle') {
                symbol = generateAnimatedCircleSVG();
            } else if (fields[index] === 'cross') {
                symbol = generateAnimatedCrossSVG();
            }
            tableHtml += `<td onclick="placeSymbol(${index})">${symbol}</td>`;
        }
        tableHtml += '</tr>';
    }
    tableHtml += '</table>';
    contentDiv.innerHTML = tableHtml;
}

function placeSymbol(index) {
    const tdElement = document.getElementsByTagName('td')[index];
    const currentSymbol = fields[index];

    if (!currentSymbol) {
        const nextSymbol = fields.filter(symbol => symbol !== null).length % 2 === 0 ? 'circle' : 'cross';
        fields[index] = nextSymbol;

        let symbol = '';
        if (nextSymbol === 'circle') {
            symbol = generateAnimatedCircleSVG();
        } else if (nextSymbol === 'cross') {
            symbol = generateAnimatedCrossSVG();
        }

        tdElement.innerHTML = symbol;
        tdElement.onclick = null; // Remove the onclick function after placing the symbol
        const winningCombination = checkWin();
        if (winningCombination) {
            drawWinningLine(winningCombination);
        }

    }
}

function checkWin() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontale Kombinationen
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertikale Kombinationen
        [0, 4, 8], [2, 4, 6] // Diagonale Kombinationen
    ];

    for (const combination of winningCombinations) {
        const [index1, index2, index3] = combination;
        if (fields[index1] && fields[index1] === fields[index2] && fields[index1] === fields[index3]) {
            return combination; // Gewinnende Kombination gefunden
        }
    }

    return null; // Keine Gewinnkombination gefunden
}

function drawWinningLine(combination) {
    const lineColor = '#ffffff';
    const lineWidth = 5;

    const startCell = document.querySelectorAll(`td`)[combination[0]];
    const endCell = document.querySelectorAll(`td`)[combination[2]];
    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();

    const lineLength = Math.sqrt(
        Math.pow(endRect.left - startRect.left, 2) + Math.pow(endRect.top - startRect.top, 2)
    );
    const lineAngle = Math.atan2(endRect.top - startRect.top, endRect.left - startRect.left);

    const line = document.createElement('div');
    line.setAttribute('id','line');
    line.style.position = 'absolute';
    line.style.width = `${lineLength}px`;
    line.style.height = `${lineWidth}px`;
    line.style.backgroundColor = lineColor;
    line.style.top = `${ startRect.top + startRect.height / 2 - lineWidth / 2 }px`;
    line.style.left = `${ startRect.left + startRect.width / 2 }px`;
    line.style.transform = `rotate(${ lineAngle }rad)`;
    line.style.transformOrigin =`top left`;
    document.body.appendChild(line);
}




function generateAnimatedCircleSVG() {
    const color = "#00B0EF";
    const svgWidth = 80; // Erhöhen Sie die Breite der SVG-Datei
    const svgHeight = 80; // Erhöhen Sie die Höhe der SVG-Datei
    const width = 70;
    const height = 70;

    // Calculate the radius of the circle
    const radius = width / 2;

    // Calculate the center of the SVG
    const centerX = svgWidth / 2;
    const centerY = svgHeight / 2;

    // Define the SVG HTML code
    const svgCode = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
            <circle cx="${centerX}" cy="${centerY}" r="${radius - 1}" fill="none" stroke="${color}" stroke-width="5">
                <!-- Animate the radius to fill the circle clockwise and end after 125ms -->
                <animate attributeName="r" from="0" to="${radius - 1}" dur="0.125s" fill="freeze" begin="0s" />

                <!-- Animate the stroke-dasharray to fill the circle clockwise and end after 125ms -->
                <animate attributeName="stroke-dasharray" from="0, ${2 * Math.PI * (radius - 1)}" to="${2 * Math.PI * (radius - 1)}, 0" dur="0.125s" fill="freeze" begin="0s" />
            </circle>
        </svg>
    `;

    return svgCode;
}






function generateAnimatedCrossSVG() {
    const color = "#FFC000";
    const width = 80;
    const height = 80;

    // Define the SVG HTML code
    const svgCode = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
            <!-- Group to apply the rotation transformation -->
            <g transform="rotate(45, ${width / 2}, ${height / 2})">
                <!-- Horizontal line of the cross -->
                <line x1="0" y1="${height / 2}" x2="${width}" y2="${height / 2}" stroke="${color}" stroke-width="5">
                    <!-- Animate the length of the horizontal line to fill the cross clockwise -->
                    <animate attributeName="x2" from="0" to="${width}" dur="0.125s" fill="freeze" />
                </line>
                <!-- Vertical line of the cross -->
                <line x1="${width / 2}" y1="0" x2="${width / 2}" y2="${height}" stroke="${color}" stroke-width="5">
                    <!-- Animate the length of the vertical line to fill the cross clockwise -->
                    <animate attributeName="y2" from="0" to="${height}" dur="0.125s" fill="freeze" />
                </line>
            </g>
        </svg>
    `;

    return svgCode;
}


function restart(){
    fields = [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
    ];
    let line = document.getElementById('line');
    if(line){
        line.remove();
    }
    render();
}





