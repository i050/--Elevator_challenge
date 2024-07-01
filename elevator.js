var container = document.querySelector(".container");
var numOfFloors = 7;
var numOfElevators = 3;

var waitingList = [];
var elevatorsStatus = {}; // מעקב אחרי מצב המעליות

 
//  הגדרת קומות ע"י משתמש
function numOfFloor(value, event) {
  value = parseInt(value);

  if (isNaN(value) || value <= 0) {
    event.target.value = event.target.value.slice(0, -1);
    return;
  }

  var floor = document.querySelectorAll(".floor");
  for (var i = 0; i < floor.length; i++) {
    floor[i].remove();
  }
  numOfFloors = value;
  createFloor();
}

//  הגדרת מעליות ע"י משתמש
function numOfElv(value, event) {
  value = parseInt(value);
  // בדיקה אם הערך תקין
  if (isNaN(value) || value <= 0) {
    event.target.value = event.target.value.slice(0, -1);
    return;
  }
  
  var elv = document.querySelectorAll(".elv");
  for (var i = 0; i < elv.length; i++) {
    elv[i].remove();
  }
  numOfElevators = value;
  createElevator();
}
 
//  יצירת קומות
function createFloor() {
  for (var i = numOfFloors; i >= 0; i--) {
    var floor = document.createElement("div");
    floor.className = "floor";
    var blackLine = document.createElement("div");
    blackLine.className = "blackline";
    var floorBtn = document.createElement("button");
    floorBtn.className = "metal linear";
    floorBtn.innerHTML = i;
    var timerSpan= document.createElement("span");
    timerSpan.className="timerSpan";
    var showTimer = document.createElement("div");
    showTimer.className="showTimer";
   
    floor.appendChild(blackLine);
    floor.appendChild(floorBtn);
    floor.appendChild(timerSpan);
    timerSpan.appendChild(showTimer)
    container.appendChild(floor);

    floorBtn.onclick = function () {
      var floorNumber = parseInt(this.innerHTML);
      if (!waitingList.includes(floorNumber) && !isElevatorOnFloor(floorNumber)) {
        waitingList.push(floorNumber);
        console.log(waitingList);
        handleWaitingList();
      }
    };
  }
}

// יצירת מעליות
function createElevator() {
  for (var i = 1; i <= numOfElevators; i++) {
    var elv = document.createElement("span");
    elv.className = "elv";
    elv.id = "elv" + i;
    elv.style.cssText = `
      position: absolute;
      left: ${(i + 1.5) * 100}px;
      bottom: 0px;
      transition: bottom 2s ease-in-out; /* Add transition for smooth movement */
    `;
    var img = document.createElement("img");
    img.src = "elv.png";
    img.className = "elv";
    elv.appendChild(img);
    container.appendChild(elv);
    elevatorsStatus[elv.id] = { busy: false, targetFloor: null };
  }
}

//  בדיקה אם המעלית בקומה
function isElevatorOnFloor(floorNum) {
  var elevators = document.querySelectorAll(".elv");
  for (var i = 0; i < elevators.length; i++) {
    var currentFloor = parseInt(elevators[i].style.bottom) / 110;
    if (currentFloor === floorNum) {
      return true;
    }
  }
  return false;
}

//  טיפול ברשימת ההמתנה
function handleWaitingList() {
  if (waitingList.length === 0) return;

  var targetFloor = waitingList.shift();
  moveClosestElevator(targetFloor);
}

//  נסיעת המעלית המומלצת
function moveClosestElevator(floorNum) {
  var elevators = document.querySelectorAll(".elv");
  var closestElevator = null;
  var closestDistance = Infinity;

  elevators.forEach((elv) => {
    var currentFloor = parseInt(elv.style.bottom) / 110;
    var distance = Math.abs(currentFloor - floorNum);
    if (distance < closestDistance && !elevatorsStatus[elv.id].busy) {
      closestDistance = distance;
      closestElevator = elv;
    }
  });

  if (closestElevator) {
    elevatorsStatus[closestElevator.id].busy = true;
    elevatorsStatus[closestElevator.id].targetFloor = floorNum;
    closestElevator.style.bottom = floorNum * 110 + "px";
    closestElevator.addEventListener("transitionend", function onTransitionEnd() {
      playDingSound();
      setTimeout(() => {
        elevatorsStatus[closestElevator.id].busy = false;
        closestElevator.removeEventListener("transitionend", onTransitionEnd);
        handleWaitingList(); // Process next request in the waiting list
      }, 2000);
    });
  } else {
    waitingList.push(floorNum); // Return to the waiting list if no elevator is available
  }
}

//  צליל הגעת מעלית
function playDingSound() {
  var audio = new Audio("ding.mp3");
  audio.play();
}

createFloor();
createElevator();





