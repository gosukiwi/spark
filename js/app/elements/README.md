# Elements
This folder contains a bunch of elements.
An element is an abstraction of an html element, it contains an html view
as well as some other properties.

The elements are used by the canvas in the main presenter.

## Atributes
 * isContainer - [bool]
 * isResizable - [bool]
 * properties - [jaf/model]
 * container - [Element] The parent container
 * type - [string]

## Events
 * onSelected
 * onDeselected

## Methods
 * el - get or set the jQuery DOM element
 * onSelected
 * onDeselected
 * selected - gets or sets whether this element is currently selected
 * applyHTML - given a hash it sets them as html props of ```el```
 * append - appends an element's el to this el
 * remove - removes the element from the canvas

# Canvas
The canvas is a special kind of element which holds a list of all children
elements it contains, as well as some extra events and method overrides.

## Events
 * onSelectionChanged
 * onNothingSelected

## Methods
 * onSelectionChanged
 * onNothingSelected
 * selected - gets the currently selected element
 * add - creates a new element using the factory
 * cssChanged - set the canvas css styles
 * htmlChanged - sets the canvas html properties
