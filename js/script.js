let mainCanvas;
let context;
let startCell;
let endCell;
let endCellInfo;
let begin;
let cellSize;
let mazeSize;
let gridArray;
let cellsToDraw = [];
let date =  new Date();
let datePath = new Date();
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
let change = 0.0;
let moved = false;
let cellNum = 15;
let currentSeconds = 0;
let additionToTime = 0;
let pointsToSolve = [];
let solveAngles = [];
let timer = true;
let fired = false;
let sPress = 0;
let numOfDeaths = 0;
let seconds = 0;
let minutes = 0;
async function initializeCanvas(){
    document.getElementById("rangeSlider").value = "15";
    mainCanvas = document.getElementById("drawCanvas");
    mainCanvas.width = mainCanvas.clientWidth;
    mainCanvas.height = mainCanvas.clientHeight;
    context = mainCanvas.getContext("2d"); 
    initializeSizes(mainCanvas.width,mainCanvas.height, 15);
    await generateMaze();
    calcGrid(gridArray);
    for(let i=0;i<collisionLines.length;i++){
        let tempPoint1 = {x:collisionLines[i].x1,y:collisionLines[i].y1};
        let tempPoint2 = {x:collisionLines[i].x2,y:collisionLines[i].y2}
        tempPoint1 = angleOf(tempPoint1,center);
        tempPoint2 = angleOf(tempPoint2,center);
        angles.push({p1:tempPoint1,p2:tempPoint2});
    }
    solveMaze();
    pointsToSolve.push({x:endCellInfo.x,y:endCellInfo.y});
    for(let i=0;i<pointsToSolve.length;i++){
        solveAngles.push(angleOf(pointsToSolve[i],center));
    }
    endAngle = angleOf(endCellInfo,center);
    startAngle = angleOf({x:playerPos.startX,y:playerPos.startY},center);
    window.addEventListener("keydown",keyBoolean,true);
    window.addEventListener("keyup",stop,true);
    tick();
}
async function tick(){
    if(new Date()-date >= 1000 && timer){
        currentSeconds++;
        seconds = Math.floor((currentSeconds+additionToTime)%60);
        minutes = Math.floor((currentSeconds+additionToTime)/60);
        if(seconds < 10){
            seconds = "0"+seconds;
        }
        if(minutes<10){
            minutes="0"+minutes;
        }
        document.getElementById("timer").innerHTML = minutes+":"+seconds;
        date = new Date();
    }
    calcGrid(gridArray);
	rotateGrid(collisionLines,angle);
    drawGrid(collisionLines);
    if(sPress < 3){
       /* rotatePath(angle);
        drawPath();*/
    }
    if(angle >= 360)
        angle = 0;
    if(rotate)
        angle+=change;
    context.beginPath();
    console.log(angle);
    changeSpeed();
    checkCollisions();
    movePlayer();
    if(!moved){
        playerPos.x = playerPos.startX;
        playerPos.y = playerPos.startY;
    }
    if(circleInsideCircle(playerPos,endCellInfo)){
        rotate = false;
        timer = false;
		document.getElementById("win").style.color = "#00FF00";
        document.getElementById("win").innerHTML = "You won!";
        if(!fired){
            Swal.fire({
                title: "Victory!",
                text: "You have sucesfully completed the maze, with "+ numOfDeaths+" deaths. Time spent was "+ minutes+":"+seconds+". Close this window and press new maze to play again! ",
                icon: "success",
                background:"#FFFFFF"
            })
            fired = true;
        }
    }
    drawPlayer();
    requestAnimationFrame(tick);
}
function rotatePath(angle){
    //angle = 90;
    for(let i=0;i<pointsToSolve.length;i++){
        console.log(angle+solveAngles[i]);
        let distance = distanceBetween(pointsToSolve[i],center);
        pointsToSolve[i].x = center.x+Math.cos(toRadians(angle+solveAngles[i]))*distance;
        pointsToSolve[i].y = center.y+Math.sin(toRadians(angle+solveAngles[i]))*distance;
    }
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
function drawPath(){
    context.strokeStyle = "#FF0000";
    context.fillStyle = "#FF0000";
    context.beginPath();
    for(let i=1;i<pointsToSolve.length;i++){
        context.moveTo(pointsToSolve[i-1].x,pointsToSolve[i-1].y);
        context.lineTo(pointsToSolve[i].x,pointsToSolve[i].y);
    }
    context.stroke();
}
function movePlayer(){
    playerPos.x+=speedX;
    playerPos.y+=speedY;
}
function drawPlayer(){
    let quarter = cellSize.width/6;
    context.strokeStyle = "#00FF00";
    context.fillStyle = "#00FF00";
    context.arc(playerPos.x,playerPos.y,quarter,0,Math.PI*2);
    context.fill();
    context.stroke();
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
function distanceBetweenCircle(circle1,circle2){    
    return Math.sqrt((circle2.x-circle1.x)*(circle2.x-circle1.x)+(circle2.y-circle1.y)*(circle2.y-circle1.y));
}
function circleInsideCircle(circle1,circle2){
    if(distanceBetweenCircle(circle1,circle2) < circle1.r+circle2.r){
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
            moved = true;
            break;
        case 38:    
            keysDown.up = true;
            moved = true;
            break;
        case 39:
            keysDown.right = true;
            moved = true;
            break;
        case 40:
            keysDown.down = true;
            moved = true;
            break;
        case 83:
            sPress++;

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
                numOfDeaths++;
				document.getElementById("win").innerHTML = "Status: you have died "+numOfDeaths+" times";
				document.getElementById("win").style.color = "#FF0000";
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
    context.lineWidth = 1;
    for(let i=0;i<gridToDraw.length;i++){
        context.beginPath();
        context.moveTo(gridToDraw[i].x1,gridToDraw[i].y1);
        context.lineTo(gridToDraw[i].x2,gridToDraw[i].y2);
        context.stroke();
    }
    if(typeof startCell !="undefined")
        drawCell({x:playerPos.startX,y:playerPos.startY},"#0000FF");
    if(typeof endCell !="undefined")
        drawCell(endCellInfo,"#0000FF");
}
function toRadians(angle){
    return angle*(Math.PI/180);
}
function angleOf(p1,p2){
    let deltaY = (p1.y-p2.y);
    let deltaX = (p1.x-p2.x);
    return Math.atan2(deltaY,deltaX)*(180/Math.PI);
}
async function newMaze(){
    numOfDeaths = 0;
    fired = false;
    timer = true;
    currentSeconds = -1;
	document.getElementById("win").innerHTML = "You are currently playing!";
	document.getElementById("win").style.color = "#0000FF";
    collisionLines = [];
    angles = []; 	
    rotate = true;
    initializeSizes(mainCanvas.width,mainCanvas.height);
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
}
function changeSize(){
    cellNum = parseInt(document.getElementById("rangeSlider").value);
    document.getElementById("curSize").innerHTML = cellNum;
    
}
function changeRotationSpeed(newSpeed, title){
    change = newSpeed;
    document.getElementById("dropdownButton").innerHTML = title;
}
async function generateMaze(){
    try{
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
            r:cellSize.width/8,
        }
        endCell = returnEdgeCell();
        endCellInfo={
            x:begin.x+cellSize.width*(endCell%mazeSize.width),
            y:begin.y+cellSize.height*Math.trunc(endCell/mazeSize.width),
            r:cellSize.width/2,
        }

    }
    catch(err){
        newMaze();
    }

}
async function solveMaze(){
    let visited = [];
    let stack = [];
    cellsToDraw = [];
    let currentCell = startCell;
    let countBack = 0;
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
                pointsToSolve.pop();
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
                pointsToSolve.push({x:currentCell%mazeSize.width*cellSize.width+begin.x,y:Math.trunc(currentCell/mazeSize.width)*cellSize.width+begin.y});
                currentCell = sur[index];
                break;
            }
        }
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
    scaleX = mainCanvas.clientWidth/1176;
    //scaleY = mainCanvas.clientHeight/916;
    mainCanvas.width = mainCanvas.clientWidth;
    mainCanvas.height = mainCanvas.clientHeight;
    initializeSizes();
	playerPos.x = playerPos.x*scaleX;
	playerPos.y = playerPos.y*scaleX;
	endCellInfo.x = endCellInfo.x*scaleX;
	endCellInfo.y = endCellInfo.y*scaleX;
    context.clearRect(0,0,mainCanvas.clientWidth,mainCanvas.clientHeight);
}
function initializeSizes(width, height){
    let rect = mainCanvas.getBoundingClientRect();
    let num = 0;
    mazeSize={
        width:cellNum,
        height:cellNum
    }
    if(width > height){
        num = (height/Math.sqrt(2))/mazeSize.width;
    }
    else{
        num = (width/Math.sqrt(2))/mazeSize.width;
    }
    cellSize={
        width:num,
        height:num
    }
    begin={
        x:(rect.x+mainCanvas.clientWidth/2)-(cellSize.width*mazeSize.width/2-cellSize.width/2)-rect.left,
        y:(rect.y+mainCanvas.clientHeight/2)-(cellSize.height*mazeSize.height/2-cellSize.height/2)-rect.top,
    }
    center={
        x:(begin.x+cellSize.width*mazeSize.width/2-cellSize.width/2),
        y:(begin.y+cellSize.height*mazeSize.height/2-cellSize.height/2),
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
