const url_competition = "https://api.football-data.org/v2/competitions/2001/"; 
const api_token = "0f2dc4b034df4a189c0125b058a80ac5";
var teams = [];

function fetchApi(url) {
  return fetch(url, {
    headers: {
      'X-Auth-Token': api_token
    }
  });
}
// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    return Promise.reject(new Error(response.statusText));
  } else {    
    return Promise.resolve(response);
  }
}
// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}
// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}

function getStandings() {

  if('caches' in window){
    caches.match(url_competition + "standings").then(function(response) {
      if (response) {
        response.json().then(function (data) {
          var teams = [];
          data.standings.forEach(function(row) {
            if(row.type == "TOTAL"){
            row.table.forEach(function(standing){
              var geted = ""
              var team_badge = standing.team.crestUrl.replace(/^http:\/\//i, 'https://')
              geted += `
              <tr>
                <td class="center-align">${standing.position}</td>
                <td class="center-align">
                  <img src="${team_badge}" class="logo-team tooltipped" data-position="top" data-tooltip="${standing.team.name}" onerror="this.onerror=null;this.src='../assets/img/flag.png';">
                </td>
                <td>
                  <a href="#team&#id=${standing.team.id}" id="btn-rl_">${standing.team.name}</a>
                </td>
                <td class="center-align">${standing.playedGames}</td>
                <td class="center-align">${standing.won}</td>
                <td class="center-align">${standing.draw}</td>
                <td class="center-align">${standing.lost}</td>
                <td class="center-align">${standing.goalsFor}</td>
                <td class="center-align">${standing.goalsAgainst}</td>
                <td class="center-align">${standing.goalDifference}</td>
                <td class="center-align">${standing.points}</td>
              </tr>
              `;
              var html = document.getElementById("teams_list").innerHTML + geted;
              document.getElementById("teams_list").innerHTML = html;
            })
            }
          });
          document.getElementById("last_updated").innerHTML = "Update Terakhir: " +  data.competition.lastUpdated;
        });
      }
    });
  }

  fetchApi(url_competition + "standings")
  .then(status)
  .then(json)
  .then(function(data) {
    var teams = [];
    data.standings.forEach(function(row) {
      if(row.type == "TOTAL"){
      row.table.forEach(function(standing){
      var row = ""
      var team_badge = standing.team.crestUrl.replace(/^http:\/\//i, 'https://')
      row += `
      <tr>
        <td class="center-align">${standing.position}</td>
        <td class="center-align">
          <img src="${team_badge}" class="logo-team" onerror="this.onerror=null;this.src='../assets/img/flag.png';">
        </td>
        <td>
          <a href="#team&#id=${standing.team.id}" id="btn-rl_">${standing.team.name}</a>
        </td>
        <td class="center-align">${standing.playedGames}</td>
        <td class="center-align">${standing.won}</td>
        <td class="center-align">${standing.draw}</td>
        <td class="center-align">${standing.lost}</td>
        <td class="center-align">${standing.goalsFor}</td>
        <td class="center-align">${standing.goalsAgainst}</td>
        <td class="center-align">${standing.goalDifference}</td>
        <td class="center-align">${standing.points}</td>
      </tr>
      `;
      var html = document.getElementById("teams_list").innerHTML + row;
      document.getElementById("teams_list").innerHTML = html;
      })
      }
    });
    document.getElementById("last_updated").innerHTML = "Update Terakhir: " +  data.competition.lastUpdated;
  })
  .catch(error);
}

function getTeamById(id) {

  if('caches' in window){
    caches.match("https://api.football-data.org/v2/teams/" + id).then(function(response) {
      if (response) {
        response.json().then(function (data) {
          var teamHTML = '';
          var team_badge = data.crestUrl.replace(/^http:\/\//i, 'https://');

          teamHTML = `
              <div class="card-img">
                <div class="circle z-depth-1 white team_">
                  <img src="${team_badge}" onerror="this.onerror=null;this.src='../assets/img/flag.png';">
                </div>
              </div>
              <div class="card-desc">
                <span class="card-title blue-grey-text text-darken-4">${data.name}</span> <br>
                <span class="blue-grey-text text-darken-4" style="font-weight: bold;">${data.founded}</span>

                <blockquote class="left-align">
                  <span class="blue-grey-text text-darken-4" style="font-weight: bold;">Venue:</span><br>
                  ${data.venue}
                </blockquote>

                <blockquote class="left-align">
                  <span class="blue-grey-text text-darken-4" style="font-weight: bold;">Address:</span><br>
                  ${data.address}
                </blockquote>
                
                <blockquote class="left-align">
                  <span class="blue-grey-text text-darken-4" style="font-weight: bold;">Contact:</span><br>
                  Telepon : ${data.phone}
                  Email : ${data.email}
                </blockquote>

                <blockquote class="left-align">
                  <span class="blue-grey-text text-darken-4" style="font-weight: bold;">Website:</span><br>
                  <a href="${data.website}" target="_blank">${data.website}</a>
                </blockquote>
              </div>
            `

          var playerHTML = '<h5>Players</h5>';
          data.squad.forEach(function(player){
            playerHTML += `
                <div class="card vertical">
                  <div class="card-content">
                    <h6>${player.name}</h6>
                    <p><strong>${player.position}</strong></p>
                    <p>birth: ${player.countryOfBirth}, ${player.dateOfBirth.substring(0,10)}</p>
                    <p>nationality: ${player.nationality}</p>
                  </div>
                </div>
              `
          });

          document.getElementById("data-team").innerHTML = teamHTML;
          document.getElementById("players").innerHTML = playerHTML;
        });
      }
    });
  }

  fetchApi("https://api.football-data.org/v2/teams/" + id)
    .then(status)
    .then(json)
    .then(function(data) {
      var teamHTML = '';
      var team_badge = data.crestUrl.replace(/^http:\/\//i, 'https://');
      console.log(data.crestUrl.status);

      teamHTML = `
          <div class="card-img">
            <div class="circle z-depth-1 white team_">
              <img src="${team_badge}" onerror="this.onerror=null;this.src='../assets/img/flag.png';">
            </div>
          </div>
          <div class="card-desc">
            <span class="card-title blue-grey-text text-darken-4">${data.name}</span> <br>
            <span class="blue-grey-text text-darken-4" style="font-weight: bold;">${data.founded}</span>

            <blockquote class="left-align">
              <span class="blue-grey-text text-darken-4" style="font-weight: bold;">Venue:</span><br>
              ${data.venue}
            </blockquote>

            <blockquote class="left-align">
              <span class="blue-grey-text text-darken-4" style="font-weight: bold;">Address:</span><br>
              ${data.address}
            </blockquote>
            
            <blockquote class="left-align">
              <span class="blue-grey-text text-darken-4" style="font-weight: bold;">Contact:</span><br>
              Telepon : ${data.phone}
              Email : ${data.email}
            </blockquote>

            <blockquote class="left-align">
              <span class="blue-grey-text text-darken-4" style="font-weight: bold;">Website:</span><br>
              <a href="${data.website}" target="_blank">${data.website}</a>
            </blockquote>
          </div>
        `

      var playerHTML = '<h5>Players</h5>';
      data.squad.forEach(function(player){
        playerHTML += `
            <div class="card vertical">
              <div class="card-content">
                <h6>${player.name}</h6>
                <p><strong>${player.position}</strong></p>
                <p>birth: ${player.countryOfBirth}, ${player.dateOfBirth.substring(0,10)}</p>
                <p>nationality: ${player.nationality}</p>
              </div>
            </div>
          `
      });

      document.getElementById("data-team").innerHTML = teamHTML;
      document.getElementById("players").innerHTML = playerHTML;

    })
    .catch(error);
}

function getTeams() {
  if('caches' in window){
    caches.match(url_competition + "teams").then(function(response) {
      if (response) {
        response.json().then(function (data) {
          var teamsHTML = "";
          data.teams.forEach(function(data){
            // var team_badge = data.crestUrl.replace(/^http:\/\//i, 'https://')
            teamsHTML += `
            <div class="col s12 m12 l6">
              <div class="main-card">
                <div class="card-panel hoverable">
                  <div class="card-img">
                    <div class="circle z-depth-1 white team_">
                      <img src="${data.crestUrl}" onerror="this.onerror=null;this.src='../assets/img/flag.png';">
                    </div>
                  </div>
                  <div class="card-desc">
                    <a href="#team&#id=${data.id}" id="btn-rl_"><span class="card-title">${data.name}</span></a> <br>
                    <span class="blue-grey-text text-darken-4" style="font-weight: bold;">${data.founded}</span>

                    <blockquote class="left-align">
                      <span class="blue-grey-text text-darken-4" style="font-weight: bold;">Venue:</span><br>
                      ${data.venue}
                    </blockquote>

                    <blockquote class="left-align">
                      <span class="blue-grey-text text-darken-4" style="font-weight: bold;">Address:</span><br>
                      ${data.address}
                    </blockquote>
                    
                    <blockquote class="left-align">
                      <span class="blue-grey-text text-darken-4" style="font-weight: bold;">Contact:</span><br>
                      Telepon : ${data.phone}
                      Email : ${data.email}
                    </blockquote>

                    <blockquote class="left-align">
                      <span class="blue-grey-text text-darken-4" style="font-weight: bold;">Website:</span><br>
                      <a href="${data.website}" target="_blank">${data.website}</a>
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>
                `
          });

          document.getElementById("teams-data").innerHTML = teamsHTML;
        });
      }
    });
  }

  fetchApi(url_competition + "teams")
    .then(status)
    .then(json)
    .then(function(data) {

      var teamsHTML = "";
      data.teams.forEach(function(data){
        // var team_badge = data.crestUrl.replace(/^http:\/\//i, 'https://')
        teamsHTML += `
        <div class="col s12 m12 l6">
          <div class="main-card">
            <div class="card-panel hoverable">
              <div class="card-img">
                <div class="circle z-depth-1 white team_">
                  <img src="${data.crestUrl}" onerror="this.onerror=null;this.src='../assets/img/flag.png';">
                </div>
              </div>
              <div class="card-desc">
                <a href="#team&#id=${data.id}" id="btn-rl_"><span class="card-title">${data.name}</span></a> <br>
                <span class="blue-grey-text text-darken-4" style="font-weight: bold;">${data.founded}</span>

                <blockquote class="left-align">
                  <span class="blue-grey-text text-darken-4" style="font-weight: bold;">Venue:</span><br>
                  ${data.venue}
                </blockquote>

                <blockquote class="left-align">
                  <span class="blue-grey-text text-darken-4" style="font-weight: bold;">Address:</span><br>
                  ${data.address}
                </blockquote>
                
                <blockquote class="left-align">
                  <span class="blue-grey-text text-darken-4" style="font-weight: bold;">Contact:</span><br>
                  Telepon : ${data.phone}
                  Email : ${data.email}
                </blockquote>

                <blockquote class="left-align">
                  <span class="blue-grey-text text-darken-4" style="font-weight: bold;">Website:</span><br>
                  <a href="${data.website}" target="_blank">${data.website}</a>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
            `
      });

      document.getElementById("teams-data").innerHTML = teamsHTML;
    })
    .catch(error);
}

function getMatch() {
  if('caches' in window){
    caches.match(url_competition + "matches").then(function(response) {
      if (response) {
        response.json().then(function (data) {
          var matchesHTML = "";
          let reversedrow = data.matches.reverse();
          reversedrow.forEach(function(row){
            // console.log(row);
            this_match = {
                            id: row.id,
                            home_id: row.homeTeam.id,
                            home_name: row.homeTeam.name,
                            away_id: row.awayTeam.id,
                            away_name: row.awayTeam.name,
                            date: row.utcDate,
                            status: row.status
                        }
            matchesHTML += `
                  <div class="card horizontal">
                    <div class="card-stacked">
                      <div class="card-content center-align">
                        <table width="100%">
                          <tr>
                            <td class="right-align" width="45%">
                              <h5>${this_match.home_name}</h5>
                            </td>
                            <td class="center-align">v.s.</td>
                            <td width="45%">
                              <h5>${this_match.away_name}</h5>
                            </td>
                          </tr>
                        </table>
                        <p>
                          ${this_match.date} (${this_match.status})
                        </p>
                      </div>
                      <div class="card-action right-align">
                        <a class="favorite-button tooltipped" data-position="right" data-tooltip="Notify Me">
                          <i class="material-icons">notifications_none</i>
                        </a>
                      </div>
                    </div>
                  </div>
                `
          });

          document.getElementById("match-data").innerHTML = matchesHTML;

          const elms = document.getElementById("match-data").getElementsByClassName("favorite-button");
          for (let i = 0; i < elms.length; i++) {
              elms[i].onclick = () => {
                  const saveMatch = {
                      id: data.matches[i].id,
                      home_id: data.matches[i].homeTeam.id,
                      home_name: data.matches[i].homeTeam.name,
                      away_id: data.matches[i].awayTeam.id,
                      away_name: data.matches[i].awayTeam.name,
                      date: data.matches[i].utcDate,
                      status: data.matches[i].status
                  };
                  dbAddMatch(saveMatch)
              }
            }
        });
      }
    });
  }

  fetchApi(url_competition + "matches")
    .then(status)
    .then(json)
    .then(function(data) {

      var matchesHTML = "";
      let reversedrow = data.matches.reverse();
      let temp = 0;
      // console.log(storeit);
        // var storeit = [];
        // dbPromise.then(function(db) {
        //         var tx = db.transaction('saved-match', 'readonly');
        //         var store = tx.objectStore('saved-match');

        //         return store.getAll(); 
        //       }).then(function(matches_db) {
        //         matches_db.forEach(function(getmatches){
        //           temp = getmatches.id;
        //           storeit.push(temp);
        //         });
        //         temp_ = storeit.length;
        //         // console.log(temp_);
        //       }).catch(error);
        // console.log(storeit[0]);
      reversedrow.forEach(function(row){
        // for(var i = 0; i < storeit.length; i++){
        //   console.log(i);
        // }

        this_match = {
                        id: row.id,
                        home_id: row.homeTeam.id,
                        home_name: row.homeTeam.name,
                        away_id: row.awayTeam.id,
                        away_name: row.awayTeam.name,
                        date: row.utcDate,
                        status: row.status
                    }
        matchesHTML += `
              <div class="card horizontal">
                <div class="card-stacked">
                  <div class="card-content center-align">
                    <table width="100%">
                      <tr>
                        <td class="right-align" width="45%">
                          <h5>${this_match.home_name}</h5>
                        </td>
                        <td class="center-align">v.s.</td>
                        <td width="45%">
                          <h5>${this_match.away_name}</h5>
                        </td>
                      </tr>
                    </table>
                    <p>
                      ${this_match.date} (${this_match.status}) ${this_match.id}
                    </p>
                  </div>

                  <div class="card-action right-align" id="added">
                  `;

                    matchesHTML += `
                            <a class="favorite-button tooltipped" data-position="right" data-tooltip="Notify Me" data-id="${temp}">
                              <i class="material-icons">notifications_none</i>
                            </a>

                          </div>

                        </div>
                      </div>
                    `;
                  
          // console.log(this_match.id);
          temp++;
      });

      document.getElementById("match-data").innerHTML = matchesHTML;

      const elms = document.getElementById("match-data").getElementsByClassName("favorite-button");
      for (let i = 0; i < elms.length; i++) {

          elms[i].onclick = (e) => {
              e.target.parentNode.parentNode.innerHTML = "Terdaftar.";
              const saveMatch = {
                  id: data.matches[i].id,
                  home_id: data.matches[i].homeTeam.id,
                  home_name: data.matches[i].homeTeam.name,
                  away_id: data.matches[i].awayTeam.id,
                  away_name: data.matches[i].awayTeam.name,
                  date: data.matches[i].utcDate,
                  status: data.matches[i].status
              };
              dbAddMatch(saveMatch);
              console.log(elms[i]);
          }
        }

    })
    .catch(error);

}