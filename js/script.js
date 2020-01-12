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
let center;
let angle = 0;
let keysDown={
    left:false,
    up:false,
    right:false,
    down:false,
}
let angles = [];
let endAngle;
let startAngle;
let rotate = true;
let change = 1;
let moved = false;
async function initializeCanvas(){
    mainCanvas = document.getElementById("drawCanvas");
    mainCanvas.width = mainCanvas.clientWidth;
    mainCanvas.height = mainCanvas.clientHeight;
    scaleX = mainCanvas.clientWidth/1918;
    scaleY = mainCanvas.clientHeight/916;
    context = mainCanvas.getContext("2d"); 
    initializeSizes();
    await generateMaze();
    calcGrid(gridArray);
    for(let i=0;i<collisionLines.length;i++){
        let tempPoint1 = {x:collisionLines[i].x1,y:collisionLines[i].y1};
        let tempPoint2 = {x:collisionLines[i].x2,y:collisionLines[i].y2}
        tempPoint1 = angleOf(tempPoint1,center);
        tempPoint2 = angleOf(tempPoint2,center);
        angles.push({p1:tempPoint1,p2:tempPoint2});
    }
    endAngle = angleOf(endCellInfo,center);
    startAngle = angleOf({x:playerPos.startX,y:playerPos.startY},center);
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
	rotateGrid(collisionLines,angle);
    drawGrid(collisionLines);
    if(angle >= 360)
        angle = 0;
    if(rotate)
        angle+=0.1;
	/*cellSize.width+=change;
	cellSize.height+=change;
	if(cellSize.width >= 80)
		change=-1;
	if(cellSize.width <= 40)
		change=1;*/
    context.beginPath();
    context.strokeStyle = "#00FF00";
    context.fillStyle = "#00FF00";
    context.arc(playerPos.x,playerPos.y,8,0,Math.PI*2);
    context.fill();
    context.stroke();
    changeSpeed();
    checkCollisions();
    movePlayer();
    if(!moved){
        playerPos.x = playerPos.startX;
        playerPos.y = playerPos.startY;
    }
    if(pointInsideCircle(playerPos,endCellInfo)){
		rotate = false;
		document.getElementById("info").innerHTML = "win";
	}
    requestAnimationFrame(tick);
}
function movePlayer(){
    playerPos.x+=speedX;
    playerPos.y+=speedY;
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
    moved = true;
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
        for(let t=0;t<1;t+=0.01){
            let pointX = collisionLines[i].x1+t*(collisionLines[i].x2-collisionLines[i].x1);
            let pointY = collisionLines[i].y1+t*(collisionLines[i].y2-collisionLines[i].y1);
            if(pointInsideCircle(playerPos,{x:pointX,y:pointY})){
                playerPos.x=playerPos.startX;
                playerPos.y=playerPos.startY;
                moved = false;
            }
        }
        
    }
}
function calcGrid(gridArray){
    collisionLines = [];
    let r = Math.sqrt(2)*cellSize.width/2;
    for(let i=0;i<gridArray.length;i++){
        for(let j=0;j<gridArray[i].length;j++){
            for(let k=0;k<gridArray[i][j].length;k++){
                if(gridArray[i][j].charAt(k) == "1"){         
                    if(k == 0){
                        collisionLines.push({x1:begin.x+Math.cos(toRadians(-45+90*(k-1)))*r+cellSize.width*j,y1:begin.y+Math.sin(toRadians(-45+90*(k-1)))*r+cellSize.height*i,
                        x2:begin.x+Math.cos(toRadians(-45+90*(k)))*r+cellSize.width*j+1,y2:begin.y+Math.sin(toRadians(-45+90*(k)))*r+cellSize.height*i});
                    }  
                    else if(k == 1){
                        collisionLines.push({x1:begin.x+Math.cos(toRadians(-45+90*(k-1)))*r+cellSize.width*j,y1:begin.y+Math.sin(toRadians(-45+90*(k-1)))*r+cellSize.height*i,
                        x2:begin.x+Math.cos(toRadians(-45+90*(k)))*r+cellSize.width*j,y2:begin.y+Math.sin(toRadians(-45+90*(k)))*r+cellSize.height*i+1});
                    }   
                    else if(k == 2){
                        collisionLines.push({x1:begin.x+Math.cos(toRadians(-45+90*(k-1)))*r+cellSize.width*j+1,y1:begin.y+Math.sin(toRadians(-45+90*(k-1)))*r+cellSize.height*i,
                        x2:begin.x+Math.cos(toRadians(-45+90*(k)))*r+cellSize.width*j,y2:begin.y+Math.sin(toRadians(-45+90*(k)))*r+cellSize.height*i});
                    }
                    else if(k == 3){
                        collisionLines.push({x1:begin.x+Math.cos(toRadians(-45+90*(k-1)))*r+cellSize.width*j,y1:begin.y+Math.sin(toRadians(-45+90*(k-1)))*r+cellSize.height*i+1,
                        x2:begin.x+Math.cos(toRadians(-45+90*(k)))*r+cellSize.width*j,y2:begin.y+Math.sin(toRadians(-45+90*(k)))*r+cellSize.height*i});
                    }
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
        drawCell({x:playerPos.startX,y:playerPos.startY},"#0000FF");
    if(typeof endCell !="undefined")
        drawCell(endCellInfo,"#FF0000");
}
function toRadians(angle){
    return angle*(Math.PI/180);
}
function rotateGrid(collisionLines,angle){
    for(let i=0;i<collisionLines.length;i++){
        let point1 = {x:collisionLines[i].x1,y:collisionLines[i].y1};
        let point2 = {x:collisionLines[i].x2,y:collisionLines[i].y2};
        collisionLines[i].x1 = center.x+Math.cos(toRadians(angle+angles[i].p1))*(distanceBetween(point1,center));
        collisionLines[i].y1 = center.y+Math.sin(toRadians(angle+angles[i].p1))*(distanceBetween(point1,center));
        collisionLines[i].x2 = center.x+Math.cos(toRadians(angle+angles[i].p2))*(distanceBetween(point2,center));
        collisionLines[i].y2 = center.y+Math.sin(toRadians(angle+angles[i].p2))*(distanceBetween(point2,center));
    }
	let endc = {x:endCellInfo.x,y:endCellInfo.y,r:endCellInfo.r};
	let startc = {x:playerPos.startX,y:playerPos.startY};
    endCellInfo.x = center.x+Math.cos(toRadians(angle+endAngle))*distanceBetween(endc,center);
    endCellInfo.y = center.y+Math.sin(toRadians(angle+endAngle))*distanceBetween(endc,center);
    playerPos.startX = center.x+Math.cos(toRadians(angle+startAngle))*distanceBetween(startc,center);
    playerPos.startY = center.y+Math.sin(toRadians(angle+startAngle))*distanceBetween(startc,center);


}
function angleOf(p1,p2){
    let deltaY = (p1.y-p2.y);
    let deltaX = (p1.x-p2.x);
    return Math.atan2(deltaY,deltaX)*(180/Math.PI);
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
    endCellInfo={
        x:begin.x+cellSize.width*(endCell%mazeSize.width),
        y:begin.y+cellSize.height*Math.trunc(endCell/mazeSize.width),
		r:8,
    }

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
    context.arc(cellToDraw.x,cellToDraw.y,cellSize.width/2-3,0,Math.PI*2);
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
        x:500*scaleX,
        y:170*scaleX,
    }
    cellSize={
        width:50*scaleX,
        height:50 	*scaleX,
    }
    mazeSize={
        width:13,
        height:13,
    }
    center={
        x:(begin.x+cellSize.width*mazeSize.width/2),
        y:(begin.y+cellSize.height*mazeSize.height/2),
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}