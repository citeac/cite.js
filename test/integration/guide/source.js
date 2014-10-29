/*!
 * export
 */

module.exports = exports = []


/*!
 * defaults
 */

function defaults(){
  this
  .set('datePublished', function(date){
    date.format('YYYY')
    date.stub('n.d.')
  })
}


/**
 * Contributor
 *
 * @id TEST0001
 */

exports.push(function(){
  this
  .trait('author', function(a){
    a.separators(', ', ' & ');
    a.format('Last, F.');
  })
})



/**
 * Date
 *
 * @id TEST0002
 */

exports.push(function(){
  this
  .inherit(defaults)
  .trait('(datePublished)')
})


/**
 * String
 *
 * @id TEST0003
 */

exports.push(function(){
  this.trait('title,')
})


/**
 * String stub
 *
 * @id TEST0004
 */

exports.push(function(){
  this.trait('title,', {stub: 'foo'})
})


/**
 * Number
 *
 * @id TEST0005
 */

exports.push(function(){
  this.trait('volume,')
})


/**
 * Number stub
 *
 * @id TEST0006
 */

exports.push(function(){
  this.trait('volume,', {stub: 'no number'})
})


/**
 * text
 *
 * @id TEST0007
 */

exports.push(function(){
  this
  .text('some text')
  .upon('title', function(){
    this.hide('text');
  })
})


/**
 * text hide
 *
 * @id TEST0008
 */

exports.push(function(){
  this
  .text('some text', function(t){
    t.hide()
  })
  .upon('title', function(){
    this.show('text');
  })
})


/**
 * text multi
 *
 * @id TEST0009
 */

exports.push(function(){
  this
  .text('foo')
  .text('bar')
  .upon('title', function(){
    this.set('text', {content:'bam'});
    this.set('text1', {content:'baz'});
  })
})


/**
 * enum
 *
 * @id TEST0010
 */

exports.push(function(){
  this
  .trait('title', function(title){
    title.enum()
      .add('first', 'Foo Bar')
      .add('second', 'Bar Baz')
  })
  .upon('publisher', function(){
    this.set('title', function(title){
      title.enum({0: 'FOO BAR'})
    })
  })
})


/**
 * enum selector
 *
 * @id TEST0011
 */

exports.push(function(){
  this
  .trait('title', function(title){
    title.enum()
      .add('first', 'Foo Bar', {selector: 'a'})
      .add('second', 'Bar Baz', {selector: 'b'})
  })
  .upon('publisher', function(){
    this.set('title', function(title){
      title.enum({0: 'FOO BAR', 1: 'BAR BAZ'})
    })
  })
})


/**
 * prefix
 *
 * @id TEST0012
 */

exports.push(function(){
  this.trait('(title')
})


/**
 * suffix
 *
 * @id TEST0013
 */

exports.push(function(){
  this.trait('title)')
})



/**
 * bold
 *
 * @id TEST0014
 */

exports.push(function(){
  this
  .trait('(title)', function(title){
    title.bold()
  })
})


/**
 * bold prefix
 *
 * @id TEST0015
 */

exports.push(function(){
  this
  .trait('(title)', function(title){
    title.bold('prefix')
  })
})


/**
 * bold prefix and main
 *
 * @id TEST0016
 */

exports.push(function(){
  this
  .trait('(title)', function(title){
    title.bold('prefix main')
  })
})

/**

 * bold main and suffix
 *
 * @id TEST0017
 */

exports.push(function(){
  this
  .trait('(title)', function(title){
    title.bold('main suffix')
  })
})


/**

 * bold and italics
 *
 * @id TEST0018
 */

exports.push(function(){
  this
  .trait('Title:title...', function(title){
    title.bold('prefix main');
    title.italics('main suffix');
  })
})


/**
 * show
 *
 * @id TEST0019
 */

exports.push(function(){
  this.trait('title', function(){
    this.show();
  })
})


/**
 * hide
 *
 * @id TEST0020
 */

exports.push(function(){
  this.trait('title', function(){
    this.hide();
  })
})



/**
 * optional
 *
 * @id TEST0021
 */

exports.push(function(){
  this
  .optional('title')
  .trait('title')
})


/**
 * either
 *
 * @id TEST0022
 */

exports.push(function(){
  this
  .either('title', 'volume')
  .trait('title')
  .trait('volume')
})


/**
 * either optional
 *
 * @id TEST0023
 */

exports.push(function(){
  this
  .either('title', 'volume', {optional:true})
  .trait('title')
  .trait('volume')
})



/**
 * all
 *
 * @id TEST0024
 */

exports.push(function(){
  this
  .all('title', 'volume')
  .trait('title')
  .trait('volume')
})


/**
 * all optional
 *
 * @id TEST0025
 */

exports.push(function(){
  this
  .all('title', 'volume', {optional:true})
  .trait('title')
  .trait('volume')
})




/**
 * identical
 *
 * @id TEST0026
 */

exports.push(function(){
  this
  .inherit(defaults)
  .trait('datePublished')
  .trait(' & datePublished', function(date){
    date.format('MMMM')
  }, false);
})


/**
 * if set
 *
 * @id TEST0027
 */

exports.push(function(){
  this
  .upon('title', function(){
    this.set('publisher', {prefix: ' & '})
  })
  .optional('title')
  .trait('title')
  .trait('publisher')
})


/**
 * upon set
 *
 * @id TEST0028
 */

exports.push(function(){
  this
  .upon('title', function(){
    this.set('publisher', {prefix: ' & '})
  })
  .optional('title')
  .trait('title')
  .trait('publisher')
})


/**
 * upon style
 *
 * @id TEST0029
 */

exports.push(function(){
  this
  .optional('title')
  .trait('title')
  .trait('& publisher', function(pub){
    pub.bold()
  })
  .upon('title', function(){
    this.set('publisher', function(pub){
      pub.prefix(' ');
      pub.bold('main');
    })
  })
})


/**
 * upon show
 *
 * @id TEST0030
 */

exports.push(function(){
  this
  .hide('publisher')
  .trait('title')
  .trait('publisher')
  .upon('title', function(){
    this.show('publisher')
  })
})


/**
 * upon hide
 *
 * @id TEST0031
 */

exports.push(function(){
  this
  .upon('title', function(){
    this.hide('publisher')
  })
  .optional('title')
  .trait('title')
  .trait('publisher')
})

/**
 * upon show and hide
 *
 * @id TEST0032
 */

exports.push(function(){
  this
  .upon('title', function(){
    this.show('volume')
    this.hide('publisher')
  })
  .optional('title')
  .optional('volume')
  .trait('title')
  .trait('volume')
  .trait('publisher')
})


/**
 * multiple requirements
 *
 * @id TEST0033
 */

exports.push(function(){
  this
  .atleast('title', 'publisher')
  .trait('title')
  .trait('publisher')
  .trait('author')
  .either('title', 'author')
  .show('publisher')
})

