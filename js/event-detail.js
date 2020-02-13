//Get the current URL
var url = window.location.href;
//Split the URL
var v = url.split("?");
var d = v[1].split("&");
//Trim off the identifiers and store as variable
var e = d[0].substr(2); //The event key
var game = d[1].substr(5); //The game name

console.log(e);
console.log(game);

GetData();

//Get the data from the database
function GetData(){
  //Clear the html for the event card
  document.getElementById("event").innerHTML = '';
  //Clear the html for the players card
  document.getElementById("players").innerHTML = '';
  //Get the data from the database for the selected radio button
  return database.ref('/' + game + '/' + e).once('value', function(snapshot) {
  //Store the data
  const eventData = snapshot.val();
  //The template we'll use for the event card
  const eventCard = `
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">${eventData.title}</h5>
        <h6 class="card-subtitle mb-2 text-muted">${eventData.details}</h6>
      </div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item"><strong>Players:</strong> ${eventData.openSpots}</li>
        <li class="list-group-item"><strong>Start time:</strong> ${eventData.startDate} ${eventData.startTime} ${eventData.timezone}</li>
        <li class="list-group-item"><strong>End time:</strong> ${eventData.endDate} ${eventData.endTime} ${eventData.timezone}</li>
        <li class="list-group-item"><strong>Created by:</strong> ${eventData.gamertag}</li>
      </ul>
    </div>`;

    //Add to the html on the page
    document.getElementById("event").innerHTML += eventCard;
    console.log(eventData);

    //Seperate out the players joined data from the data we already pulled
    const playerData = eventData.joined;
    const backupData = eventData.backups;
    //Add to the html on the page
    for(x in playerData)
    {
      document.getElementById("players").innerHTML += '<li class="list-group-item">'+playerData[x].gamertag+' <a class="btn btn-sm btn-outline-dark float-right" data-toggle="collapse" href="#j-'+ x +'" role="button" aria-expanded="false" aria-controls="collapseExample">Remove</a></li><div class="collapse" id="j-'+ x +'"><div class="card-body">Remove '+playerData[x].gamertag+'?<a href="" class="btn btn-sm btn-outline-danger float-right" onclick="PlayerDelete('+ "'" + x +"'" + ','+"'"+'joined' + "'" + ')">DELETE</a></div></div>';
    }
    for(y in backupData)
    {
      document.getElementById("backups").innerHTML += '<li class="list-group-item">'+backupData[y].gamertag+' <a class="btn btn-sm btn-outline-dark float-right" data-toggle="collapse" href="#b-'+ y +'" role="button" aria-expanded="false" aria-controls="collapseExample">Remove</a></li><div class="collapse" id="b-'+ y +'"><div class="card-body">Remove '+backupData[y].gamertag+'?<a href="" class="btn btn-sm btn-outline-danger float-right" onclick="PlayerDelete('+ "'" + y +"'" + ','+"'"+'backups' + "'" + ')">DELETE</a></div></div>';
    }
  });
}

function PlayerJoin() {
  var joinTypes = document.getElementsByName('join-radios');
  for (var i = 0, length = joinTypes.length; i < length; i++) {
    if (joinTypes[i].checked) {
      // do whatever you want with the checked radio
      var joinType = joinTypes[i].value
      // only one radio can be logically checked, don't check the rest
      break;
    }
  }
  var gamertag = document.getElementById("gamertag").value;
  if(gamertag != "")
  {
    if(joinType == "main")
    {
      //Add the gamertag to the joined branch
      var ref = firebase.database().ref('/' + game + '/' + e + '/joined').push({
        gamertag
      });
    }
    else if(joinType == "backup")
    {
      //Add the gamertag to the backups branch
      var ref = firebase.database().ref('/' + game + '/' + e + '/backups').push({
        gamertag
      });
    }
    location.reload();
  }
  else {
    var element = document.getElementById("gamertag");
    //Add the is-invalid class which makes the field red
    element.classList.add("is-invalid");
    //Check if the invalid-feeback class has already been added and if not, add it and the necessary html
    if(element.parentElement.querySelector(".invalid-feedback") == null){
      element.parentElement.innerHTML += '<div class="invalid-feedback">Provide your gamertag</div>';
    }
  }
}

function PlayerDelete(id, joinType)
{
  var ref = firebase.database().ref('/' + game + '/' + e + '/'+ joinType +'/' + id).remove();
  // document.getElementById("player-join").action = "https://bmansayswhat.github.io/game-scheduler/event-detail.html?e="+e +"&game="+game;
  location.reload();
}
