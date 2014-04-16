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
        $('#album').find('img').attr('src', '');
        $('.track').text('');
        $('.desc').text('No artist found :(');
        return;
      }
      $('#album').find('img').attr('src', track.artwork_url );
      $('.track').text(track.user.username);
      $('.desc').text(track.title);
      Player.engine.player.current = track;
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
    jQuery('#playlist div i').on('click', function(){
      $('#playlist').slideToggle();
    })
    $('#play').click(function(){ 
      Player.engine.player.toggle(); 
    });    
    $('.backward').click(function(){ 
      Player.engine.player.prev(); 
    });  
    $('.forward').click(function(){ 
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
        $('#playlist').empty().slideToggle();
        Player.engine.fetchTracks($('.find-input').val(), function(tracks){
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


          Player.engine.extractIdFormLink($(this).val(), function(id){
            console.log(id);
          })
        
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
      Player.engine.setTrack( $(this).data('permalink') );
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
    });

    $('#progress').click(function(){
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
  }

  };
}(jQuery, window, console));

window.onload = function(){
  Player.engine.init();
}