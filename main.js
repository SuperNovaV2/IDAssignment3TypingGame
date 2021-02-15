game({
    DOM: {
        //Assign the variables to the html ids/classes
        start: window.start,
        input: window.wordInput,
        time: window.time,
        score: window.score,
        prompt: window.wordDisplay
    }
});

function game({DOM}){
    //Game Statistics
    let stats = {
        time: Number(0),
        score: Number(0),
        word: '',
        stop_tick(){}
    };
    //Time when game starts
    const new_time = function(){
        stats.time = Number(60);
        show_time(stats.time.val());
    };
    //Score when game starts
    const new_score = function(){
        stats.score = Number(0);
        update_score(stats.score.val());
    };
    //Get a new word out of the random words from API
    const new_word = function() {
        stats.word = get_word({current_word: stats.word});
        update_prompt(stats.word)
    };
    //If the word is typed correctly score is added and a new word is loaded
    const update_game = function(ev){
        //User input is the event target value this is how to get the value user typed in
        const user_input = ev.target.value;
        if (user_input == stats.word){
            add_score();
            new_word();
            ev.target.value = '';
        }
    };
    //When game start it loads in all the new functions shown before
    const start_game = function(){
        new_time();
        new_score();
        new_word();
        prepare_input(DOM.input, update_game);
        stats.stop_tick = tick(countdown);
        DOM.start.removeEventListener('click', start_game);
    };
    //Stops game when timer reaches 0
    const stop_game = function(){
        //Check if timer is 0
        if (stats.time.val() == 0){
            stats.stop_tick();
            //Display time out message
            update_time('Time ran out');
            update_score(0);
            //Display final score
            update_prompt(`Final score: ${stats.score.val()}`);
            //Disable further inputs
            disable_input(DOM.input, update_game);
            //Enable being able to start a new game
            DOM.start.addEventListener('click', start_game);
            DOM.start.focus()
        }
    };

//Adds a "s" in the time when game is started to make it nicer format essentially
function format_time(time){
    return time.toString() + 's';
}
//Timer in ticks to count down
function tick(fn){
    let counter = 0;
    //Adds 1 to counter
    let callback = () => fn(counter++)
    //Set for 1 second so it adds 1 to counter each second
    let _interval = setInterval(callback, 1000)
    return () => clearInterval(_interval)
    
}

function Number(initial){
    let stats = initial;

    return {
        //Method to be used
        val() {
            return stats
        },
        //Method to be used
        add(num){
            stats += num;
            return stats
        },
        //Method to be used
        subtract(num){
            stats -= num;
            return stats
        }
    };
}
//Function to use textContent easier
function update_element(element, str){
    element.textContent = str;
}
//Update the time through DOM to see
const update_time = str => update_element(DOM.time, str);
//Update the score through DOM to see
const update_score = score => update_element(DOM.score, `Score: ${score}`);
//Update the next word through DOM to see
const update_prompt = str => update_element(DOM.prompt, str);

//Show current time to see
const show_time = time => update_time(`Time: ${format_time(time)}`);
//Subtract time by 1 every second when it reaches 0 stops the game
const countdown = () => stop_game(show_time(stats.time.subtract(1)));
//Show current score to see
const add_score = () => update_score(stats.score.add(1));

//Disable text box so they cant enter anything
DOM.input.setAttribute('disabled','disabled');
//Allow for user to click on start button
DOM.start.addEventListener('click', start_game);
}

//API url to get random words
const random_word_url = 'https://random-word-api.herokuapp.com/word?number=150';

//Gets the words and returns it
function getRandomWord(){
    return fetch(random_word_url)
        .then(response => response.json())
        .then(responseData => {
            return responseData;
        })        
}
//Array to store the random words
wordlist = []
//Async to make sure finishes the promise first then assigns the result to the array to store
async function getNextWord(){
    const words = await getRandomWord()
    wordlist = words;
}
//To get a word
function get_word({current_word}){
    console.log(wordlist);
    //Gets a random word from the list through math random
    const new_word = wordlist[Math.floor(Math.random() * wordlist.length)];
    
    //Checks if the word is same as the word displayed on screen if so runs function again
    if (new_word == current_word){
        return get_word({current_word})
    }

    return new_word;
}

//To be used in start game
function prepare_input(input, handler){
    //Resets input value
    input.value = '';
    //Removes the disabled in the input attribute
    input.removeAttribute('disabled');
    //Adds in the input back
    input.addEventListener('input', handler);
    input.focus();
}
//To be used in end game
function disable_input(input, handler){
    //Resets input value
    input.value = '';
    //Removes the input attribute
    input.removeEventListener('input', handler);
    //Turns the input attribute to disabled
    input.setAttribute('disabled', 'disabled');
}

//Calling for API to get my word list
getNextWord()


