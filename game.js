const prompts = require("prompts");

class character {
  constructor(title, health, damage, hit) {
    this.title = title;
    this.health = health;
    this.damage = damage;
    this.hit = hit;
  }
  display_i() {
    console.log(
      "Character: " +
        this.title +
        ", Health " +
        this.health +
        ", damage " +
        this.damage +
        ", Hit " +
        100 * this.hit +
        "%"
    );
  }
}

class main_character extends character {
  constructor(title, health, damage, hit) {
    super(title, health, damage, hit);
  }

  die() {
    if (this.health <= 0) {
      console.log(this.title + " has fallen");
      return false;
    }
  }
}

class Room {
  constructor(Name, Enemy, Doorway) {
    this.Name = Name;
    this.Enemy = Enemy;
    this.Doorway = Doorway;
  }
}

class Game {
  constructor(Rooms, Player) {
    this.Rooms = Rooms;
    this.Player = Player;
    this.i = 0;
  }

  title() {
    if (this.Rooms[this.i].Name === "Portal") {
      return "finish_game";
    } else {
      return this.Rooms[this.i].Doorway;
    }
  }

  title2() {
    return this.Rooms[this.i].Doorway.map((x) => this.Rooms[x].Name);
  }

  Enemies() {
    if (this.Rooms[this.i].Enemy.length === 0) {
      console.log("There is no Enemy");
      return [{ title: "No enemies" }];
    } else {
      return this.Rooms[this.i].Enemy;
    }
  }

  enemyAttack() {
    // Finds out if there are enemies in the room
    if (this.Rooms[this.i].Enemy.length === 0) {
    } else {
      // Chooses a random enemy from the room that attacks the player
      let k = [Math.floor(Math.random() * this.Rooms[this.i].Enemy.length)];
      // Calculates hit chance
      if (Math.random() < this.Rooms[this.i].Enemy[k].hit) {
        console.log(this.Rooms[this.i].Enemy[k].title + " Attacks");
        this.Player.health -= this.Rooms[this.i].Enemy[k].damage;
        console.log(this.Rooms[this.i].Enemy[k].title + " Attack successful");
        console.log(this.Player.title + " current health" + this.Player.health);
      } else {
        console.log(this.Rooms[this.i].Enemy[k].title + " Attacks");
        console.log(this.Rooms[this.i].Enemy[k].title + " attack missed");
      }
    }
  }

  goToRoom(x) {
    this.i = x;
    console.log("You have arrived to: " + this.Rooms[this.i].Name);
    if (this.Rooms[this.i].Name === "Portal") {
      console.log("You Win The Game CONGRATULATIONS");
      return false;
    } else {
      Gamelogic.enemyAttack();
    }
  }

  lookAround() {
    console.log("You are currently in " + this.Rooms[this.i].Name);
    //Finds enemies in the current room
    this.Rooms[this.i].Enemy.map((x) =>
      console.log("You encounter an Enemy: " + x.title)
    );
    //Finds doorways in the current room
    this.Rooms[this.i].Doorway.map((x) =>
      console.log("You see a doorway leading to: " + this.Rooms[x].Name)
    );
    Gamelogic.enemyAttack();
  }

  fight(x) {
    if (this.Rooms[this.i].Enemy.length === 0) {
      console.log("There is no Enemy");
    } else {
      let k = x;
      if (Math.random() < this.Player.hit) {
        this.Rooms[this.i].Enemy[k].health -= this.Player.damage;
        console.log("Attack successful");
        console.log(
          this.Rooms[this.i].Enemy[k].title +
            " current health" +
            this.Rooms[this.i].Enemy[k].health
        );
      } else {
        console.log("Your attack missed");
      }
      if (this.Rooms[this.i].Enemy[k].health <= 0) {
        console.log(this.Rooms[this.i].Enemy[k].title + " died");
        this.Rooms[this.i].Enemy.splice(k, 1);
      }
    }
  }
}

// Characters

let Player = new main_character("Player", 10, 2, 0.75);
let Rat = new character("Sewer rat", 2, 1, 0.5);
let Skeleton = new character("Skeleton", 5, 1, 0.5);
let Dragon = new character("Dragon", 4, 8, 0.9);


//Rooms
let Entrance = new Room("Entrance", [], [1]);
let Hallway = new Room("Hallway", [Rat], [0, 2]);
let Chambers = new Room("Chambers", [Dragon], [1, 3]);
let Portal = new Room("Portal", []);

//Game
let Gamelogic = new Game([Entrance, Hallway, Chambers, Portal], Player);

async function gameLoop() {
  let continueGame = true;

  // Example set of UI options for the user to select
  const initialActionChoices = [
    { title: "Look Around", value: "info" },
    { title: "Go to room", value: "goTo" },
    { title: "Attack", value: "attack" },
    { title: "Player info", value: "playerInfo" },
    { title: "Exit game", value: "exit" },
  ];

  // Show the list of options for the user.
  // The execution does not proceed from here until the user selects an option.
  const response = await prompts([
    {
      type: "select",
      name: "value",
      message: "Choose your action",
      choices: initialActionChoices,
    },
  ]);

  // Deal with the selected value
  console.log("You selected " + response.value);
  switch (response.value) {
    case "goTo":
      let array = Gamelogic.title();
      let room_Names = Gamelogic.title2();

      const response2 = await prompts({
        type: "select",
        name: "room",
        message: "Choose room",
        choices: room_Names,
      });

      let i = array[0],
        i1 = array[1],
        i2 = array[2];

      switch (response2.room) {
        case 0:
          Gamelogic.goToRoom(i);
          break;

        case 1:
          Gamelogic.goToRoom(i1);
          break;

        case 2:
          Gamelogic.goToRoom(i2);
          break;
      }
      break;

    case "info":
      Gamelogic.lookAround();
      break;

    case "attack":
      let Enemies = Gamelogic.Enemies();

      const response3 = await prompts({
        type: "select",
        name: "fight",
        message: "Choose enemy you want to attack",
        choices: Enemies,
      });

      switch (response3.fight) {
        case 0:
          Gamelogic.fight(0);
          break;

        case 1:
          Gamelogic.fight(1);
          break;

        case 2:
          Gamelogic.fight(2);
          break;

        case 3:
          Gamelogic.fight(3);
          break;

        default:
          console.log("There is no Enemies");
          break;
      }
      break;

    case "playerInfo":
      Player.display_i();
      break;

    case "exit":
      continueGame = false;
      break;
  }

  if (Player.die() === false) {
    continueGame = false;
  }

  if (Gamelogic.title() === "finish_game") {
    continueGame = false;
  }

  if (continueGame) {
    gameLoop();
  }
}

process.stdout.write("\033c"); // clear screen on windows

console.log("WELCOME TO THE DUNGEONS OF LORD OBJECT ORIENTUS!");
console.log("================================================");
console.log("You walk down the stairs to the dungeons");
gameLoop();
