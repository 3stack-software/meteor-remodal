Package.describe({
  name: '3stack:remodal',
  version: '1.0.3',
  summary: 'A library for reactively launching bootstrap modals',
  git: 'https://github.com/3stack-software/meteor-remodal',
  documentation: 'README.md'
});

Package.onUse(function (api) {

  api.versionsFrom('METEOR@0.9.2');

  api.use([
    'reactive-var',
    'jquery',
    'templating',
    'spacebars',
    'ejson',
    'underscore'
  ], 'client');

  api.use('iron:router@1.0.0', 'client', {weak: true});

  api.export('Remodal', 'client');

  api.addFiles([
    'remodal.html',
    'remodal.js'
  ], 'client');

});
