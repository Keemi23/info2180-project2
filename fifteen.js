
/*Extra feature:
- Multiple backgrounds
*/
window.onload = main;

//Global Vaiable 
var blank = ["300px", "300px"]; //here specifies the blank position
var start = false; //refers to the starting of the game
var moves = 0; //identifies the the number of moves made
var start_time = 0; // Starting tiemfor the Game
var timer; // time keeper 
var total_time = 0; // total gameplay time
var best_time = 0;
var best_moves = 0;

//The code below shows the initail piece for the maze and it's return state
function start_state() {
    var puzzle_area = document.getElementById("puzzlearea").childNodes;
    var initial_state = [];

    var x = 0,
        y = 0,
        top = 0,
        left = 0,
        piece_counter = 1;

    for (let i = 0; i < puzzle_area.length; i++) {
        if (puzzle_area[i].nodeName == "DIV") {
            initial_state.push([top.toString() + "px", left.toString() + "px"]);
            puzzle_area[i].className += "puzzlepiece";
            puzzle_area[i].setAttribute("style", `background-position: ${x}px ${y}px; top: ${top}px; left: ${left}px;`);
            x -= 100;
            left += 100;

            if (piece_counter % 4 == 0) {
                y -= 100;
                top += 100;
                left = 0
            }
            piece_counter += 1;

        }
    }

    return initial_state
}

//The code below inspects if the pieces can be moved
function is_movable(piece) {
    return parseInt(piece.style.top) + 100 === parseInt(blank[0]) & parseInt(piece.style.left) === parseInt(blank[1]) | parseInt(piece.style.top) - 100 === parseInt(blank[0]) & parseInt(piece.style.left) === parseInt(blank[1]) | parseInt(piece.style.top) === parseInt(blank[0]) & parseInt(piece.style.left) - 100 === parseInt(blank[1]) | parseInt(piece.style.top) === parseInt(blank[0]) & parseInt(piece.style.left) + 100 === parseInt(blank[1])
}

//The code below inspects the current of the puzzle
function check_for_win(winning_state, pieces) {
    if (start) {
        for (var i = 0; i < pieces.length; i++) {
            if ((winning_state[i][0] !== pieces[i].style.top) | (winning_state[i][1] !== pieces[i].style.left)) {
                return false;
            }
        }
        clearInterval(timer);
        return true;
    }
    return false;
}

//The code below inpects pieces to blank space
function move_piece(piece, animate) {
    blank_top = piece.style.top;
    blank_left = piece.style.left;

    if (animate) {
        var winning_state = arguments[2];
        var pieces = arguments[3];
        $(piece).animate({ "top": blank[0], "left": blank[1] }, "slow", "linear", function() {
            if (check_for_win(winning_state, pieces)) {
                if (best_time < total_time) {
                    best_time = total_time;
                }
                if (best_moves < moves) {
                    best_moves = moves
                }
                var win_string = `You Win\nTotal Time: ${seconds_to_time(total_time)} Number of moves: ${moves}\nBest Time: ${seconds_to_time(best_time)} Best Number of Moves: ${best_moves}`;
                $(".explanation")[0].innerText = win_string;
                $(".explanation")[0].style.textAlign = "Center";
            }
        });

    } else {
        piece.style.top = blank[0];
        piece.style.left = blank[1];
    }
    blank = [blank_top, blank_left];
}

//The code below randomly shuffle the puzzle
function random_shuffle(pieces) {
    var pieceLength = pieces.length;
    var piece;
    var rand;

    for (var index = 0; index < pieceLength; index++) {
        rand = Math.floor(Math.random() * pieces.length);
        piece = pieces.splice(rand, 1);
        move_piece(piece[0], false);
    }
}

//The code below generates the pieces of the puzzle
function get_pieces() {
    return $(".puzzlepiece");
}

//The code specifies the format of the time
function seconds_to_time(seconds) {
    var date = new Date(null);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
}

//The code below tells the duration of the game
function update_time() {
    var current_date = new Date();
    var current_time = (current_date.getHours() * 60 * 60) + (current_date.getMinutes() * 60) + current_date.getSeconds();
    total_time = current_time - start_time;
    return seconds_to_time(total_time);
}

//The code below adds the time of the game and moves
function update_stats() {
    $(".explanation")[0].innerHTML = `Time: ${update_time()} Moves: ${moves}`;
}

function add_background_seletor() {
    var background_form = "<form align='Center'>\
    <p align='Center'>Select a background image<p>\
    <input type = 'radio' name = 'bg' value = ''/>Chelsea\
    <input type = 'radio' name = 'bg' value = '1'/>Arsenal\
    <input type = 'radio' name = 'bg' value = '2'/>Manchester United\
    <input type = 'radio' name = 'bg' value = '3'/>Manchester City\
    </form>";

    $("#overall").before(background_form);

}

function change_bg(value) {
    var pieces = get_pieces();
    
    for (var i = 0; i < pieces.length; i++){
        pieces[i].style.backgroundImage = `url('background${value}.jpg')`;
    }
}

function shuffle_image(){
    var value = Math.floor(Math.random()*4)
    if(value === 0){
        value = "";
    }
    change_bg(value);
}

function main() {
    var winning_state = start_state();
    var puzzle_pieces = get_pieces();
    add_background_seletor();
    var bg_form_items = $("form")[0].elements;

    for (var i = 0; i < bg_form_items.length; i++) {
        bg_form_items[i].addEventListener("click", function(){
            change_bg(this.value)
        });
    }

    document.getElementById("shufflebutton").onclick = function() {
        random_shuffle(puzzle_pieces);
        shuffle_image();
        start = true;
        moves = 0;
        puzzle_pieces = get_pieces();
        var start_date = new Date();
        start_time = (start_date.getHours() * 60 * 60) + (start_date.getMinutes() * 60) + start_date.getSeconds();
        timer = setInterval(update_stats, 1000);
    }

    for (var i = 0; i < puzzle_pieces.length; i++) {
        puzzle_pieces[i].addEventListener("mouseover", function() {
            if (is_movable(this)) {
                this.className = "puzzlepiece movablepiece";
            }
        });

        puzzle_pieces[i].addEventListener("mouseleave", function() {
            this.className = "puzzlepiece";
        });

        puzzle_pieces[i].addEventListener("click", function() {
            if (this.className.includes("movablepiece")) {
                move_piece(this, true, winning_state, puzzle_pieces);
                moves++;
            }
        });
    }

}