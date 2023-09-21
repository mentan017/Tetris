var GameEnded = false;
var Blocks = [];
var GameMatrix = [];

class Block{
    constructor(x, y, BlocksAbove, Color){
        this.x = x;
        this.y = y;
        this.BlocksAbove = BlocksAbove;
        GameMatrix[y][x] = 1;
        this.color = Color;
    }
    
    IsInitialized = false;
    IsFalling = true;
    HasBeenSkipped = true;
    OrientationState = 0; //0 -> Align right; 1 -> Align bottom; 2 -> Align left; 3 -> Align top

    move(direction){
        if(direction == 'l'){
            this.x = this.x - 1;
        }else if(direction == 'r'){
            this.x = this.x + 1;
        }else if(direction == 'd'){
            this.y = this.y + 1;
        }
    }
    displayBlock(){
        var newBox = (document.getElementsByClassName('row')[this.y]).getElementsByClassName('box')[this.x-1];
        newBox.classList.toggle('active');
        if(newBox.style.backgroundColor == ""){
            newBox.style.backgroundColor = this.color;
            newBox.style.borderColor = this.color;
        }else{
            newBox.style.backgroundColor = "";
            newBox.style.borderColor = "";
        }
    }
    switchToStatic(){
        this.IsFalling = false;
    }
    initialize(){
        this.IsInitialized = true;
    }
}

document.getElementById("start-btn").addEventListener("click", StartGame);
document.body.addEventListener("keydown", function(e){
    e.stopImmediatePropagation();
    if(e.key == 'a'){
        MoveSides('l');
    }else if(e.key == 'd'){
        MoveSides('r');
    }else if(e.key == 'n'){
        RenderNextTick();
    }else if(e.key == 'r'){
        RotateBlocks();
    }
});

function StartGame(){
    document.getElementById("start-btn").style.display = "none";
    for(var i=0; i<15; i++){
        document.getElementById("game-container").innerHTML += `
        <div class="row">
            <div class="box"></div>
            <div class="box"></div>
            <div class="box"></div>
            <div class="box"></div>
            <div class="box"></div>
            <div class="box"></div>
            <div class="box"></div>
            <div class="box"></div>
            <div class="box"></div>
            <div class="box"></div>
        </div>`;
    }
    RefreshGameMatrix();
    AddNewPiece();
}
function RefreshGameMatrix(){
    GameMatrix = [];
    for(var i=0; i<15; i++){
        GameMatrix.push([-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1]);
    }
    GameMatrix.push([-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]);
    for(var i=0; i<Blocks.length; i++){
        if(Blocks[i].IsFalling){
            GameMatrix[Blocks[i].y][Blocks[i].x] = 1;
        }else{
            GameMatrix[Blocks[i].y][Blocks[i].x] = 2;
        }
    }
}
function AddNewPiece(){
    if(GameMatrix[0][4] == 0){
        var RandomNumber = Math.random();
        if(RandomNumber < 0.25){
            Blocks.push(new Block(5, 0, 1, "red"));
            Blocks.push(new Block(6, 0, 1, "red"));        
        }else if(RandomNumber < 0.50){
            Blocks.push(new Block(4, 0, 0, "green"));
            Blocks.push(new Block(5, 0, 0, "green"));
            Blocks.push(new Block(6, 0, 1, "green"));
        }else if(RandomNumber < 0.75){
            Blocks.push(new Block(4, 0, 1, "blue"));
            Blocks.push(new Block(5, 0, 0, "blue"));
            Blocks.push(new Block(6, 0, 0, "blue"));
        }else{
            Blocks.push(new Block(5, 0, 3, "orange"));
        }
        InitializeBlocks();
        setTimeout(RenderNextTick, 500);
    }else{
        window.alert("Game Over!");
    }
}
function InitializeBlocks(){
    for(var i=0; i<Blocks.length; i++){
        if(!Blocks[i].IsInitialized) Blocks[i].displayBlock();
        Blocks[i].initialize();
    }
}
function RenderNextTick(){
    var RenderedBlocks = 0;
    var SkippedBlocks = 0;
    var MovedBlocks = 0;
    
    //Check if it is possible to move down
    if(IsMovementAllowed(0, 1)){
        while(RenderedBlocks < Blocks.length){
            var ArrayPos = (RenderedBlocks+SkippedBlocks)%Blocks.length;
            if(Blocks[ArrayPos].HasBeenSkipped && Blocks[ArrayPos].IsFalling && Blocks[ArrayPos].IsInitialized){
                var BlockBelow = GameMatrix[Blocks[ArrayPos].y + 1][Blocks[ArrayPos].x];
                if(BlockBelow == 0){ //There is nothing below
                    Blocks[ArrayPos].displayBlock();
                    Blocks[ArrayPos].move('d');
                    Blocks[ArrayPos].displayBlock();
                    GameMatrix[Blocks[ArrayPos].y - 1][Blocks[ArrayPos].x] = 0;
                    GameMatrix[Blocks[ArrayPos].y][Blocks[ArrayPos].x] = 1;
                    RenderedBlocks++;
                    if(Blocks[ArrayPos].BlocksAbove > 0){
                        Blocks.push(new Block((Blocks[ArrayPos].x), (Blocks[ArrayPos].y - 1), (Blocks[ArrayPos].BlocksAbove - 1), Blocks[ArrayPos].color));
                        Blocks[ArrayPos].BlocksAbove = 0;
                    }
                    MovedBlocks++;
                }else if(BlockBelow == 1){ //There is a falling block below
                    SkippedBlocks++;
                }
            }else{
                RenderedBlocks++;
            }
        }
    }else{
        for(var i=0; i<Blocks.length; i++){
            Blocks[i].switchToStatic();
            GameMatrix[Blocks[i].y][Blocks[i].x] = 2;
        }
    }
    CheckRows();
    InitializeBlocks();
    if(MovedBlocks == 0){
        AddNewPiece();
    }else{
        setTimeout(RenderNextTick, 500);
    }
}
function IsMovementAllowed(xOffset, yOffset){
    var IsAllowed = true;
    for(var i=0; i<Blocks.length; i++){
        if(Blocks[i].IsFalling){
            var BlockNext = GameMatrix[Blocks[i].y + yOffset][Blocks[i].x + xOffset];
            if(BlockNext == 2 || BlockNext == -1){
                IsAllowed = false;
            }
        }
    }
    return IsAllowed;
}
function MoveSides(direction){
    if(direction == 'l'){
        offset = -1;
    }else if(direction == 'r'){
        offset = 1;
    }
    if(IsMovementAllowed(offset, 0)){
        //Move the falling blocks
        for(var i=0; i<Blocks.length; i++){
            if(Blocks[i].IsFalling){
                Blocks[i].displayBlock();
                Blocks[i].x = Blocks[i].x + offset;
            }
        }
        for(var i=0; i<Blocks.length; i++){
            if(Blocks[i].IsFalling){
                Blocks[i].displayBlock();
            }
        }
    }
    RefreshGameMatrix();
}
function CheckRows(){
    var sum;
    for(var i=GameMatrix.length - 2; i>=0; i--){
        sum = 0;
        for(var j=0; j<GameMatrix[i].length; j++){
            sum += GameMatrix[i][j];
            if(sum == 18){ //10*2 + 2*(-1)
                ShiftRow(i);
                i++;
            }
        }
    }
}
function ShiftRow(RowIndex){
    for(var i=RowIndex; i>0; i--){
        for(var j=0; j<GameMatrix[i].length; j++){
            GameMatrix[i][j] = GameMatrix[i-1][j];
        }
    }
    GameMatrix[0] = [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1];
    //Delete blocks in the row
    for(var i=0; i<Blocks.length; i++){
        if(Blocks[i].y == RowIndex){
            Blocks[i].displayBlock();
            Blocks.splice(i, 1);
            i--;
        }else if(Blocks[i].y < RowIndex){
            Blocks[i].displayBlock();
            Blocks[i].y = Blocks[i].y + 1;
            Blocks[i].displayBlock();
        }
    }
}
function RotateBlocks(){
    var LeftIndex = 11;
    var RightIndex = 0;
    var TopIndex = 15;
    var BottomIndex = 0;
    for(var i=0; i<Blocks.length; i++){
        if(Blocks[i].IsFalling){
            if(Blocks[i].x < LeftIndex) LeftIndex = Blocks[i].x;
            if(Blocks[i].x > RightIndex) RightIndex = Blocks[i].x;
            if(Blocks[i].y < TopIndex) TopIndex = Blocks[i].y;
            if(Blocks[i].y > BottomIndex) BottomIndex = Blocks[i].y;
        }
    }
    var MatrixSize;
    if((RightIndex - LeftIndex) > (BottomIndex - TopIndex)) MatrixSize = (RightIndex - LeftIndex) + 1;
    else MatrixSize = (BottomIndex - TopIndex) + 1;
    LeftIndex = RightIndex - MatrixSize + 1;
    TopIndex = BottomIndex - MatrixSize + 1;
    var FallingBlocksMatrix = [];
    var SecondFallingBlocksMatrix = [];
    for(var i=0; i<MatrixSize; i++){
        var arr = [];
        for(var j=0; j<MatrixSize; j++){
            arr.push(-1);
        }
        FallingBlocksMatrix.push(arr);
        SecondFallingBlocksMatrix.push(arr);
    }
    for(var i=0; i<Blocks.length; i++){
        if(Blocks[i].IsFalling){
            FallingBlocksMatrix[Blocks[i].y - TopIndex][Blocks[i].x - LeftIndex] = i;
        }
    }
    console.log(FallingBlocksMatrix);
    for(var i=0; i<FallingBlocksMatrix.length; i++){
        for(var j=0; j<FallingBlocksMatrix[i].length; j++){
            if(FallingBlocksMatrix[i][j] != -1){
                Blocks[FallingBlocksMatrix[i][j]].displayBlock();
                Blocks[FallingBlocksMatrix[i][j]].y = TopIndex + MatrixSize + j;
                Blocks[FallingBlocksMatrix[i][j]].x = LeftIndex + MatrixSize - 1 -i;    
            }
            //SecondFallingBlocksMatrix[MatrixSize + j][MatrixSize - 1 - i] = FallingBlocksMatrix[i][j];
        }
    }
    for(var i=0; i<MatrixSize; i++){
        for(var j=0; j<MatrixSize; j++){
            if(FallingBlocksMatrix[i][j] != -1){
                Blocks[FallingBlocksMatrix[i][j]].displayBlock();
            }
        }
    }
    RefreshGameMatrix();
}

function DisplayGameMatrix(){
    var str = [];
    for(var i=0; i<GameMatrix.length; i++){
        for(var j=0; j<GameMatrix[i].length; j++){
            str.push(' ');
            str.push(GameMatrix[i][j]);
            str.push(' ');
        }
        str.push('\n');
    }
    console.log(str.join(""));
}