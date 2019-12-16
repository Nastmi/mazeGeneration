let mainCanvas;
let context;
let scaleX;
let scaleY;
function initializeCanvas(){
    mainCanvas = document.getElementById("drawCanvas");
    mainCanvas.width = mainCanvas.clientWidth;
    mainCanvas.height = mainCanvas.clientHeight;
    scaleX = mainCanvas.clientWidth/1920;
    scaleY = mainCanvas.clientHeight/749;
    context = mainCanvas.getContext("2d"); 
    //drawGrid();
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
                        case 0:context.moveTo(100+100*j,100+100*i);context.lineTo(100+100*j+100,100+100*i);break;
                        case 1:context.moveTo(100+100*j+100,100+100*i);context.lineTo(100+100*j+100,100+100*i+100);break;
                        case 2:context.moveTo(100+100*j+100,100+100*i+100);context.lineTo(100+100*j,100+100*i+100);break;
                        case 3:context.moveTo(100+100*j,100+100*i+100);context.lineTo(100+100*j,100+100*i);break;
                    }
                    context.stroke();
                }
            }
        }
    }
}


function generateMaze(){
    let gridLength = 6;
    let gridArray = Array(6).fill().map(() => Array(6).fill("1111"));
    let visited = [];
    let stack = [];
    drawGrid(gridArray);
    let currentCell = Math.floor(Math.random()*35);/*getCell(Math.floor(Math.random()*36).toString);*/
    while(true){
        if(!visited.includes(currentCell))
            visited.push(currentCell);
        if(!stack.includes(currentCell))
            stack.push(currentCell);
        let sur = returnSurroundingCells(currentCell, gridLength);
        console.log(currentCell);
        let checked = []; 
        while(true){
            let index = Math.floor(Math.random()*4);
            console.log("longth "+stack.length+" visot "+visited.length+" checj "+checked.length+" indiox "+index);
            if(checked.length >= 4){
                stack.pop();
                console.log("bfr "+currentCell);
                currentCell = stack[stack.length-1];
                console.log("adftr "+currentCell);
                break;
            }
            if(sur[index]<0 || sur[index]>35 || (index == 1 && sur[index]%gridLength == 0) || (index == 3 && sur[index]%gridLength == 1)){
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
                    /*console.log("replacing wall "+index+ " on cell "+currentCell);
                    console.log("The moving onto cell "+sur[index]);*/
                    gridArray[Math.trunc(currentCell/gridLength)][currentCell%gridLength] = replaceCharAt(gridArray[Math.trunc(currentCell/gridLength)][currentCell%gridLength],index,"0");
                    currentCell = sur[index];
                    switch(index){
                        case 0:
                        case 1:index=index+2;break;
                        case 2:
                        case 3:index=index-2;break;
                    }
                   // console.log("and replacing wall "+index);
                    gridArray[Math.trunc(currentCell/gridLength)][currentCell%gridLength] = replaceCharAt(gridArray[Math.trunc(currentCell/gridLength)][currentCell%gridLength],index,"0");
                    break;
                }
            }
        }
        if(visited.length >= 36)
            break;
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