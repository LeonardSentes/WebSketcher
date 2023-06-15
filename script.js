const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
let isDrawing = false;
let undoStack = [];
let redoStack = [];
let selectedTool = 'pen';
let selectedColor = '#000000';

const undoButton = document.getElementById('undoButton');
const redoButton = document.getElementById('redoButton');
const penButton = document.getElementById('penButton');
const eraserButton = document.getElementById('eraserButton');

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);
undoButton.addEventListener('click', undo);
redoButton.addEventListener('click', redo);
penButton.addEventListener('click', setToolToPen);
eraserButton.addEventListener('click', setToolToErase);

window.addEventListener('DOMContentLoaded', () => {
  
  const colorsCatalog = document.getElementById('colorsCatalog');
  const colorsButton = document.getElementById('colorsButton');
  const colorsInput = document.getElementById('colors');

  colorsCatalog.style.display = 'none';

  const ctx = canvas.getContext('2d');

  ctx.strokeStyle = selectedColor;

  colorsButton.addEventListener('click', () => {
    colorsInput.click();
  });

  colorsInput.addEventListener('change', () => {
    selectedColor = colorsInput.value;
    
    console.log('Selected Color:', selectedColor);

    ctx.strokeStyle = selectedColor;
  });
});


window.addEventListener('DOMContentLoaded', () => {
  const downloadButton = document.getElementById('downloadButton');

  const ctx = canvas.getContext('2d');



  downloadButton.addEventListener('click', () => {
    const dataURL = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'drawing.png';
    link.click();
  });
});


function startDrawing(event) {
  isDrawing = true;
  draw(event);
}

function draw(event) {
  if (!isDrawing) return;

  const x = event.clientX - canvas.offsetLeft;
  const y = event.clientY - canvas.offsetTop;

  if (selectedTool === 'pen') {
    context.lineWidth = 5;
    context.lineCap = 'round';
    context.strokeStyle = selectedColor;
    context.lineTo(x, y);
    context.stroke();
    context.beginPath();
    context.moveTo(x, y);
  } else if (selectedTool === 'eraser') {
    context.clearRect(x, y, 20, 20);
  }

  const currentState = context.getImageData(0, 0, canvas.width, canvas.height);
  undoStack.push(currentState);
  redoStack = [];

  updateUndoRedoButtons();
}

function stopDrawing() {
  isDrawing = false;
  context.beginPath();
}

function undo() {
  if (undoStack.length > 1) {
    redoStack.push(undoStack.pop());
    context.putImageData(undoStack[undoStack.length - 1], 0, 0);
  } else {
    clearCanvas();
  }

  updateUndoRedoButtons();
}

function redo() {
  if (redoStack.length > 0) {
    context.putImageData(redoStack[redoStack.length - 1], 0, 0);
    undoStack.push(redoStack.pop());
  }

  updateUndoRedoButtons();
}

function setToolToPen() {
  selectedTool = 'pen';
  canvas.style.cursor = 'crosshair';
}

function setToolToErase() {
  selectedTool = 'eraser';
  canvas.style.cursor = 'default';
}

function setColor(event) {
  selectedColor = event.target.value;
}

function colorFill() {
  context.fillStyle = selectedColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
}


function updateUndoRedoButtons() {
  undoButton.disabled = undoStack.length === 1;
  redoButton.disabled = redoStack.length === 0;
}



