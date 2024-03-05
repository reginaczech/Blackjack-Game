$(document).ready(function() {

  // New Comments: Learning how to create repositories and source control
  // Script which manipulates the game and allows th user to inteact with the buttons on the page such as Let's Play, Hit, Stand, and Reset.
  
  //Set up the arrays - player cards nums, player cards pics, dealer cards nums, dealer cards pics
  var playerCards = [];
  var playerPics = [];
  var dealerPics = [];
  var dealerCards = [];
  
  //Reference for ace logic: Assistance for sum code provided by OpenAI's ChatGPT, through the Replit AI platform. replit.com/ai/chatgpt.  
  //Function: Get value of card according to card id number.
  function getValue(cardId, currentTotal) {
    if (cardId >= 10 && cardId <= 13) {
      return 10; // 10, J, Q, K value at 10
    } else if (cardId === 1) {
        if (currentTotal + 11 <= 21) {
          return 11; // Ace value at 11 if ace=11 plus total is <= 21
        } else {
          return 1; // Ace value at 1 if busted (>21)
        }
    } else {
      return cardId; // 2-9 value at 2-9
    }
  };
  
  //Function: Get random card.
  function getRandomCard() {
    //Get card id number from 1 - 13, Ace=1, 2=2, ... 10=10, Jack=11, Queen=12, King=13
    var cardId = Math.floor(Math.random() * 13) + 1; 
    console.log('DEBUG - Random cardId:', cardId);
    // Get suit id number: clubs=1, diamonds=2, hearts=3, spades=4
    var suitId = Math.floor(Math.random() * 4) + 1; 
    console.log('DEBUG - Random suitId:',suitId);
    //set up suit name
    var suit = ""
    if (suitId === 1) {
      suit = "C";
    } else if (suitId === 2){
      suit = "D";
    } else if (suitId === 3){
      suit = "H";
    } else if (suitId === 4){
      suit = "S";
    };
    var picId = cardId + suit;
    var cardNum = getValue(cardId);
    return [picId, cardNum];
  };

  // Reference for summing and ace logic: Assistance for sum code provided by OpenAI's ChatGPT, through the Replit AI platform. replit.com/ai/chatgpt.  
  // Function: Sum the array of cards (use reduce function)
  function sumHand(cardArray) {    
    var handValue = 0;
    var acesCount = 0;
    // Calculate the non-Ace cards first
    cardArray.forEach(function(cardId) {
      if (cardId !== 1) {
        handValue += getValue(cardId, handValue);
      } else {
        acesCount++;
      }
    });
    // Now determine the best value for each Ace
    for (var i = 0; i < acesCount; i++) {
      handValue += getValue(1, handValue); // Each iteration considers the new handValue
    }
    return handValue;
  };

  // Function: display if player wins
  function playerWins() {
    flipCard();
    $("#hitButton").hide();
    $("#standButton").hide();
    $("<div>") 
      .text("Winner winner chicken dinner! ")
      .addClass("win")
      .attr("id", "youWin")
      .appendTo("body");
    $("#playerScore")
      .css("background-color", "yellow")
      .css("color", "black");
    var dealerSum = sumHand(dealerCards);
    $("#dealerScore").text(dealerSum);
  };

  // Function: display if player loses (dealer wins)
  function dealerWins() {
    flipCard();
    $("#hitButton").hide();
    $("#standButton").hide();
    $("<div>") 
      .text("You suck - Dealer Wins")
      .addClass("win")
      .attr("id", "dealerWin")
      .appendTo("body");
    $("#dealerScore")
      .css("background-color", "yellow")
      .css("color", "black");
    var dealerSum = sumHand(dealerCards);
    $("#dealerScore").text(dealerSum);
  };

  //Function: display if game is a draw.
  function drawGame() {
    flipCard();
    $("#hitButton").hide();
    $("#standButton").hide();
    $("<div>") 
        .text("You're all losers here - It's a draw!")
        .addClass("win")
        .attr("id", "drawGame")
        .appendTo("body");
    var dealerSum = sumHand(dealerCards);
    $("#dealerScore").text(dealerSum);
  }

  //Function: flip card over
  function flipCard() {
    $("#flipCard").attr("src", "./cardDeck/" + dealerPics[0] + ".png");
  }

  //Function: deal card to PLAYER
  function hitPlayer () {
    var pCard = getRandomCard();
    playerPics.push(pCard[0]);
    playerCards.push(pCard[1]);    
    var pTurn = playerCards.length;
    var currentImg = playerPics[pTurn-1];
    var currentCard = playerCards[pTurn-1];
    var $imgP = $("<img>")
      .attr("src", "./cardDeck/" + currentImg + ".png")
      .addClass("card")
      .appendTo(".pSection");
    //$imgP.hide();
    //$imgP.delay(300).fadeIn(300);
    var playerSum = sumHand(playerCards);
    $("#playerScore").text(playerSum);
    //player busts
    if (playerSum > 21) {
      dealerWins();
    } else if (playerSum === 21) {
      playerWins();
    }
  };
  
  //Function: deal card to DEALER
  function hitDealer () {
    var dCard = getRandomCard();
    dealerPics.push(dCard[0]);
    dealerCards.push(dCard[1]);
    var dTurn = dealerCards.length;
    var currentImg = dealerPics[dTurn-1];
    var currentCard = dealerCards[dTurn-1];
    var $imgD = $("<img>")
      .attr("src", "./cardDeck/" + currentImg + ".png")
      .addClass("card")
      .appendTo(".dSection");
    //$imgD.hide();
    //$imgD.delay(300).fadeIn(300);
    var dealerSum = sumHand(dealerCards);
    //dealer busts
    if (dealerSum > 21) {
      playerWins();
    } else if (dealerSum === 21) {
      dealerWins();
    }
  };
  
//Start game and deal first set of cards
  $("#letsPlay").on("click", function(event){
    event.preventDefault();
    $(this).hide();
    $(".emptyBox").hide()
    //Create and show refresh button. Source code: https://stackabuse.com/bytes/refreshing-a-web-page-using-javascript-or-jquery/
    $("<button>")
      .text("RESTART")
      .addClass("reset")
      .attr("id", "refresh")
      .appendTo("body");
    $("#refresh").click(function() {
        location.reload();
    });
    //Deal card to player (face up)
    hitPlayer();
    //Deal the dealer  first card face down. Collect card id number.
    var dealerCard1 = getRandomCard();
    dealerPics[0] = dealerCard1[0]; 
    dealerCards[0] = dealerCard1[1]
    var $imgFD = $("<img>")
      .attr("src", "./cardDeck/back.png")
      .addClass("card")
      .attr("id", "flipCard")
    //$imgFD.hide();
    $imgFD.appendTo(".dSection");
    //$imgFD.delay(300).fadeIn(300);
    //Deal the player secound card (face up)
    hitPlayer();
    //Deal the dealer second card face up.
    hitDealer();
    //Set up the hit button.
    var hitButton = $("<button>")
      .text("Hit")
      .attr("type", "click")
      .attr("id", "hitButton")
      .appendTo("body");
    var standButton = $("<button>")
      .text("Stand")
      .attr("type", "click")
      .attr("id", "standButton")
      .appendTo("body");
    //sum the cards
    var playerSum = sumHand(playerCards);
    $("#playerScore").text(playerSum);
    var dealerSum = sumHand(dealerCards);
    //blackjack on start up:
    if (playerSum === 21) {
      playerWins();
    } else if (dealerSum === 21) {
      dealerWins();
    } else if (dealerSum === 21 && playerSum === 21) {
      drawGame();
    }        
  });

  //on HIT button click, deal another card to player.
  $(document).on("click", "#hitButton", function(event) {
    event.preventDefault();
    hitPlayer();
  });

  //on STAND button click, dealer plays.
  $(document).on("click", "#standButton", function(event) {
    event.preventDefault();
    $("#hitButton").hide()
    //Find the image and flip card over.
    flipCard();
    //Sum dealer hand and update dealer score
    var dealerSum = sumHand(dealerCards);
    $("#dealerScore").text(dealerSum);
    //Define the player's score
    var playerSum = sumHand(playerCards);
    //While dealer card is less than 17, deal a card. Dealer stands and stops taking cars if >17.
    while (dealerSum < 17) {
      hitDealer();
      dealerSum = sumHand(dealerCards);
    }
    //Update the dealer score after dealer stops taking cards
    $("#dealerScore").text(dealerSum);
    //Complete comparison the player's and the dealer's score
    if (dealerSum === 21) {
      dealerWins(); //Dealer wins
    } else if (dealerSum > 21 && playerSum < 21) {
      playerWins() //Dealer busts, player wins
    } else if(dealerSum < 21 && playerSum > 21 ) {
      dealerWins() //Player busts, dealer wins
    } else if (dealerSum <= 21 && playerSum <= 21) {
      if (dealerSum > playerSum ) {
        dealerWins() //Dealer wins
      } else if (dealerSum < playerSum) {
        playerWins() //Player wins
      } else if (dealerSum === playerSum) {
        drawGame() //Draw
      }
    }
    
  });

});