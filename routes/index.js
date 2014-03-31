
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'BadAssPlayer', description: 'Stream music form soudncloud with nodejs!' });

};
