# Just Another Framework
JAF is just another javascript framework. It uses MVP + a front router.

# Dependencies
JAF depends on underscore, jquery and hogan.

# Libraries
JAF includes the following libraries
 * eventer
 * globals
 * model
 * presenter
 * view
 
## eventer
Eventer gives you easy access to event handling.

```
define(['jaf/eventer'], function(eventer) {
    "use strict";

    var listener = eventer.listener();
    
    listener.on('my-event', function () { /* do something */ });
    listener.trigger('my-event'); // does something
    
    // You can listen several events using space
    listener.on('evt1 evt2', myCallback);
    
    // When triggering events, all extra arguments will be
    // arguments to the callback function
    listener.trigger('my-event', arg1, arg2, arg3);
});
```
## model
Returns an object with ```changed``` and ```changing``` event listeners

```
var person = model({
    'name': 'John',
    'age': 18
});

person.on('change', function (attr, val) { console.log(attr, 'is', val); });
person.set('age', 22); // logs "age is 22"
var name = person.get('name'); // "John"
```

## presenter
The whole idea of a presenter is to represent a visible element in the page, so
all presenters define a ```el``` variable, it only operates inside that element.

The presenter can trigger events, but it cannot see other presenters, it's job
is to listen to view and model events.

```
define(['jaf/presenter', 'jaf/model'], function (presenter, model) {
    "use strict";
    
    var el = $('#some-element'),
        person = model({
            name: 'Mike',
            age: 25
        });
    
    return presenter.extend({
        'init': function () {
            // when an element is clicked (bind view)
            el.find('.some-other-element').click(function () {
                // do something
            });
            
            // when an attribute of person changes (bind models)
            person.on('change', function (attr, name) {
                // update an html element inside "el"
                el.find('#some-container[id=' + attr + ']').text(name);
            });
        }
    });
});
```
