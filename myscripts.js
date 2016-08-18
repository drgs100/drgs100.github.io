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
  
  
  // restart button
  var restart = $("#restart-btn");
  function restartFunc () {
    window.location.reload(true);
  }
  restart.onclick = restartFunc;
  
  
  // use array to collect the role of the two robots
  var robotsArr = [];
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  // get robots
  request.open('GET', 'robots.json');
  request.onreadystatechange = function() {
    if ((request.readyState === 4) && (request.status === 200)) {
      var items = JSON.parse(request.responseText);
      
      // show robots
      var i;
      var robots;
      for (i = 0; i < items.length; i++) {
        robots = document.createElement('li');
        robots.id = items[i].shortname;
        robots.className = 'dynamic-link';
        robots.innerHTML = items[i].name;    
        robots.onclick = dynamicEvent;
        $('#showRobots').appendChild(robots);
        
      }
    }
  }; // get robots
  
  // show robotes
  var c = 0;
  function dynamicEvent() {
    if (c === 0) {
      this.className += ' yourRobot';
      this.innerHTML += '<span class="align-right">your robot</span>';
      $("#selectYou").setAttribute("class", "hidden");
      $("#selectOpponent").className = "";
      // populate our robots array for later use
      robotsArr = [this.id]; 
      ++c;
      return c;
    } else if ((c === 1) && (this.className !== 'dynamic-link yourRobot')) {
      this.className += ' yourOpponent';
      this.innerHTML += '<span class="align-right">your opponent</span>';
      // populate our robots array for later use
      robotsArr.push(this.id);
      ++c;
      return c;
    }
  } // show robots
 
  request.send();
 
  
  // hide selectRobot and show combat
  var toCombat = document.getElementById('toCombat');
  
  
  // global robot variables
  var shootername = $('#shootername'),
      accuracy = $('#accuracy'),
      power = $('#power');
        
  var targetname = $('#targetname'),
      tn = $('#tn'),
      head = $('#head'),
      torso = $('#torso'),
      legs = $('#legs'); 

  function showCombat (){
    // also make sure both robots have been selected
    if (c === 2) {
      $('#selectRobot').className = 'hidden';
      $('#combat').className = '';
    } else {
      if (c === 0) { $('#selectYou').innerHTML += ' select both robots'; }
      if (c === 1) { $('#selectOpponent').innerHTML += ' select both robots'; }
    }

    // get combat values via robotArr
    
    var yourRobot = robotsArr[0],
        opponentRobot = robotsArr[1];
   
    var items = JSON.parse(request.responseText);
    var i;
    
    for (i = 0; i < items.length; i++) {
      
      // shooter
      if (items[i].shortname === yourRobot) {
        shootername.innerHTML += items[i].name;
        accuracy.innerHTML += items[i].accuracy;
        power.innerHTML += items[i].power;        
      }
      
      // target
      if (items[i].shortname === opponentRobot) {
        targetname.innerHTML += items[i].name;
        tn.innerHTML += items[i].tn;
        head.innerHTML += items[i].head;
        torso.innerHTML += items[i].torso;
        legs.innerHTML += items[i].legs;
      }
      
    }
   
  } // showCombat
  
  toCombat.onclick = showCombat;
  
  
  // conduct combat
  
  var fire = document.getElementById('fire-btn');
  
  function conductCombat (){
    
    // does the shot hit?
    var rollToHit = d(6),
        shot = rollToHit + parseInt(accuracy.innerHTML);
    var fireControl = $('#fireControl');
    
    
    // missfire
    if (rollToHit === 1) {
      fireControl.innerHTML = "Missfire"; 
    } else {
    // hit
      if (shot >= tn.innerHTML ) {
        fireControl.innerHTML = "HIT!";
        hitLocation();
    // miss
      } else {
        fireControl.innerHTML = "Shot wide";
      }
    }  
    
    
    // what location?
    function hitLocation(){
      var rollhitLocation = d(6);
      var damage = parseInt(power.innerHTML);
      
      if (rollhitLocation === 1) {
        // head
        head.innerHTML -= damage;
      } else if ((rollhitLocation >= 2) && (rollhitLocation <= 4)){
        // torso
        torso.innerHTML -= damage;
      } else {
        // legs
        legs.innerHTML -= damage;
      }
      damageControl();
    } // hitLocation
    
    
    // damageControl
    function damageControl(){ 
      
      var head_dc = parseInt(head.innerHTML),
          torso_dc = parseInt(torso.innerHTML),
          legs_dc = parseInt(legs.innerHTML); 
    
      if ((head_dc <= 0 ) || (torso_dc <= 0) || (legs_dc <= 0)){
        
        // target destroyed
        var targetDestroyed = document.createElement("p"); 
        targetDestroyed.innerHTML = "<p>Target destroyed!</p>";
        $('#target').appendChild(targetDestroyed);
        
        // remove fire btn and replace with restart
        $('#fire-btn').className = "hidden";
        $('#restart-btn').className = "btn";
      } 
    } // damageControl
  
  } // conductCombat 
  
  fire.onclick = conductCombat;
  
})();