var expect = require('expect.js');
var guide = require('./guide');

function find(id, data){
  return guide.run(guide.find(id), data);
}

describe('integration', function(){
  describe('meta', function(){
    it('sets default type', function(){
      var style = guide.find('TEST000a');
      expect(style.id).to.eql('TEST000a')
      expect(style.title).to.eql('Default Type of Foo')
      expect(style.types).to.eql([{'default': true, id: 'Foo'}])
      expect(style.fn()).to.eql('Foo')
    })
  })


  describe('trait types', function(){
    describe('contributor', function(){
      it('can stringify', function(){
        var data = {author: [{first: 'Foo', last: 'Bar'}]}
        var style = find('TEST0001', data);
        expect(style.errors).to.have.length(0)
        expect(style.string).to.eql('Bar, F.')
      })
    })

    describe('date', function(){
      it('can stringify', function(){
        var data = {datePublished: {year: '2012'}}
        var style = find('TEST0002', data);
        expect(style.errors).to.have.length(0)
        expect(style.string).to.eql('(2012)');
      })

      it('can be stubbed', function(){
        var style = find('TEST0002', {});
        expect(style.errors).to.have.length(0)
        expect(style.string).to.eql('(n.d.)')
      })

      it('wont be stubbed', function(){
        var data = {datePublished: {year: '2009'}}
        var style = find('TEST0002', data);
        expect(style.errors).to.have.length(0)
        expect(style.string).to.eql('(2009)')
      })
    })

    describe('string', function(){
      it('can stringify', function(){
        var data = {title: 'hello there'}
        var style = find('TEST0003', data);
        expect(style.errors).to.have.length(0)
        expect(style.string).to.eql('hello there,')
      })

      it('can be stubbed', function(){
        var style = find('TEST0004', {});
        expect(style.errors).to.have.length(0)
        expect(style.string).to.eql('foo,')
      })
    })

    describe('number', function(){
      it('can stringify', function(){
        var data = {volume: 5}
        var style = find('TEST0005', data);
        expect(style.errors).to.have.length(0)
        expect(style.string).to.eql('5,')
      })


      it('can be stubbed', function(){
        var style = find('TEST0006', {});
        expect(style.errors).to.have.length(0)
        expect(style.string).to.eql('no number,')
      })
    })
  })

  describe('text', function(){
    it('can display text', function(){
      var style = find('TEST0007', {});
      expect(style.errors).to.have.length(0)
      expect(style.string).to.eql('some text')
    })

    it('can hide a trait from a modifier', function(){
      var data = {title: 'foo'};
      var style = find('TEST0007', data);
      expect(style.errors).to.have.length(0)
      expect(style.string).to.eql('')
    })

    it('can hide text', function(){
      var style = find('TEST0008', {});
      expect(style.errors).to.have.length(0)
      expect(style.string).to.eql('')
    })

    it('can show a hidden trait from a modifier', function(){
      var data = {title: 'foo'};
      var style = find('TEST0008', data);
      expect(style.errors).to.have.length(0)
      expect(style.string).to.eql('some text')
    })

    it('can change display multiple texts', function(){
      var style = find('TEST0009', {});
      expect(style.errors).to.have.length(0)
      expect(style.string).to.eql('foobar')
    })

    it('can change text from a modifier', function(){
      var data = {title: 'foo'};
      var style = find('TEST0009', data);
      expect(style.errors).to.have.length(0)
      expect(style.string).to.eql('bambaz')
    })
  })

  describe('enum', function(){
    it('can select an enum', function(){
      var data = {title: 'first'}
      var style = find('TEST0010', data);
      expect(style.errors).to.have.length(0);
      expect(style.string).to.eql('Foo Bar');
    })

    it('can select a different enum', function(){
      var data = {title: 'second'}
      var style = find('TEST0010', data);
      expect(style.errors).to.have.length(0);
      expect(style.string).to.eql('Bar Baz');
    })

    it('can alter the str with an upon', function(){
      var data = {title: 'first', publisher:'a'}
      var style = find('TEST0010', data);
      expect(style.errors).to.have.length(0);
      expect(style.string).to.eql('FOO BAR');
    })

    it('wont alter the str with an upon selecting the wrong text', function(){
      var data = {title: 'second', publisher:'a'}
      var style = find('TEST0010', data);
      expect(style.errors).to.have.length(0);
      expect(style.string).to.eql('Bar Baz');
    })

    it('can select an enum by selector', function(){
      var data = {title: 'a'}
      var style = find('TEST0011', data);
      expect(style.errors).to.have.length(0);
      expect(style.string).to.eql('Foo Bar');
    })

    it('can select a different enum by selector', function(){
      var data = {title: 'b'}
      var style = find('TEST0011', data);
      expect(style.errors).to.have.length(0);
      expect(style.string).to.eql('Bar Baz');
    })

    it('can alter the str with an upon by selector', function(){
      var data = {title: 'a', publisher:'a'}
      var style = find('TEST0011', data);
      expect(style.errors).to.have.length(0);
      expect(style.string).to.eql('FOO BAR');
    })

    it('can alter the str with an upon by selector', function(){
      var data = {title: 'b', publisher:'a'}
      var style = find('TEST0011', data);
      expect(style.errors).to.have.length(0);
      expect(style.string).to.eql('BAR BAZ');
    })
  })

  describe('prefix and suffix', function(){
    it('can set prefix', function(){
      var data = {title: 'foo'}
      var style = find('TEST0012', data);
      expect(style.errors).to.have.length(0);
      expect(style.string).to.eql('(foo');
    })

    it('can set suffix', function(){
      var data = {title: 'foo'}
      var style = find('TEST0013', data);
      expect(style.errors).to.have.length(0);
      expect(style.string).to.eql('foo)');
    })
  })

  describe('bold or italics', function(){
    it('can embolden by default correctly', function(){
      var data = {title: 'foo'}
      var style = find('TEST0014', data);
      expect(style.errors).to.have.length(0);
      expect(style.string).to.eql('<b>(</b><b>foo</b><b>)</b>');
    })

    it('can embolden prefix correctly', function(){
      var data = {title: 'foo'}
      var style = find('TEST0015', data);
      expect(style.errors).to.have.length(0);
      expect(style.string).to.eql('<b>(</b>foo)');
    })

    it('can embolden prefix and value correctly', function(){
      var data = {title: 'foo'}
      var style = find('TEST0016', data);
      expect(style.errors).to.have.length(0);
      expect(style.string).to.eql('<b>(</b><b>foo</b>)');
    })

    it('can embolden value and suffix correctly', function(){
      var data = {title: 'foo'}
      var style = find('TEST0017', data);
      expect(style.errors).to.have.length(0);
      expect(style.string).to.eql('(<b>foo</b><b>)</b>');
    })

    it('can dual style correctly', function(){
      var data = {title: 'foo'}
      var style = find('TEST0018', data);
      expect(style.errors).to.have.length(0);
      expect(style.string).to.eql('<b>Title:</b><b><i>foo</i></b><i>...</i>');
    })
  })

  describe('show', function(){
    it('can throw error', function(){
      var style = find('TEST0019', {});
      expect(style.errors[0].message).to.eql('requires')
      expect(style.errors[0].traits).to.eql(['title'])
    })

    it('wont throw error', function(){
      var data = {title:'boom'};
      var style = find('TEST0019', data);
      expect(style.errors).to.have.length(0)
    })
  })

  describe('hide', function(){
    it('can ignore trait', function(){
      var data = {title:'boom'};
      var style = find('TEST0020', data);
      expect(style.errors).to.have.length(0)
      expect(style.string).to.eql('')
    })

    it('can ignore trait', function(){
      var style = find('TEST0020', {});
      expect(style.errors).to.have.length(0)
      expect(style.string).to.eql('');
    })
  })

  describe('optional', function(){
    it('wont throw error', function(){
      var style = find('TEST0021', {});
      expect(style.errors).to.have.length(0);
      expect(style.string).to.eql('')
    })

    it('wont throw error', function(){
      var style = find('TEST0021', {title: 'foo'});
      expect(style.errors).to.have.length(0);
      expect(style.string).to.eql('foo')
    })
  })

  describe('either', function(){
    it('can throw error', function(){
      var data = {title: 'foo', volume: 5};
      var style = find('TEST0022', data);
      expect(style.errors[0].message).to.eql('either')
      expect(style.string).to.eql('')
    })

    it('wont throw error', function(){
      var data = {title: 'foo'};
      var style = find('TEST0022', data);
      expect(style.errors).to.have.length(0);
      expect(style.string).to.eql('foo')
    })
  })

  describe('either optional', function(){
    it('can throw error', function(){
      var data = {title: 'foo', volume: 5};
      var style = find('TEST0023', data);
      expect(style.errors[0].message).to.eql('either')
      expect(style.string).to.eql('')
    })

    it('wont throw error', function(){
      var data = {title: 'foo'};
      var style = find('TEST0023', data);
      expect(style.errors).to.have.length(0);
      expect(style.string).to.eql('foo')
    })
  })


  describe('all', function(){
    it('can throw error', function(){
      var data = {volume: 5};
      var style = find('TEST0024', data);
      expect(style.errors[0].message).to.eql('requires')
      expect(style.string).to.eql('')
    })

    it('wont throw error', function(){
      var data = {title: 'foo', volume: 5};
      var style = find('TEST0024', data);
      expect(style.errors).to.have.length(0);
      expect(style.string).to.eql('foo5')
    })
  })

  describe('all optional', function(){
    it('can throw error', function(){
      var data = {volume: 5};
      var style = find('TEST0025', data);
      expect(style.errors[0].message).to.eql('requires')
      expect(style.string).to.eql('')
    })

    it('wont throw error', function(){
      var data = {title: 'foo', volume: 5};
      var style = find('TEST0025', data);
      expect(style.errors).to.have.length(0);
      expect(style.string).to.eql('foo5')
    })

    it('wont throw error', function(){
      var style = find('TEST0025', {});
      expect(style.errors).to.have.length(0);
      expect(style.string).to.eql('')
    })
  })

  describe('identical', function(){
    it('can correctly display identical traits', function(){
      var data = {datePublished: {year: '2010', month: '0'}}
      var style = find('TEST0026', data);
      expect(style.errors).to.have.length(0);
      expect(style.string).to.eql('2010 & January')
    })
  })

  // describe('multiple requirements', function(){
  //   it('shows requirements correctly', function(){
  //     var data = {publisher: 'bar', volume: 10}
  //     var style = find('TEST0033', data);
  //     expect(style.requirements[0].ids).to.eql(['title', 'publisher'])
  //     expect(style.requirements[0].ids).to.eql(['title', 'publisher'])
  //     expect(style.errors).to.have.length(0);
  //     expect(style.string).to.eql('10bar')
  //   })
  //
  //   it('raises error correctly with requirements', function(){
  //     var data = {title: 'foo', publisher:'whatup'}
  //     var style = find('TEST0033', data);
  //     expect(style.errors[0].message).to.eql('requires')
  //     expect(style.errors[0].traits).to.eql(['volume'])
  //     expect(style.errors).to.have.length(1)
  //   })
  // })

  describe('if set', function(){
    it('can set trait options if specified', function(){
      var data = {title: 'foo', publisher: 'bar'}
      var style = find('TEST0027', data);
      expect(style.errors).to.have.length(0);
      expect(style.string).to.eql('foo & bar')
    })

    it('will not set trait options if unspecified', function(){
      var data = {publisher: 'bar'}
      var style = find('TEST0027', data);
      expect(style.errors).to.have.length(0);
      expect(style.string).to.eql('bar')
    })
  })

  describe('upon set', function(){
    it('can set trait options if specified', function(){
      var data = {title: 'foo', publisher: 'bar'}
      var style = find('TEST0028', data);
      expect(style.errors).to.have.length(0);
      expect(style.string).to.eql('foo & bar')
    })

    it('will not set trait options if unspecified', function(){
      var data = {publisher: 'bar'}
      var style = find('TEST0028', data);
      expect(style.errors).to.have.length(0);
      expect(style.string).to.eql('bar')
    })
  })

  describe('upon style', function(){
    it('works correctly without requirement', function(){
      var data = {publisher: 'bar'}
      var style = find('TEST0029', data);
      expect(style.errors).to.have.length(0);
      expect(style.string).to.eql('<b>& </b><b>bar</b>')
    })

    it('raises error correctly with requirements', function(){
      var data = {title: 'foo', publisher:'bar'}
      var style = find('TEST0029', data);
      expect(style.errors).to.have.length(0);
      expect(style.string).to.eql('foo <b>bar</b>')
    })
  })

  describe('upon show', function(){
    it('raises error', function(){
      var data = {title: 'foo'}
      var style = find('TEST0030', data);
      expect(style.errors).to.have.length(1)
      expect(style.errors[0].message).to.eql('requires')
      expect(style.errors[0].traits).to.eql(['publisher'])
      expect(style.string).to.eql('')
    })

    it('ignores', function(){
      var style = find('TEST0030', {});
      expect(style.errors).to.have.length(0)
      expect(style.string).to.eql('')
    })

    it('works', function(){
      var data = {title: 'foo', publisher: 'bar'}
      var style = find('TEST0030', data);
      expect(style.errors).to.have.length(0)
      expect(style.string).to.eql('foobar')
    })
  })

  describe('upon hide', function(){
    it('works correctly without requirement', function(){
      var data = {publisher: 'bar'}
      var style = find('TEST0031', data);
      expect(style.errors).to.have.length(0);
      expect(style.string).to.eql('bar')
    })

    it('should not raise error correctly with requirements', function(){
      var data = {title: 'foo', publisher:'bar'}
      var style = find('TEST0031', data);
      expect(style.errors).to.have.length(0);
      expect(style.string).to.eql('foo')
    })
  })

  describe('upon show and hide', function(){
    it('works correctly without requirement', function(){
      var data = {publisher: 'bar', volume: 10}
      var style = find('TEST0032', data);
      expect(style.errors).to.have.length(0);
      expect(style.string).to.eql('10bar')
    })

    it('raises error correctly with requirements', function(){
      var data = {title: 'foo', publisher:'whatup'}
      var style = find('TEST0032', data);
      expect(style.errors[0].message).to.eql('requires')
      expect(style.errors[0].traits).to.eql(['volume'])
      expect(style.errors).to.have.length(1)
    })
  })
})
