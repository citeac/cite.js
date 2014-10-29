var expect = require('expect.js');
var StyleGuide = require('..');

/**
 * foo bar baz
 * multi line
 *
 * This is a test fixture style
 *
 * @id BOOK12345
 */

exports[0] = function(){
  return 'foo bar';
}

describe('styleguide', function(){
  var sg;

  beforeEach(function(){
    sg = StyleGuide()
  })

  it('should be a fn', function(){
    expect(StyleGuide).to.be.a('function');
    expect(StyleGuide()).to.be.a(StyleGuide);
  })

  describe('.config()', function(){
    it('should setup config correctly', function(){
      sg.config({id: 'test', title: 'TEST', version:'1'})
      expect(sg.id).to.eql('test')
      expect(sg.title).to.eql('TEST')
      expect(sg.version).to.eql('1')
    })
  })

  describe('.add()', function(){
    beforeEach(function(){
      sg.path(__dirname)
    })

    it('should load sources correctly', function(){
      sg.add('Book', './styleguide');
      expect(sg.styles.BOOK12345.id).to.eql('BOOK12345')
      expect(sg.styles.BOOK12345.title).to.eql('foo bar baz multi line')
      expect(sg.styles.BOOK12345.sourceType).to.eql('Book')
      expect(sg.styles.BOOK12345.description).to.eql('<p>This is a test fixture style</p>')
      expect(sg.styles.BOOK12345.fn()).to.eql('foo bar')
    })
  })
})
