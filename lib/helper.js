

module.exports = {

  extends: function(child, parent){
    for (var key in parent) {
      if({}.hasOwnProperty.call(parent, key)) {
        child[key] = parent[key];
      }
    }
    
    function ctor() {
      this.constructor = child;
    }
    
    ctor.prototype = parent.prototype;
    
    child.prototype = new ctor();
    
    child.__super__ = parent.prototype;
    
    return child;
  
  },

  replaceExtension: function(file){
    if('string' == typeof file){
      return file.replace(/\.[^\.]+$/, extension);
    }
  },

  mixin: function(a, b) {
    if(a && b){
      for (var key in b) {
        a[key] = b[key];
      }
    }
    return a;
  },

  minify: function(html){
    html =  html
    // Removal html comment
      .replace(/<!--[\s\S]*?-->/g,"")
    // Removal js comment
      .replace(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/g, "")
    // Removal of the blank of two or more
      .replace(/\s{2,}/g,"\n")
    ;
    return html;
  }
}
