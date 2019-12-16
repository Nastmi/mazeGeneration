let mainCanvas;
let context;
let scaleX;
let scaleY;
let startCell;
let endCell;
let begin={
    x:50,
    y:50,
}
let cellSize={
    width:50,
    height:50,
}
let mazeSize={
    width:15,
    height:15,
}
function initializeCanvas(){
    mainCanvas = document.getElementById("drawCanvas");
    mainCanvas.width = mainCanvas.clientWidth;
    mainCanvas.height = mainCanvas.clientHeight;
    scaleX = mainCanvas.clientWidth/1920;
    scaleY = mainCanvas.clientHeight/749;
    context = mainCanvas.getContext("2d"); 
    generateMaze();
}
function drawGrid(gridArray){
    context.strokeStyle="#FFFFFF";
    for(let i=0;i<gridArray.length;i++){
        for(let j=0;j<gridArray[i].length;j++){
            for(let k=0;k<gridArray[i][j].length;k++){
                if(gridArray[i][j].charAt(k) == "1"){ 
                    context.beginPath();
                    switch(k){
                        case 0:context.moveTo(begin.x+cellSize.width*j,begin.y+cellSize.height*i);context.lineTo(begin.x+cellSize.width*j+cellSize.width,begin.y+cellSize.height*i);break;
                        case 1:context.moveTo(begin.x+cellSize.width*j+cellSize.width,begin.y+cellSize.height*i);context.lineTo(begin.x+cellSize.width*j+cellSize.width,begin.y+cellSize.height*i+cellSize.height);break;
                        case 2:context.moveTo(begin.x+cellSize.width*j+cellSize.width,begin.y+cellSize.height*i+cellSize.height);context.lineTo(begin.x+cellSize.width*j,begin.y+cellSize.height*i+cellSize.height);break;
                        case 3:context.moveTo(begin.x+cellSize.width*j,begin.y+cellSize.height*i+cellSize.height);context.lineTo(begin.x+cellSize.width*j,begin.y+cellSize.height*i);break;
                    }
                    context.stroke();
                }
            }
        }
    }
}


function generateMaze(){
    let gridArray = Array(mazeSize.height).fill().map(() => Array(mazeSize.width).fill("1111"));
    let visited = [];
    let stack = [];
    drawGrid(gridArray);
    let currentCell = Math.floor(Math.random()*(mazeSize.height*mazeSize.width-1));
    while(visited.length < mazeSize.width*mazeSize.height){
        if(!visited.includes(currentCell))
            visited.push(currentCell);
        if(!stack.includes(currentCell))
            stack.push(currentCell);
        let sur = returnSurroundingCells(currentCell, mazeSize.width);
        let checked = []; 
        while(true){
            let index = Math.floor(Math.random()*4);
            if(checked.length >= 4){
                stack.pop();
                currentCell = stack[stack.length-1];
                break;
            }
            if(sur[index]<0 || sur[index]>mazeSize.width*mazeSize.height-1 || (index == 1 && sur[index]%mazeSize.width == 0) || (index == 3 && sur[index]%mazeSize.width == mazeSize.width-1)){
                if(!checked.includes(index))
                    checked.push(index);
                continue;
            }
            else{
                if(visited.includes(sur[index])){
                    if(!checked.includes(index)){
                        checked.push(index);
                    }
                    continue;
                }
                else{
                    gridArray[Math.trunc(currentCell/mazeSize.width)][currentCell%mazeSize.width] = replaceCharAt(gridArray[Math.trunc(currentCell/mazeSize.width)][currentCell%mazeSize.width],index,"0");
                    currentCell = sur[index];
                    switch(index){
                        case 0:
                        case 1:index=index+2;break;
                        case 2:
                        case 3:index=index-2;break;
                    }
                    gridArray[Math.trunc(currentCell/mazeSize.width)][currentCell%mazeSize.width] = replaceCharAt(gridArray[Math.trunc(currentCell/mazeSize.width)][currentCell%mazeSize.width],index,"0");
                    break;
                }
            }
        }
    }
    context.clearRect(0,0,mainCanvas.clientWidth,mainCanvas.clientHeight);
    drawGrid(gridArray);
    
}
function returnSurroundingCells(cellNum, gridLength){
    return [cellNum-gridLength,cellNum+1,cellNum+gridLength,cellNum-1];
}
function replaceCharAt(string, index, replace){
    return string.substring(0,index)+replace+string.substring(index+1,string.length);
}
window.onresize = changeScale;

function changeScale(){
    scaleX = mainCanvas.clientWidth/1920;
    scaleY = mainCanvas.clientHeight/749;
}