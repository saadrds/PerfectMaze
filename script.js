const query = window.location.search;
const parameters = new URLSearchParams(query);
let mazeHeight = parameters.get('height');
let mazeWidth = parameters.get('width');
//initialization fase
//matrix of the maze
let matrix = [];

for (let index = 0; index < mazeHeight; index++) {
    matrix[index] = new Array(mazeWidth);
    
}


for (let i = 0; i < mazeHeight; i++) {
    for (let j = 0; j < mazeWidth; j++) {
        matrix[i][j] = "  ";
        
    }
    
}
//wall exists if the it's matrix value is 1 , it's not if 0
//by default, all the wall exist

//2 tables will be needed to chose randomly a wall to eliminate
randomizerVertical = new Array((mazeWidth-1) * mazeHeight);
randomizerHorizontal = new Array((mazeHeight-1) * mazeWidth);

//matrix of the vertical walls
verticalWallMatrix = [];

for (let index = 0; index < mazeHeight; index++) {
    verticalWallMatrix[index] = new Array(mazeWidth-1);
    
}

let c = 0
for (let i = 0; i < mazeHeight; i++) {
    for (let j = 0; j < mazeWidth - 1; j++) {
        verticalWallMatrix[i][j] = 1;
        randomizerVertical[c] = [i,j];
        c++;
        
    }
    
}

//matrix of the horizontal walls
horizontalWallMatrix = [];



for (let index = 0; index < mazeHeight; index++) {
    horizontalWallMatrix[index] = new Array(mazeWidth);
    
}

c = 0;

for (let i = 0; i < mazeHeight-1; i++) {
    for (let j = 0; j < mazeWidth; j++) {
        horizontalWallMatrix[i][j] = 1;
        randomizerHorizontal[c] = [i,j];
        c++
        
    }
    
}



//now we shuffle randomizers
randomizerVertical.sort((a, b) => 0.5 - Math.random());
randomizerHorizontal.sort((a, b) => 0.5 - Math.random());


//function that draws the
function drawMaze(table){
    let mazeBody = document.getElementById('table');


    table.forEach((rowElement,i) => {
            if(i < mazeHeight ){
            let row = document.createElement('tr');
            rowElement.forEach((cellEelment,j) => {
                if(j < mazeWidth){
                    let cell = document.createElement('td');
                    if(verticalWallMatrix[i][j])
                        cell.classList.add("rightWall");
                    if(horizontalWallMatrix[i][j])
                        cell.classList.add("bottomWall");
                    cell.appendChild(document.createTextNode(cellEelment));
                    row.appendChild(cell);
                }
            });
            mazeBody.appendChild(row);
        }
    });
    mazeBody.firstElementChild.firstElementChild.classList.add("firstcell")
    mazeBody.lastElementChild.lastElementChild.classList.add("lastcell")

    
}




//algorithm

/*
this algorithm basically eliminates walls to create passages between cells
when we eliminate a wall between 2 cells the get merged into 1 region, which makes it visitable
the algorithm finishes when all the cells get merged in one region and then all the cells can be visited
*/


//we declare region Class, each isolated cell is a region if they're merged they become the same region

class Region{
    
    constructor(i,j,number){
        this.i = i;
        this.j = j;
        this.number = number;

    }

    getNumber(){
        return this.number;
    }
    static nbRegions = 0;

}


function randomNumber(max){
    return Math.floor(Math.random() * max);
}

//function that checks if 2 cells are in the same region
function isRegionsAreMerged(i,j,direction){
    if(direction == 'vertical'){

        return regions[i][j].number === regions[i][j+1].number;
    }
    else{

        return regions[i][j].number === regions[i+1][j].number;
    }
}

function mergeRegions(oldNumber,newNumber){
    for (let i = 0; i < mazeHeight; i++) {
        for (let j = 0; j < mazeWidth; j++) {
            if(regions[i][j].number == oldNumber){
                regions[i][j].number = Math.min(oldNumber,newNumber);
            }
        }

    }

}

function stopCondition(){
    let comp = regions[0][0];
    for (let i = 0; i < mazeHeight; i++) {
        for (let j = 0; j < mazeWidth; j++) {
            if(regions[i][j].number !== 0){
                return true;
            }
        }

    }
    return false;
}


//initializing regions
let regions = []
regions = new Array(mazeHeight);
    for (let index = 0; index < mazeHeight; index++) {
        regions[index] = new Array(mazeWidth);
        
    }
    c = 0;



    for (let i = 0; i < mazeHeight; i++) {
        for (let j = 0; j < mazeWidth; j++) {
            regions[i][j] = new Region(i,j,c);
            c++
        }

    }

    Region.nbRegions = c;






function perfectMaze(){

     c = randomNumber(2);
    while(stopCondition()){
        //if counter is pair we work on vertical walls, else we work on horizontal walls
        let i;
        let j;
        if(c % 2){
            let wallIndexs = randomizerVertical.pop();
            i = wallIndexs[0];
            j = wallIndexs[1];
            if(verticalWallMatrix[i][j] === 1 && !isRegionsAreMerged(i,j,'vertical'))
            {
                verticalWallMatrix[i][j] = 0;
                //regions[i][j+1].number = regions[i][j].number;
                mergeRegions(regions[i][j+1].number, regions[i][j].number)
                Region.nbRegions --;
                
             }
             else{
                randomizerVertical.splice(0, 0, wallIndexs);
             }
            
        
        }
        else{
            let wallIndexs = randomizerHorizontal.pop();
            i = wallIndexs[0];
            j = wallIndexs[1];
            if(horizontalWallMatrix[i][j] === 1 &&  !isRegionsAreMerged(i,j,'horizontal'))
            {

                horizontalWallMatrix[i][j] = 0;
                mergeRegions(regions[i+1][j].number, regions[i][j].number)
                Region.nbRegions --;
            }
            else{
                randomizerHorizontal.splice(0, 0, wallIndexs);
             }
            


        }
        
        
        c++;
        
    }
}

perfectMaze();
drawMaze(matrix);

