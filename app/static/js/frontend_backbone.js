/** @jsx React.DOM */

// OTHER FRAMEWORK STUFF, NOT PART OF MVC //

React.Backbone = {
  listenToProps: function(props) {
    _.each(this.updateOnProps, function(events, propName) {
      propName = events;
      switch(events) {
      case 'collection': 
        events = 'add remove reset sort';
        break;
      case 'model':
        events = 'change';
      }
      this.listenTo(props[propName], events, function() { this.forceUpdate(); })
    }, this)
  },
 
  componentDidMount: function() {
    this.listenToProps(this.props);
  },
 
  componentWillReceiveProps: function(nextProps) {
    this.stopListening();
    this.listenToProps(nextProps);
  },
 
  componentWillUnmount: function() {
    this.stopListening();
  }
}
 
_.extend(React.Backbone, Backbone.Events);

// END FRAMEWORK //

var ContentContainer = Backbone.Model.extend({
    tagName: 'div',
    url: '/request',
    initialize: function() {
        this.fetch({
            success: function(data) {
                this.set({kwgCollection:
                    new KWGCollection(
                        $.map(data.attributes, function(item){return item;}), // convert JSON to Array
                        {parse: true}
                    )
                });

                React.renderComponent(
                    <KWGCont model={this.get('kwgCollection')}/>
                , document.getElementById('keywordCont'));
            }.bind(this),

            failed: function() {
                console.log('failed to fetch original data!');
            }
        })

    }
});

var KWGCont = React.createClass({
    mixins: [React.Backbone],
    updateOnProps: { 'items': 'collection' },
    render: function() {
        var keynum = 0;
        var kwgCollection = this.props.model;
        var kwgc_view = kwgCollection.map(function(kwg) {
            keynum++;
            return (
                <KWGView /*key={keynum}*/ model={kwg}/>
            );
        });
        return (
            <div>
            {kwgc_view}
            </div>
        );
    }
});




var KWGroup = Backbone.Model.extend({
    tagName: 'div',
    initialize: function() {
        this.rotateWords();
        this.kwgClasses = 'kwgContainer';
    },
    parse: function(data_quad) {
        data_quad.displayedWord = data_quad.wordchoice[0];
        data_quad.keywordCat = this.genKeywordString(data_quad.wordchoice);
        return data_quad;
    },
    rotateWords: function() {
        var index = 0;
        window.setInterval(function() {
            this.set({displayedWord: this.get("wordchoice")[index]});
            index === 10 ? index = 0 : index++;
        }.bind(this), 400);
    },
    genKeywordString: function(wordchoice) {
        return _.reduce(wordchoice, function(keywordString, keyword) {
            return keywordString += " " + keyword;
        });
    }
});

var KWGView = React.createClass({
    mixins: [React.Backbone],
    updateOnProps: { 'item': 'model' },
    render: function() {
        return (
        <div onMouseEnter={this.initRegisterHover} onMouseLeave={this.cancelHover} className={this.props.model.get('kwgClasses') || 'kwgContainer'} >
            <span className="kwgRotating">
                {this.props.model.get('displayedWord')}
            </span>
            <span className="kwgHover">
                {this.props.model.get('keywordCat') || 'null'}
            </span>
        </div>

        );
    },
    initRegisterHover: function() {
        this.hoverValid = true;
        window.setTimeout(function() {
            if (this.hoverValid)
                this.props.model.set({kwgClasses: 'kwgContainer longhover'});
        }.bind(this), 400)
    },
    cancelHover: function() {
        this.hoverValid = false;
        this.props.model.set({kwgClasses: 'kwgContainer'})
    }
});

var KWGCollection = Backbone.Collection.extend({
    model: KWGroup,
    initialize: function() {}
});

 
/*
var KWGColView = new Backbone.CollectionView({
    el: $('#keywordCont'),
    selectable: true,
    collection: KWGCollection
    modelView: KWGView

})*/

var contentContainer = new ContentContainer();