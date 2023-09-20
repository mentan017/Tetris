//!Temp code
window.onload = StartGame();

var GameEnded = false;

document.getElementById("start-btn").addEventListener("click", StartGame);

class TetrisPiece{
    constructor(){

    }
}

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
    AddNewPiece();
}
function AddNewPiece(){

}