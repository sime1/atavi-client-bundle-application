/*
 * atavi-client-bundle-application
 *
 *
 * Copyright (c) 2017 sime1
 * Licensed under the MIT license.
 */

var path = require('path');
module.exports = function(grunt){

  grunt.task.registerMultiTask('atavi-client-bundle-application', 'task to create the application package file', function(){
    let extension = this.data.javascript ? '.js' : '.json';
    let src = this.data.src;
    console.log(src);
      //console.log(src[i]);
      let out = this.data.out + '/' + this.data.name + extension; //nome del file di output

      let cur = grunt.file.readJSON(src);
      let dir = path.dirname(src) + '/';  //path della cartella
      console.log("dir", dir);
      let pkg =
      {
        setup:'',
        libs:[],
        ui:''
      };
      //setup
      console.log('setup', cur.setup);
      if(cur.setup)
      {
        for(var j in cur.setup)
        {
          let setup = grunt.file.expand(dir + cur.setup[j]);
          console.log(setup);
          setup.forEach((file) => {pkg.setup += grunt.file.read(file).replace(/.*require\(.*\);?/g, '').replace(/module.exports.*/g, '');});  //require e exports non sono supportati dal browser
        }
      }
      else
        pkg.setup = grunt.file.read(dir + "/setup.js").replace(/.*require\(.*\);?/g, '').replace(/module.exports.*/g, '');
      //libs
      if(cur.libs)
        cur.libs.forEach((lib) => {pkg.libs.push(lib);} );
      else if(grunt.file.exists(dir + '/libs.json'))
        pkg.libs = grunt.file.readJSON(dir + '/libs.json');
      //cmdHandler
      if(cur.cmdHandler)
        pkg.ui = grunt.file.read(dir + '/' + cur.cmdHandler);
      //UI
      if(cur.ui)
        pkg.ui = grunt.file.read(dir + '/' + cur.ui);
      //name
      if(cur.name)
        pkg.name = cur.name;
      var str = JSON.stringify(pkg, null, 2);
      //str = str.replace(/\\n/g, '');
      console.log(out);
      if(this.data.javascript)
        str = 'export var ' + this.data.name + ' = ' + str;
      grunt.file.write(out, str);
  });
}
