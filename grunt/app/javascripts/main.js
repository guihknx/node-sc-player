var MusicPlayer = function(){
	this.init();
};
MusicPlayer.prototype.init = function() {
	this.handlevolsBox();
	this.handleVolume();
};
MusicPlayer.prototype.handlevolsBox = function(){
	jQuery('.add-media').on('click', function(){
		jQuery('#playlist').slideToggle();
	});
};
MusicPlayer.prototype.handleVolume = function(){
var isDragging = false, startClientY,startThumbY;

$('.controller')
    .mousedown(function(event){
        isDragging = true;
        startClientY = event.clientY;
        startThumbY = parseInt($(this).css('top'), null);
        return false; 
    });

$('.vol')
    .mousedown(function(event){
        isDragging = true;
        startClientY = event.clientY;
        startThumbY = event.clientY - $('.vol').offset().top - $('.controller').height()/2;
        $('.controller').css('top', startThumbY +"px");
        return false; 
    });

$(window)
    .mousemove(function(event){
        if (isDragging)
        {
            var thumbY = startThumbY + event.clientY - startClientY;
            var volHeight = $('.vol').height() - $('.controller').height();
            
            if (thumbY > volHeight){
                thumbY = volHeight;
            }
            else if (thumbY < 0){
                thumbY = 0;
            }
            
            var percentage = Math.floor((volHeight - thumbY)/volHeight * 100);
            
            $('.controller')
                .css('top', thumbY +"px")
                .text(percentage +"%");
            
            
            return false; 
        }
    })
    .mouseup(function(){
        isDragging = false;
    });
};

window.onload=function(){
	return ( new MusicPlayer() );
};