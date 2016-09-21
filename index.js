/* jshint node: true */
'use strict';
var MergeTrees = require('broccoli-merge-trees');
var Funnel = require('broccoli-funnel');
var path = require('path');


module.exports = {
  name: 'ghost-ed',
    treeForVendor: function() {
    let files = [];
    const MOBILEDOC_DIST_DIRECTORY = path.join(path.dirname(
    	require.resolve(path.join('mobiledoc-kit', 'package.json'))), 'dist');
    
    files.push(new Funnel(MOBILEDOC_DIST_DIRECTORY, {
      files: [
        'amd/mobiledoc-kit.js',
        'amd/mobiledoc-kit.map'
      ],
      destDir: 'mobiledoc-kit'
    }));

    return new MergeTrees(files);
  },

  included: function(app) {
    app.import('vendor/mobiledoc-kit/amd/mobiledoc-kit.js');
    
  }
};
