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
    let currentCell = Math.floor(Math.random()*36+1);/*getCell(Math.floor(Math.random()*36).toString);*/
    while(true){
        visited.push(currentCell);
        stack.push(currentCell);
        let sur = returnSurroundingCells(currentCell, gridLength);
        let checked = []; 
        while(true){
            let index = Math.floor(Math.random()*4);
            if(checked.length == 4){
                currentCell = stack[stack.indexOf(currentCell)-1];
                stack.pop();
                break;
            }
            if(sur[index]<1 || sur[index]>36 || (index == 0 && sur[index]%gridLength == 0) || (index == 1 && sur[index]%gridLength == 1)){
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
                    currentCell = sur[index];
                    console.log(Math.floor(currentCell/6)+" "+currentCell%5);
                    console.log(gridArray[Math.floor(currentCell/5)][currentCell%5]);
                    
                   /* switch(index){
                        case 0:gridArray[Math.floor(currentCell/6)-1][currentCell%6] = replaceCharAt(gridArray[Math.floor(currentCell/6)][currentCell%6],index+2,"0");break;
                        case 1:gridArray[Math.floor(currentCell/6)][currentCell%6-1] = replaceCharAt(gridArray[Math.floor(currentCell/6)][currentCell%6],index+2,"0");break;
                        case 2:gridArray[Math.floor(currentCell/6)+1][currentCell%6] = replaceCharAt(gridArray[Math.floor(currentCell/6)][currentCell%6],index-2,"0");break;
                        case 3:gridArray[Math.floor(currentCell/6)][currentCell%6+1] = replaceCharAt(gridArray[Math.floor(currentCell/6)][currentCell%6],index-2,"0");break;
                    }*/
                    break;
                }
            }
        }
        if(visited.length >= 36)
            break;
    }
    drawGrid(gridArray);
}
function returnSurroundingCells(cellNum, gridLength){
    return [cellNum-1,cellNum+1,cellNum-gridLength,cellNum+gridLength];
}
function replaceCharAt(string, index, replace){
    return string.substring(0,index)+replace+string.substring(index+1,string.length);
}