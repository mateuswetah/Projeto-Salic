module.exports = {
  staticFileGlobs: [
    '/var/www/app.salic/**.html',
    '/var/www/app.salic/**.js',
    '/var/www/app.salic/**.css',
    '/var/www/app.salic/assets/*'
  ],
  root: '/var/www/app.salic',
  stripPrefix: '/var/www/app.salic/',
  navigateFallback: '/index.html'
};
