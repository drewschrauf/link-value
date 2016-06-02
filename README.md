# LinkValue

[![Build Status](https://travis-ci.org/drewschrauf/link-value.svg?branch=master)](https://travis-ci.org/drewschrauf/link-value)
[![Coverage Status](https://coveralls.io/repos/github/drewschrauf/link-value/badge.svg?branch=master)](https://coveralls.io/github/drewschrauf/link-value?branch=master)
[![npm version](https://badge.fury.io/js/link-value.svg)](https://badge.fury.io/js/link-value)

LinkValue is a tiny library designed for making complex forms in React easier to build. It allows you to take a large, complicated state object and create `value`/`onChange` pairs for smaller chunks of that object. Passing these pairs down to child components allows you to break your form up into small, manageable pieces that remain decoupled from the larger form.

## Example

Let's solve the classic problem of making a form to edit items in a list of values. Our container holds the state and renders a Form taking a `value` (a list of books) and an `onChange` listener.

```javascript
class Container extends Component {
  constructor() {
    super()
    this.state = {
      books: [
        {title: 'The Very Hungry Caterpillar', author: 'Eric Carle'},
        {title: 'Possum Magic', author: 'Mem Fox'},
        // ...etc
      ]
    }
  }

  // update the state with a new books array
  handleChange(newBooks) {
    this.setState({books: newBooks})
  }

  // render the Form component taking the array of books and our change handler
  render() {
    return (
      <Form value={this.state.books} onChange={this.handleChange} />
    )
  }
}
```

Now we can make the `Form` component. This is taking the entire list of books as its `value` and will emit the entire list of books on each change. Note the decorator we're using here to add LinkValue to the component then using it with `{...this.props.makeLink(path)}`.

```javascript
import linkValue from 'link-value'

@linkValue
class Form extends Component {
  render() {
    return (
      <ul>
        {this.props.value.map((book, i) => (
          <li><BookForm {...this.props.makeLink(i)} /></li>
        ))}
      </ul>
    )
  }
}
```

That `makeLink` call in the render of `BookForm` just made a new `value`/`onChange` pair from the `value` and `onChange` supplied to the Form. Each of these pairs contains a single book as a value (found using the index (`i`) passed to `makeLink`) and an `onChange` handler that knows how to update just that book. Now we can use these values to render the actual book form:

```javascript
import linkValue from 'link-value'

@linkValue
class BookForm extends Component {
  render() {
    return (
      <div>
        Title: <input {...this.props.makeLink('title')} />
        Author: <input {...this.props.makeLink('author')} />
      </div>
    )
  }
}
```

Again, we've used `makeLink` to make `value`/`onChange` pairs for individual fields in a single book. Editing one of these fields will trigger the `onChange` for the `BookForm`, which triggers the `onChange` in the `Form` which triggers the `handleChange` up in the `Container`. At each step, our values are combined so that by the time the event has reached the `Container` component, the `handleChange` function receives the entire array of books with just a small part modified.

## API

The primary way to use LinkValue is through the decorator. This adds three extra properties to your component, `makeLink`, `makeMergeLink` and `makeCheckedLink`, each taking a path. These are just the following functions with the `value` and `onChange` bound to the `value` and `onChange` provided to the component. The functions are also available with `import { makeLink, makeMergeLink, makeCheckedLink } from 'link-value'`.

### makeLink(value, onChange, ...path)

Generates an object containing a new `value` and `onChange` for a given path.

```javascript
const books = [{title: 'Old Title', author: 'Old Author'}, ...]
const logChange = newVal => console.log(newVal)

const link = makeLink(books, logChange, 0, 'title')
console.log(link.value) // logs 'Old Title'
link.onChange('New Title') //logs [{title: 'New Title', author: 'Old Author'}, ...]
```

### makeMergeLink(value, onChange, ...path)

Sometimes you don't want the value passed to the `onChange` to completely replace the contents in the `value`. In these cases, you want to use `makeMergeLink` to add the properties to the object instead.

```javascript
const weather = [
  {city: 'Melbourne', high: 28, low: 12},
  {city: 'Sydney', high: 24, low: 15},
  ...
]
const logChange = newVal => console.log(newVal)

const link = makeMergeLink(value, logChange, 1)
console.log(link.value) // logs {city: 'Sydney', high: 24, low: 15}
link.onChange({high: 30}) // just update the high, logs...
//[
//  {city: 'Melbourne', high: 28, low: 12},
//  {city: 'Sydney', high: 30, low: 15}, // (Note the new high!)
//  ...
//]
```

If we tried to use `makeLink` here, the 'Sydney' object would have been completely replaced by an object only containing the 'high'. Using `makeMergeLink` updated the 'high' on the existing object.

### makeCheckedLink(value, onChange, ...path)

Checkboxes are handled a little differently to other inputs in React. For this reason, `makeCheckedLink` is provided alongside `makeLink` to deal with these slight differences. Instead of a `value`/`onChange` pair being produced, a `checked`/`onChange` pair is produced instead.

## Contribute

Pull requests welcome. Please make sure tests pass with:

```
npm test
```
