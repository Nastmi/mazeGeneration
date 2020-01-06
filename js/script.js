let mainCanvas;
let context;
let scaleX;
let scaleY;
let startCell;
let endCell;
let endCellInfo;
let begin;
let cellSize;
let mazeSize;
let gridArray;
let cellsToDraw = [];
let date = Date.now();
let collisionLines = [];
let playerPos;
let speedX=0;
let speedY=0;
let keysDown={
    left:false,
    up:false,
    right:false,
    down:false,
}
async function initializeCanvas(){
    mainCanvas = document.getElementById("drawCanvas");
    mainCanvas.width = mainCanvas.clientWidth;
    mainCanvas.height = mainCanvas.clientHeight;
    console.log(mainCanvas.clientWidth+"  "+mainCanvas.clientHeight);
    scaleX = mainCanvas.clientWidth/1918;
    scaleY = mainCanvas.clientHeight/916;
    context = mainCanvas.getContext("2d"); 
    initializeSizes();
    await generateMaze();
    window.addEventListener("keydown",keyBoolean,true);
    window.addEventListener("keyup",stop,true);
    tick();
}
async function tick(){
    /*if(Date.now()-date >= 10 && begin.x+mazeSize.width*cellSize.width < mainCanvas.clientWidth){
        begin.x+= 10;
        date = Date.now();
    }*/
    calcGrid(gridArray);
    drawGrid(collisionLines);
    context.beginPath();
    context.strokeStyle = "#00FF00";
    context.fillStyle = "#00FF00";
    context.arc(playerPos.x,playerPos.y,8,0,Math.PI*2);
    context.fill();
    context.stroke();
    changeSpeed();
    movePlayer();
    checkCollisions();
    requestAnimationFrame(tick);
}
function movePlayer(){
    playerPos.x+=speedX;
    playerPos.y+=speedY;
}
async function checkBegin(e){
     
}
function pointInsideCircle(circle, point){
    point ={
        x:Math.trunc(point.x),
        y:Math.trunc(point.y),
    }
    if(distanceBetween(circle,point)<circle.r){
        return true;
    }
    return false;
}
function distanceBetween(a,b){
    return Math.sqrt(((a.x-b.x)*(a.x-b.x))+((a.y-b.y)*(a.y-b.y)));
}
function keyBoolean(e){
    switch(e.keyCode){
        case 37:
            keysDown.left = true;
            break;
        case 38:
            keysDown.up = true;
            break;
        case 39:
            keysDown.right = true;
            break;
        case 40:
            keysDown.down = true;
            break;
    }
}
function changeSpeed(){
        if(speedX>-2 && keysDown.left)
            speedX-=2;
        if(speedY>-2 && keysDown.up)
            speedY-=2;
        if(speedX<2 && keysDown.right)
            speedX+=2;
        if(speedY<2 && keysDown.down)
            speedY+=2;
        if(!keysDown.left && !keysDown.right)    
            speedX=0;
        if(!keysDown.up && !keysDown.down)    
        speedY=0;
}
function stop(e){
    switch(e.keyCode){
        case 37:
            keysDown.left = false;
            break;
        case 38:
            keysDown.up = false;
            break;
        case 39:
            keysDown.right = false;
            break;
        case 40:
            keysDown.down = false;
            break;
    }
}
function checkCollisions(e){
    for(let i=0;i<collisionLines.length;i++){
        if(lineIntersectCircle(collisionLines[i],playerPos)<playerPos.r){
            console.log(collisionLines[i]);
            playerPos.x=playerPos.startX;
            playerPos.y=playerPos.startY;
            document.getElementById("info").innerHTML = "ded";
        }
        else{
            
        }
    }
}
function lineIntersectCircle(line, circle){
    return Math.abs((line.y2-line.y1)*circle.x-(line.x2-line.x1)*circle.y+line.x2*line.y1-line.y2*line.x1)/Math.sqrt(((line.y2-line.y1)*(line.y2-line.y1)+(line.x2-line.x1)*(line.x2-line.x1)));
}
function calcGrid(gridArray){
    collisionLines = [];
    let r = Math.sqrt(2)*cellSize.width/2;
    let angle = 90;
    let startAngle = -45;
    let center={
        x:begin.x+mazeSize.width*cellSize.width/2,
        y:begin.x+mazeSize.height*cellSize.height/2
    }
    for(let i=0;i<gridArray.length;i++){
        for(let j=0;j<gridArray[i].length;j++){
            for(let k=0;k<gridArray[i][j].length;k++){
                if(gridArray[i][j].charAt(k) == "1"){               
                    collisionLines.push({x1:begin.x+Math.cos(toRadians(startAngle+angle*(k-1)))*r+cellSize.width*j,y1:begin.y+Math.sin(toRadians(startAngle+angle*(k-1)))*r+cellSize.height*i,
                    x2:begin.x+Math.cos(toRadians(startAngle+angle*(k)))*r+cellSize.width*j,y2:begin.y+Math.sin(toRadians(startAngle+angle*(k)))*r+cellSize.height*i});
                }
            }
        }
    } 
}
function drawGrid(gridToDraw){
    context.strokeStyle="#FFFFFF";
    context.fillStyle = "#FFFFFF";
    context.clearRect(0,0,mainCanvas.clientWidth,mainCanvas.clientHeight);
    context.lineWidth = 2;
    for(let i=0;i<gridToDraw.length;i++){
        context.beginPath();
        context.moveTo(gridToDraw[i].x1,gridToDraw[i].y1);
        context.lineTo(gridToDraw[i].x2,gridToDraw[i].y2);
        context.stroke();
    }
    if(typeof startCell !="undefined")
        drawCell(startCell,"#0000FF");
    if(typeof endCell !="undefined")
        drawCell(endCell,"#FF0000");
}
function toRadians(angle){
    return angle*(Math.PI/180);
}
function beginGame(){
    
}
async function generateMaze(){
    gridArray = Array(mazeSize.height).fill().map(() => Array(mazeSize.width).fill("1111"));
    let visited = [];
    let stack = [];
    let checked = [];
   // let rnd = Math.trunc(Math.random()*15);
    let currentCell = Math.floor(Math.random()*(mazeSize.height*mazeSize.width-1));
    while(visited.length < mazeSize.width*mazeSize.height){
        if(!visited.includes(currentCell))
            visited.push(currentCell);
        if(!stack.includes(currentCell))
            stack.push(currentCell);
        let sur = returnSurroundingCells(currentCell, mazeSize.width);
        let index = Math.floor(Math.random()*4);
        if(checked.length >= 4){
            stack.pop();
            cellsToDraw.pop();
            cellsToDraw.push(cellsToDraw.push({cell:currentCell,color:"#FF0000"}));
            currentCell = stack[stack.length-1];
            checked = [];
            //rnd = Math.trunc(Math.random()*15);
            continue;
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
               // rnd = Math.trunc(Math.random()*15);
                continue;
            }
        }
       /* cellsToDraw.forEach(cell => drawCell(cell.cell,cell.color));
        await sleep(100);*/
    }
    startCell = returnEdgeCell();
    playerPos={
        startX:begin.x+cellSize.width*(startCell%mazeSize.width),
        startY:begin.y+cellSize.height*Math.trunc(startCell/mazeSize.width),
        x:begin.x+cellSize.width*(startCell%mazeSize.width),
        y:begin.y+cellSize.height*Math.trunc(startCell/mazeSize.width),
        r:8,
    }
    endCell = returnEdgeCell();
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
    context.beginPath();
    context.strokeStyle = color;
    context.fillStyle = color;
    context.arc(begin.x+cellSize.width*(cellToDraw%mazeSize.width),begin.y+cellSize.height*Math.trunc(cellToDraw/mazeSize.width),cellSize.width/2-3,0,Math.PI*2);
    context.fill();
    context.stroke();
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
    mainCanvas.width = mainCanvas.clientWidth;
    mainCanvas.height = mainCanvas.clientHeight;
    scaleX = mainCanvas.clientWidth/1918;
    scaleY = mainCanvas.clientHeight/916;

    initializeSizes();
    context.clearRect(0,0,mainCanvas.clientWidth,mainCanvas.clientHeight);
}
function initializeSizes(){
    begin={
        x:100*scaleX,
        y:100*scaleX,
    }
    cellSize={
        width:45*scaleX,
        height:45*scaleX,
    }
    mazeSize={
        width:17,
        height:17,
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}