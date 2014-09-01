/**
* 
*/

var debug = require('debug')('vulcanize-middleware');
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

var vulcanize = require('vulcanize');

var helper = require('./helper');

var minify = helper.minify;
var mixin =  helper.mixin;

var replaceExtension = helper.replaceExtension;

var __extends = helper.extends;

module.exports = function (options){
  return function(req, res, next){

    options = options || {};

    var dest = options.dest || null;

    var render = res.app.render;

    res.app.render = function(name, options, fn) {

      var self = this;

      var VulcanizeView  = (function(_super){
        __extends(VulcanizeView, _super);

        function VulcanizeView() {
          VulcanizeView.__super__.constructor.apply(this, arguments);
        }

        VulcanizeView.prototype.render = function(options, fn) {
          VulcanizeView.__super__.render.call(this, options, function(err, str){
            if(err) return req.next(err);

            var sha1 = crypto.createHash('sha1');
            sha1.update(str);

            var hash = sha1.digest('hex');

            debug('str %s', hash);

            var filename = path.join(dest, path.basename(replaceExtension(options.filename, '-' + hash + '.html')));

            fs.exists(filename, function(exists){
              debug(filename + 'is exists', exists);
            });
            
            fs.writeFile(filename, str, function(err){
              if(err) return req.next(err);

              var _opt = {};
              
              _opt.output = _opt.input = filename;

              vulcanize.setOptions(_opt, function(err){
                if(err) return req.next(err);

                vulcanize.processDocument();
                
                fs.readFile(filename, function(err, data){
                  if(err) return req.next(err);
                  
                  data = minify(data.toString('utf8'));
                  
                  fs.unlink(filename, function(err){});
                  
                  fn.call(this, err, data);
                  
                });
              });
            //- fs.writeFile
            });
          });          
        };

        return VulcanizeView;

      })(this.get('view'));

      this.set('view', VulcanizeView);

      render.call(res.app, name, options, fn);

    };
    
    next();

  };
};
