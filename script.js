const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
let isDrawing = false;
let undoStack = [];
let redoStack = [];
let selectedTool = 'pen';
let selectedColor = 'black';

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

  const ctx = canvas.getContext('2d');

  ctx.strokeStyle = selectedColor;
  context.lineCap = 'round';

colorsButton.addEventListener('click', () => {
  colorsInput.click();
  colorsInput.style.display = colorsCatalog.style.display === 'none' ? 'block' : 'none';
});

  colorsInput.addEventListener('change', () => {
    selectedColor = colorsInput.value;
    
    console.log('Selected Color:', selectedColor);

    ctx.strokeStyle = selectedColor;
  });
});


window.addEventListener('DOMContentLoaded', () => {
  const downloadButton = document.getElementById('downloadButton');

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

  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  if (selectedTool === 'pen') {
    context.lineWidth = 5;
    context.lineCap = 'round';
    context.strokeStyle = selectedColor;
    context.lineTo(x, y);
    context.stroke();
    context.beginPath();
    context.moveTo(x, y);
  } else if (selectedTool === 'eraser') {
    context.clearRect(x, y, 30, 30);
  }

  const currentState = context.getImageData(0, 0, canvas.width, canvas.height);
  undoStack.push(currentState);
  redoStack = [];
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
}

function redo() {
  if (redoStack.length > 0) {
    context.putImageData(redoStack[redoStack.length - 1], 0, 0);
    undoStack.push(redoStack.pop());
  }
}

function setToolToPen() {
  selectedTool = 'pen';
  canvas.style.cursor = 'crosshair';
}

function setToolToErase() {
  selectedTool = 'eraser';
  canvas.style.cursor = 'crosshair';
}

function setColor(event) {
  selectedColor = event.target.value;
  canvas.style.cursor = 'crosshair';
}



