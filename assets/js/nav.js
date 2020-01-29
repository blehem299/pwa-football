document.addEventListener("DOMContentLoaded", function() {
  // Activate sidebar nav
  var elems = document.querySelectorAll(".sidenav");
  M.Sidenav.init(elems);
  loadNav();
 
  function loadNav() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status != 200) return;
   
        // Muat daftar tautan menu
        document.querySelectorAll(".topnav, .sidenav").forEach(function(elm) {
          elm.innerHTML = xhttp.responseText;
        });
   
        // Daftarkan event listener untuk setiap tautan menu
        document.querySelectorAll(".sidenav a, .topnav a").forEach(function(elm) {
          elm.addEventListener("click", function(event) {
            // Tutup sidenav
            var sidenav = document.querySelector(".sidenav");
            M.Sidenav.getInstance(sidenav).close();
   
            // Muat konten halaman yang dipanggil
            page = event.target.getAttribute("href").substr(1);
            loadPage(page);
          });
        });
      }
    };
    xhttp.open("GET", "nav.html", true);
    xhttp.send();
  }

  $(document).on('click', '#btn-rl_', function(){
    var hash_parts = $(this).attr("href").split('&', 2);
    // console.log(hash_parts);
    page = $(this).attr("href").substr(1);

    if (hash_parts[1] === undefined) {
      loadPage(page);
    } else {
      var page = hash_parts[0].replace('#','');
      var id_ = hash_parts[1].replace('#id=','');

      loadPage(page, id_);
    }
  });

    // Load page content
  var hash_parts = location.hash.split('&', 2);
  var page = window.location.hash.substr(1);
  console.log(hash_parts[1]);
  if (page == "") {
    page = "home";
    loadPage(page);
  } else {
    if (hash_parts[1] === undefined) {
      loadPage(page);
    } else {
      var page = hash_parts[0].replace('#','');
      var id_ = hash_parts[1].replace('#id=','');

      loadPage(page, id_);
    }
  }
   
  function loadPage(page, id) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        var content = document.querySelector("#body-content");
        // var preload = 
        if (page === 'standings') {
          getStandings();
        } else if(page === 'team') {
          getTeamById(id);
        } else if(page === 'teams') {
          getTeams();
        } else if(page === 'match') {
          getMatch();
        } else if(page === 'saved') {
          dbGetFavoritMatch();
        }

        $('#content').addClass('loading');
        $('.preloader-background').fadeIn('fast');
        $('.preloader-wrapper').fadeIn('fast');

        if (this.status == 200) {
          $('.preloader-background').delay(1000).fadeOut('slow',function(){
            $('#content').removeClass('loading');
          });
          content.innerHTML = xhttp.responseText;
          $('.preloader-wrapper').delay(1000).fadeOut();
        } else if (this.status == 404) {
          content.innerHTML = "<p>Halaman tidak ditemukan.</p>";
        } else {
          content.innerHTML = "<p>Ups.. halaman tidak dapat diakses.</p>";
        }
      }
    };
    xhttp.open("GET", "pages/" + page + ".html", true);
    xhttp.send();
  }

  function fadeOut(id, element){ 
    let class_ = document.getElementsByClassName(id);
    let id_ = document.getElementById(element);

    // console.log(class_);
    class_.style.opacity = 0;
    id_.classList.remove(id);
  }

  function fadeIn(id, element){ 
    let class_ = document.getElementsByClassName(id);
    let id_ = document.getElementById(element);

    id_.classList.add(id);
    class_.style.opacity = 1;
  }
});
