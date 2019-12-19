let mainCanvas;
let context;
let scaleX;
let scaleY;
let startCell;
let endCell;
let begin;
let cellSize;
let mazeSize;
let gridArray;
let cellsToDraw = [];
function initializeCanvas(){
    mainCanvas = document.getElementById("drawCanvas");
    mainCanvas.width = mainCanvas.clientWidth;
    mainCanvas.height = mainCanvas.clientHeight;
    scaleX = mainCanvas.clientWidth/1920;
    scaleY = mainCanvas.clientHeight/749;
    context = mainCanvas.getContext("2d"); 
    initializeSizes();
    generateMaze();
    tick();
}
function tick(){
    drawGrid(gridArray);
    requestAnimationFrame(tick);
}
function drawGrid(gridArray){
    context.clearRect(0,0,mainCanvas.clientWidth,mainCanvas.clientHeight);
    context.strokeStyle="#FFFFFF";
    context.fillStyle = "#FFFFFF";
    context.lineWidth = 2;
    let numOfLoop = 0;
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
          /*  context.font = "13px Sans Serif";
            context.fillText(numOfLoop,begin.x+cellSize.width*j+cellSize.width/2,begin.y+cellSize.height*i+cellSize.height/2);*/
            numOfLoop++;
        }
    }
    if(typeof startCell !="undefined")
        drawCell(startCell,"#0000FF");
    if(typeof endCell !="undefined")
        drawCell(endCell,"#FF0000")  
}

function beginGame(){
    
}
function triangleArea(){

}
async function generateMaze(){
    gridArray = Array(mazeSize.height).fill().map(() => Array(mazeSize.width).fill("1111"));
    let visited = [];
    let stack = [];
    drawGrid(gridArray);
    let currentCell = Math.floor(Math.random()*(mazeSize.height*mazeSize.width-1));
    while(visited.length < mazeSize.width*mazeSize.height 	){
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
                cellsToDraw.pop();
                cellsToDraw.push(cellsToDraw.push({cell:currentCell,color:"#FF0000"}));
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
                    cellsToDraw.push({cell:currentCell,color:"#0000FF"});
                    break;
                }
            }
        }
        drawGrid(gridArray);
       /* cellsToDraw.forEach(cell => drawCell(cell.cell,cell.color));
        await sleep(100);*/
    }
    startCell = returnEdgeCell();
    endCell = returnEdgeCell();
    console.log("start "+startCell+" end "+endCell);
    drawGrid(gridArray); 
}




async function solveMaze(){
    let visited = [];
    let stack = [];
    cellsToDraw = [];
    let currentCell = startCell;
    while(currentCell != endCell){
        if(!visited.includes(currentCell))
            visited.push(currentCell);
        if(!stack.includes(currentCell))
            stack.push(currentCell);
        let sur = returnSurroundingCells(currentCell, mazeSize.width);
        let checked = []; 
        while(true){
            let index = Math.floor(Math.random()*4);
            if(checked.length >= 4){
				console.log("yes");
                stack.pop();
                cellsToDraw.pop();
                cellsToDraw.push(cellsToDraw.push({cell:currentCell,color:"#FF0000"}));
                currentCell = stack[stack.length-1];
                break;
            }
            if(sur[index]<0 || sur[index]>mazeSize.width*mazeSize.height-1 || (index == 1 && sur[index]%mazeSize.width == 0) || (index == 3 && sur[index]%mazeSize.width == mazeSize.width-1)){
                if(!checked.includes(index))
                    checked.push(index);
                continue;
            }
			if(visited.includes(sur[index])){
				if(!checked.includes(index))
                    checked.push(index);
                continue;
			}
			if(gridArray[Math.trunc(currentCell/mazeSize.width)][currentCell%mazeSize.width].charAt(index) == "1"){
				if(!checked.includes(index))
                    checked.push(index);
                continue;
			}
            else if(gridArray[Math.trunc(currentCell/mazeSize.width)][currentCell%mazeSize.width].charAt(index) == "0"){
                currentCell = sur[index];
                cellsToDraw.push({cell:currentCell,color:"#0000FF"});
                break;
            }
        }
        /*cellsToDraw.forEach(cell => drawCell(cell.cell,cell.color));
        await sleep(100);*/ 
    }
}
function drawCell(cellToDraw, color){
    context.strokeStyle = color;
    context.fillStyle = color;
    context.beginPath();
    context.fillRect(begin.x+cellSize.height*(cellToDraw%mazeSize.width)+1,begin.y+cellSize.width*Math.trunc(cellToDraw/mazeSize.width)+1,cellSize.width-2,cellSize.height-2);
}
function returnSurroundingCells(cellNum, gridLength){
    return [cellNum-gridLength,cellNum+1,cellNum+gridLength,cellNum-1];
}
function returnEdgeCell(){
    while(true){
        let cell = Math.floor(Math.random()*(mazeSize.height*mazeSize.width-1));
        if(cell == startCell || cell == endCell)
            continue;
        if(cell < mazeSize.width)
            return cell;
        else if(cell > mazeSize.width*mazeSize.height-mazeSize.width)
            return cell;
        else if(cell % mazeSize.width == 0)
            return cell;
        continue;
    }
}
function replaceCharAt(string, index, replace){
    return string.substring(0,index)+replace+string.substring(index+1,string.length);
}


window.onresize = changeScale;

function changeScale(){
    scaleX = mainCanvas.clientWidth/1670;
    scaleY = mainCanvas.clientHeight/900;

}
function initializeSizes(){
    begin={
        x:500,
        y:100,
    }
    cellSize={
        width:45,
        height:45,
    }
    mazeSize={
        width:15,
        height:15,
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}