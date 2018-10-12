var d = new Date();
var hours = d.getHours();
var minutes = d.getMinutes();
var seconds = d.getSeconds();
var runTimer = function() {

};

var game = {
  start: false,
  timer: 0,
  moves: 0,
  waiting: false,
  flipCounter: 0,
  setStart: function() {
    // Set Moves to 0
    this.move();

    // Set start to true
    this.start = true;

    function incrementSeconds() {
        game.timer += 1;
        $('#clock').text(game.timer);
    }
    runTimer = setInterval(incrementSeconds, 1000);

  },
  end: function() {
    game.flipCounter = 0;
    $('#turn').text(this.moves);
    // Flip Cards Back
    $('.cover').removeClass('lockedIn');
    $('.cover i').removeAttr('style');
    $('.cover').removeClass('flip');
    // Restart turns and stars
    this.start = false;
    // End Waiting
    this.waiting = false;
    // console.log(this.start);
    $('#clock').text('0');
    // Shuffle Cards
    game.shuffle();
    // Clear timer
    game.timer = 0;
    clearInterval(runTimer);
  },
  move: function() {
    // Increment Moves
    this.moves += 1;
    console.log(this.moves);
    $('#turn').text(this.moves);
    $('.win-moves').text(this.moves);

    if(this.moves <= 16) {
      // console.log('perfection');
      $('#stars').html("<i class='fas fa-star'></i><i class='fas fa-star'></i><i class='fas fa-star'></i>");
      $('.win-stars').text('3');
    } else if (this.moves <= 24) {
      // console.log('not perfection');
      $('#stars').html("<i class='fas fa-star'></i><i class='fas fa-star'></i><i class='fas fa-star-half-alt'></i>");
      $('.win-stars').text('2.5');
    } else if (this.moves <= 32) {
      // console.log('not perfection');
      $('#stars').html("<i class='fas fa-star'></i><i class='fas fa-star'></i><i class='far fa-star'></i>");
      $('.win-stars').text('2');
    } else if (this.moves <= 40) {
      // console.log('not perfection');
      $('#stars').html("<i class='fas fa-star'></i><i class='fas fa-star-half-alt'></i><i class='far fa-star'></i>");
      $('.win-stars').text('1.5');
    } else {
      // console.log('not perfection');
      $('#stars').html("<i class='fas fa-star'></i><i class='far fa-star'></i><i class='far fa-star'></i>");
      $('.win-stars').text('1');
    }
    //  else if (this.moves <= 56) {
    //   // console.log('not perfection');
    //   $('#stars').html("<i class='fas fa-star-half-alt'></i><i class='far fa-star'></i><i class='far fa-star'></i>");
    //   $('.win-stars').text('0.5');
    // } else if (this.moves <= 62) {
    //   // console.log('not perfection');
    //   $('#stars').html("<i class='far fa-star'></i><i class='far fa-star'></i><i class='far fa-star'></i>");
    //   $('.win-stars').text('0');
    // }
  },
  unflip: function() {
    if (game.flipCounter === 0) {
      game.waiting = false;
      if ($('.cover').hasClass('flip')) {
        if(
          $('.flip').eq(0).html()
          ===
          $('.flip').eq(1).html()
        ) {
          $('.flip').removeClass('flip').addClass('lockedIn');
          // console.log($('.lockedIn').length);
          // On win show win screen
          if($('.lockedIn').length === 16) {
            $('footer').show();
            game.end();
          }
        }
        $('.cover').removeClass('flip');
        $('.cover').children('.hidden').hide();
      }
      // console.log('Waiting is: ' + game.waiting);
    }
  },
  restart: function() {
    // Set Moves to 0
    this.moves = -1;
    game.flipCounter = 0;
    game.move();
    $('#turn').text(this.moves);
    // Flip Cards Back
    $('.cover').removeClass('lockedIn');
    $('.cover i').removeAttr('style');
    $('.cover').removeClass('flip');
    // Restart turns and stars
    this.start = false;
    // End Waiting
    this.waiting = false;
    // console.log(this.start);
    $('#clock').text('0');
    // Shuffle Cards
    game.shuffle();
    // Clear timer
    game.timer = 0;
    clearInterval(runTimer);
  },
  shuffle: function() {
    console.log('Shuffling');
    // Intalking with the last reviewer I learned that this could be used. 
    var divs = $('#game_container').find('.card');
    for(var i = 0; i < divs.length; i++) $(divs[i]).remove();
    //the fisher yates algorithm, from http://stackoverflow.com/questions/2450954/how-to-randomize-a-javascript-array 7/5/2018
    var i = divs.length;
    if ( i == 0 ) return false;
    while ( --i ) {
       var j = Math.floor( Math.random() * ( i + 1 ) );
       var tempi = divs[i];
       var tempj = divs[j];
       divs[i] = tempj;
       divs[j] = tempi;
     }
    for(var i = 0; i < divs.length; i++) $(divs[i]).appendTo('#game_container');
  }
}

$(document).ready(function() {
  // Shuffle Cards
  game.shuffle();

  $('footer').hide();
  $('button').click(function() {
    $('footer').hide();
    game.restart();
  });

  $('#stars').html("<i class='fas fa-star'></i><i class='fas fa-star'></i><i class='fas fa-star'></i>");

  // Start game - Take turn
  $(document).on("click","div.cover",function(e) {
    console.log('You clicked a card');
    if(!game.waiting) {
      if(!game.start) {
        console.log('The game is not waiting and has not started');
        game.setStart();
        $(this).addClass('flip');
        // Show the item
        $(this).children('.hidden').show();
        game.flipCounter += 1;
      } else {
        console.log('The game is not waiting and has started');
        // If game has started and the div has been flipped
        if ($(this).hasClass('flip') || $(this).hasClass('lockedIn')) {
          console.log('Your clicking an already clicked div');
        } else if (game.flipCounter === 1) {
          console.log('Your clicking an unclicked div with another div already flipped');
          game.waiting = true;
          game.move();
          $(this).addClass('flip');
          // Show the item
          $(this).children('.hidden').show();
          game.flipCounter = 0;
          // console.log('Flip counter: ' + game.flipCounter);
          setTimeout(game.unflip, 1000);
        } else {
          console.log('Your clicking an unclicked div with no others flipped');
          // The card hasn't been flipped
          game.move();
          $(this).addClass('flip');
          // Show the item
          $(this).children('.hidden').show();
          game.flipCounter += 1;
          // console.log('Flip counter: ' + game.flipCounter);
        }
      }
    } else {
      // If the game is not waiting on an action
      console.log('The game is waiting');
    }
  });

  // Restart game
  $(document).on("click","div#restart",function(e) {
    if(!game.waiting) {
      game.restart();
      console.log('restart with game not waiting');
    } else {
      console.log('restart with game waiting');
    }
  });


});
