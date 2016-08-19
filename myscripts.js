(function (){

  // querySelector, jQuery style
  var $ = function (selector) {
    return document.querySelector(selector);
  };


  // dice function
  function d(sides){
    return 1 + Math.floor(Math.random() * sides);
  }
  
  
  // set up ajax call
  var request;
  if (window.XMLHttpRequest) {
    request = new XMLHttpRequest();
  } else {
    request = new ActiveXObject('Microsoft.XMLHTTP'); // IE version
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////
  // *** turn request into a function and add the readystate and status. 
  // *** if ((request.readyState === 4) && (request.status === 200)) { };
  //////////////////////////////////////////////////////////////////////////////////////////////////
  
  
  
  
  
  
  // use array to collect the role of the two robots
  var robotsArr = [];






  // get then show robots
  request.open('GET', 'robots.json');
  request.onreadystatechange = function() {
    if ((request.readyState === 4) && (request.status === 200)) {
      var items = JSON.parse(request.responseText);
      var robots;
      for (var i = 0; i < items.length; i++) {
        robots = document.createElement('li');
        robots.id = items[i].shortname;
        robots.className = 'dynamic-link';
        robots.innerHTML = items[i].name;    
        robots.onclick = dynamicEvent;
        $('#showRobots').appendChild(robots);      
      }
    }
  };
  request.send();
  
  // select robotes
  var c = 0;
  function dynamicEvent() {
    // c used to count selections
    if (c === 0) {
      this.className += ' yourRobot';
      this.innerHTML += '<span class="align-right">your robot</span>';
      $("#selectYou").setAttribute("class", "hidden");
      $("#selectOpponent").className = "";
      // populate the robots array for later use
      robotsArr = [this.id]; 
      ++c;
      return c;
    } else if ((c === 1) && (this.className !== 'dynamic-link yourRobot')) {
      this.className += ' yourOpponent';
      this.innerHTML += '<span class="align-right">your opponent</span>';
      // add to the robots array for later use
      robotsArr.push(this.id);
      ++c;
      return c;
    }
  } // dynamicEvent
 
  
 
  
  // hide #selectRobot, populate and show #combat
  var toCombat = document.getElementById('toCombat');
  
  // get global robot variables from webpage 
  var shootername = $('#shootername'),
      accuracy = $('#accuracy'),
      power = $('#power');
  var targetname = $('#targetname'),
      tn = $('#tn'),
      head = $('#head'),
      torso = $('#torso'),
      legs = $('#legs'); 
      
  var p2_shootername = $('#p2-shootername'),
      p2_accuracy = $('#p2-accuracy'),
      p2_power = $('#p2-power');
  var p2_targetname = $('#p2-targetname'),
      p2_tn = $('#p2-tn'),
      p2_head = $('#p2-head'),
      p2_torso = $('#p2-torso'),
      p2_legs = $('#p2-legs'); 
      


  function showCombat (){
    // make sure both robots have been selected if not give warning, if so show next section
    if (c === 2) {
      $('#selectRobot').className = 'hidden';
      $('#combat').className = '';
    } else {
      if (c === 0) { $('#selectYou').innerHTML += ' select both robots'; }
      if (c === 1) { $('#selectOpponent').innerHTML += ' select both robots'; }
    }

    // get robot from robotArr
    var yourRobot = robotsArr[0],
        opponentRobot = robotsArr[1];
    var items = JSON.parse(request.responseText);
    
    for (var i = 0; i < items.length; i++) {
      // get shooter values
      if (items[i].shortname === yourRobot) {
        shootername.innerHTML += items[i].name;
        accuracy.innerHTML += items[i].accuracy;
        power.innerHTML += items[i].power;
        p2_targetname.innerHTML += items[i].name;
        p2_tn.innerHTML += items[i].tn;
        p2_head.innerHTML += items[i].head;
        p2_torso.innerHTML += items[i].torso;
        p2_legs.innerHTML += items[i].legs;        
      }
      // get target values
      if (items[i].shortname === opponentRobot) {
        targetname.innerHTML += items[i].name;
        tn.innerHTML += items[i].tn;
        head.innerHTML += items[i].head;
        torso.innerHTML += items[i].torso;
        legs.innerHTML += items[i].legs;
        p2_shootername.innerHTML += items[i].name;
        p2_accuracy.innerHTML += items[i].accuracy;
        p2_power.innerHTML += items[i].power;
      } 
    }
  } // showCombat
  toCombat.onclick = showCombat;
  
  
  // conductCombat
  var fire = document.getElementById('fire-btn');
  var fire_p2 = document.getElementById('p2-fire-btn'); 
  
  function conductCombat (p){
    
    var rollToHit = d(6),
        shot = rollToHit + parseInt(accuracy.innerHTML);
    var fireControl = $('#fireControl');
    var fireControl_2 = $('#p2-fireControl');
    
    if (rollToHit === 1) { // missfire
      if (p === "p1") { 
        fireControl.innerHTML = "Missfire";
      } else {
        fireControl_2.innerHTML = "Missfire";
      }
    } else {
      if (shot >= tn.innerHTML ) { // hit
        if (p === "p1") {
          fireControl.innerHTML = "HIT!";
          hitLocation("p1");
        } else {
          fireControl_2.innerHTML = "HIT!";
          hitLocation("p2");
        }
      } else { // miss
        if (p === "p1"){
          fireControl.innerHTML = "Shot wide";
        } else {
          fireControl_2.innerHTML = "Shot wide";
        }
      }
    }  
    
    function hitLocation(p){
      var rollhitLocation = d(6);
      var damage = parseInt(power.innerHTML);
      
      if (rollhitLocation === 1) { // head
        if (p === "p1") { 
          head.innerHTML -= damage;
        } else {
          p2_head.innerHTML -= damage;
        }
      } else if ((rollhitLocation >= 2) && (rollhitLocation <= 4)){ // torso
        if (p === "p1") {
          torso.innerHTML -= damage;
        } else {
          p2_torso.innerHTML -= damage;
        }
      } else { // legs
        if (p === "p1") {
          legs.innerHTML -= damage;  
        } else {
          p2_legs.innerHTML -= damage;
        }
      }
      
      if (p === "p1") {
        damageControl("p1");  
      } else {
        damageControl("p2");
      }
      
    } // hitLocation
        
    function damageControl(p){
      var head_dc = parseInt(head.innerHTML),
          torso_dc = parseInt(torso.innerHTML),
          legs_dc = parseInt(legs.innerHTML); 
      var p2_head_dc = parseInt(p2_head.innerHTML),
          p2_torso_dc = parseInt(p2_torso.innerHTML),
          p2_legs_dc = parseInt(p2_legs.innerHTML);
          
      if  ((head_dc <= 0 ) || (torso_dc <= 0) || (legs_dc <= 0) || (p2_head_dc <= 0 ) || (p2_torso_dc <= 0) || (p2_legs_dc <= 0)) {
        // target destroyed 
        var targetDestroyed = document.createElement("p"); 
            targetDestroyed.innerHTML = "Target destroyed!";
            
        if (p === "p1") {  // player one
          $('#target').appendChild(targetDestroyed);
          // remove fire btn and replace with restart
          $('#fire-btn').className = "hidden";
          $('#p1-restart').className = "restart-btn btn"
        } else { // player two
          $('#p2-target').appendChild(targetDestroyed);
          // remove fire btn and replace with restart
          $('#p2-fire-btn').className = "hidden";
          $('#p2-restart').className = "restart-btn btn"
        }
      } 
    } // damageControl
  
  } // conductCombat 

  // event listeners passing the player parameter
  fire.addEventListener('click', function () { conductCombat("p1"); }, false);
  fire_p2.addEventListener('click', function () {conductCombat("p2"); }, false);
  
})();
