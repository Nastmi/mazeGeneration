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
    generateMaze();
}


function generateMaze(){
    let visited = [];
    let stack = [];
    let currentCell = Math.floor(Math.random()*37);/*getCell(Math.floor(Math.random()*36).toString);*/
    while(true){
        visited.push(currentCell);
        stack.push(currentCell);
        let sur = returnSurroundingCells(currentCell);
        let checked = [];
        while(true){
            let index = Math.floor(Math.random()*4);
            if(checked.length == 4){
                currentCell = stack[stack.indexOf(currentCell)-1];
                stack.pop();
                break;
            }
            if(sur[index]<0 || sur[index]>36){
                if(!checked.includes(index))
                    checked.push(index);
                continue;
            }
            else{
                if(visited.includes(sur[index])){
                    if(!checked.includes(index)){
                        console.log("pushed index");
                        checked.push(index);
                    }
                    continue;
                }
                else{
                    currentCell = sur[index];
                    context.beginPath();
                    if(index == 0){
                        context.moveTo(parseInt(currentCell.toString.split("")[0])*10,parseInt(currentCell.toString.split("")[1])*10);
                        context.lineTo(parseInt(currentCell.toString.split("")[0])*10+100,parseInt(currentCell.toString.split("")[1])*10);
                    }
                    context.stroke();
                    break;
                }
            }
        }
       // console.log("am out now");
        if(visited.length >= 36)
            break;
    }
}
function returnSurroundingCells(cellNum){
    return [cellNum-1,cellNum+1,cellNum-10,cellNum+10];
}