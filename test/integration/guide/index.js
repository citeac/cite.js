
/**
 * Dependencies
 */

var StyleGuide = module.exports = require('../../../')();


/**
 * Setup configuration
 */

StyleGuide.config(require('./styleguide'));

/**
 * Load Styles
 */

StyleGuide
.path(__dirname)
.add('Example', './source');