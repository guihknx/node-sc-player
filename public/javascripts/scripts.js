var MusicPlayer = function(){
	this.init();
};
MusicPlayer.prototype.init = function() {
	this.handleTracksBox();
};
MusicPlayer.prototype.handleTracksBox = function(){
	jQuery('.add-media').on('click', function(){
		jQuery('#playlist').slideToggle();
	});
};
window.onload=function(){
	return ( new MusicPlayer() );
};;