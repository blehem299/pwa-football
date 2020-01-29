var dbPromise = idb.open("runner-cl", 1, function(upgradeDb) {
  if (!upgradeDb.objectStoreNames.contains("saved-match")) {
    var peopleOS = upgradeDb.createObjectStore("saved-match");
    peopleOS.createIndex("id", "id", { unique: true });
  }
});


function dbAddMatch(match) {
  console.log(match.id);
  dbPromise.then(function(db) {
    var tx = db.transaction('saved-match', 'readwrite');
    var store = tx.objectStore('saved-match');

      store.put(match, match.id);

      return tx.complete;
    }).then(function() {
      console.log('Favorit Match berhasil disimpan.');

      let toastContent = '<span>Favorit Match Berhasil disimpan</span>&nbsp;&nbsp; <button class="btn-flat waves-effect waves-red red-text" onclick="M.Toast.getInstance(this.parentElement).dismiss();">Tutup</button>';
      M.toast({html: toastContent,displayLength : 8000});
    }).catch(function() {
      console.log('Favorit Match gagal disimpan.');
      let toastContent = '<span>Favorit Match Gagal disimpan</span>&nbsp;&nbsp; <button class="btn-flat waves-effect waves-red red-text" onclick="M.Toast.getInstance(this.parentElement).dismiss();">Tutup</button>';
      M.toast({html: toastContent,displayLength : 8000});
    })
}

function dbDeleteMatch(match_id) {
    dbPromise.then(function(db) {
      var tx = db.transaction('saved-match', 'readwrite');
      var store = tx.objectStore('saved-match');
      store.delete(match_id);
      return tx.complete;
    }).then(function() {
      console.log('Item deleted');
      let toastContent = '<span>Item Dihapus</span>&nbsp;&nbsp; <button class="btn-flat waves-effect waves-red red-text" onclick="M.Toast.getInstance(this.parentElement).dismiss();">Tutup</button>';
      M.toast({html: toastContent,displayLength : 8000});
    });
}

function dbGetFavoritMatch() {
  dbPromise.then(function(db) {
    var tx = db.transaction('saved-match', 'readonly');
    var store = tx.objectStore('saved-match');
    return store.getAll();
  }).then(function(matches) {
    console.log(matches);
    var matchesHTML = "";
    let reversedrow = matches.reverse();
    reversedrow.forEach(function(this_match){
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
                  <a class="removefavorite-button"
                     class="tooltipped" data-position="right" data-tooltip="Delete">
                    <i class="material-icons">clear</i>
                  </a>
                </div>
              </div>
            </div>
          `
    });

    document.getElementById("match-data").innerHTML = matchesHTML;

    const elms = document.getElementById("match-data").getElementsByClassName("removefavorite-button");
    for (let i = 0; i < elms.length; i++) {
      elms[i].onclick = () => {
          dbDeleteMatch(matches[i].id);
          dbGetFavoritMatch();
      }
    }

  });
}

function getId(id)
{
  // var a;
  return dbPromise.then(function(db) {
      var tx = db.transaction('saved-match', 'readonly');
      var store = tx.objectStore('saved-match');

      return store.get(id);
    }).then(function(matches_db) {
      return matches_db.id;
    });
  // return a;
}