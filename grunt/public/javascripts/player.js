(function ($, window, console, undefined) {
  "use strict";
  window.Player = window.Player || {};
  window.Player.engine = {
    _xhrlock: false,
    _that: this,
    _locked: true,
    init : function () {
        this.buttons();
        this.player  =  SC.Widget($('iframe.sc-widget')[0]);
        this.leftPos = $('#progress').offset();
        this.containerWidth = $('#progress').width();
        this.pos;
        this.control();
        this.progress();


    },
    control: function(){
        this.player.bind(SC.Widget.Events.READY, function(eventData) { 
          Player.engine.updateTrack();  
        });
        
        this.player.bind(SC.Widget.Events.FINISH, function(e){
           $('.loaded').css('width', 0);
           $('#time').text('00:00').
            $("#play")
            .addClass('fa-play')
            .removeClass('fa-pause');  
        });
        this.player.bind(SC.Widget.Events.PLAY_PROGRESS, function(e) {
            Player.engine.formatTime(e.currentPosition, function(r){
                $('#time').text(Player.engine.padNumber(r.m)+':'+Player.engine.padNumber(r.s));
            });

            if( e.relativePosition < 0.003 ) {    
                Player.engine.updateTrack(); 
            }
            $('.loaded').css('width', ( e.relativePosition*100)+"%");

            if( !$("#play").hasClass('fa-pause') ) {
                $("#play")
                .removeClass('fa-play')
                .addClass('fa-pause'); 
            }
        });
        this.player.bind(SC.Widget.Events.PAUSE, function(e) {   
            Player.engine.updateTrack();
            $("#play")
            .addClass('fa-play')
            .removeClass('fa-pause');  
        });
  },
  updateTrack: function() {
    Player.engine.player.getCurrentSound(function(track) {
      if(!track) {
        $('#album').find('img').attr('src', 'http://placehold.it/350x350');
        $('.track').text('');
        $('.desc').text('Error: verify URL');
        return;
      }
      $('#album').find('img').attr('src', track.artwork_url );
      $('.track').text(track.user.username);
      $('.desc').text(track.title);
      Player.engine.player.current = track;
      $('.working').fadeOut(function(){
            if( $('#album').find('img').attr('src') == undefined ){
                $('#album').find('img').attr('src', 'http://placehold.it/350x350&text=' + $('.desc').text() )
            }
      });
    });

    Player.engine.player.getDuration(function(value){
      Player.engine.player.duration = value;
    });

    Player.engine.player.isPaused(function(bool){
      Player.engine.player.getPaused = bool;
    });

    // setTimeout(function(){
    //     Player.engine.player.toggle();
    // }, 2000);
    
  },
  buttons: function(){
    $('#progress').littleTooltip();
    setTimeout(function(){
                Player.engine.handleState();
            }, 500)
    jQuery('#playlist div i').on('click', function(){
      $('#playlist').slideToggle();
    })
    $('#play').click(function(){ 
      Player.engine.player.toggle(); 
    });    
    $('#prev').click(function(){ 
      Player.engine.player.prev(); 
    });  
    $('#next').click(function(){ 
      Player.engine.player.next(); 
    });
    $('#add').click(function(){ 
      $(this).fadeOut(function(){
        $('#search').fadeIn();
      });
      if( ! $('.add-input').is(':visible') ){
        $('.add-input').fadeIn(function(){
          $('.find-input').fadeOut();
        });
      }
    });

    $('.find-input').on('keyup',function(e){
      if( e.keyCode == 13){
        $('.working').fadeIn();
        $('#playlist').empty().slideToggle();
        var search_query = $('.find-input').val();
        Player.engine.fetchTracks(encodeURIComponent(search_query), function(tracks){
          var track = tracks;
          Player.engine.handleBars(track);
          $.each(track, function(index, val){
           // console.log(track[0]);

          })

        })
      }
    });

    $('.add-input').on('keyup',function(e){
      if( e.keyCode == 13){
          $('.working').fadeIn();
          Player.engine.extractIdFormLink($(this).val(), function(id){
            console.log(id);
          });
        
          Player.engine.setTrack($(this).val());
      }
    });
    $('#search').click(function(){ 
      $(this).fadeOut(function(){
        $('#add').fadeIn();
      });
      if( ! $('.find-input').is(':visible') ){
        $('.find-input').fadeIn(function(){
          $('.add-input').fadeOut();
        });
      }
    });
  },
  setTrack: function(addr){
    if ( addr != '' ) {
      this.player.pause();
      this.player.load(addr, {
        callback: function(){
          Player.engine.updateTrack();
        }
      });
    }

  },
  fetchTracks : function(_q, ret){
    $.getJSON('/fetch?q=' + _q, function(e){
      ret(JSON.parse(e))
    })
  },
  handleBars : function(dataTracks){ 
    var source = $("#some-template").html(); 
    var template = Handlebars.compile(source); 
    var data = { 
        tracks: dataTracks
    }; 
    Handlebars.registerHelper('fullName', function() {
     return Player.engine.trimWords( this.title , 50);
    });
    $('.center').append(template(data));

    $('.track-item').on('click', function(event){
      event.preventDefault();
      var pased_uri = $(this).data('permalink').split('/');
      history.pushState("", document.title, "/");
      document.title = $(this).find('span').text();
      history.pushState({track: pased_uri[4]}, null, '/track/'+pased_uri[4])
      Player.engine.setTrack( $(this).data('permalink') );
    });
    $('.working').fadeOut(function(){
       // setTimeout(function(){}, 500)
        Player.engine.scroller();
    });
  },
  trimWords : function(text, maxLength) {
    var ret = text;
    if (ret.length > maxLength) {
        ret = ret.substr(0,maxLength-3) + "...";
    }
    return ret; 
  },
  extractIdFormLink: function(permalink, callback){
    var resolve = 'http://api.soundcloud.com/resolve.json?client_id=YOUR_CLIENT_ID&url=';
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
      if (this.readyState === 4 && this.responseText) {
        var response = JSON.parse(this.responseText);
        if (response.id) callback(response.id);
      }
    };
    request.open('get', resolve+permalink, true);
    request.send();
 
  },
  progress: function(){
    $('#progress').mousemove(function(e){
      Player.engine.pos = (e.pageX-Player.engine.leftPos.left);

        var seek = Player.engine.player.duration*(Player.engine.pos/Player.engine.containerWidth);
        Player.engine.formatTime(seek, function(ms){
            $('.tooltip').text(Player.engine.padNumber(ms.m)+':'+Player.engine.padNumber(ms.s))
        });

    });
    console.log(Player.engine.pos);
    $('#progress').click(function(){
        $("#play")
        .removeClass('fa-play')
        .addClass('fa-pause'); 
      $('.loaded').css('width',Player.engine.pos+"px");
      var seek = Player.engine.player.duration*(Player.engine.pos/Player.engine.containerWidth);
      Player.engine.player.seekTo(seek);
    });
  },
  formatTime: function(ms, returnfor) {
    returnfor({
      h: Math.floor(ms/(60*60*1000)),
      m: Math.floor((ms/60000) % 60),
      s: Math.floor((ms/1000) % 60)
    });
    return;
  },
  padNumber: function(n){
    return ( n > 9 ) ? n : "0" + n;
  },
  scroller: function(){
    $('#playlist ul').slimScroll({
        height: '250px',
        railVisible: true,
        alwaysVisible: false
    });
    // Fix broken images, see later
    $('img').each(function(){
        if( $(this).attr('src') == '' ){
            $(this).attr('src', 'http://placehold.it/350x350')
        }
    });
  },
  handleState : function(){
    // var state = history.state;
    // if( state.track != '' ){
    //     Player.engine.setTrack('http://api.soundcloud.com/tracks/'+state.track+'&callback=true');
    // }
    console.log($('body').data('track'))

    if( $('body').data('track') != '' ){
        Player.engine.setTrack('http://api.soundcloud.com/tracks/'+ $('body').data('track')+'&callback=true');
    }
    
  },
  };
}(jQuery, window, console));

window.onload = function(){
  Player.engine.init();
}