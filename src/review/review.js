import React from 'react';
import './review.css';
import firebase, { auth, provider } from '../header/firebase';

export class Review extends React.Component {

  constructor() {
  super();
  this.state = {
    currentItem: '',
    username: '',
    items: [],
    user: null
  }
  this.handleChange = this.handleChange.bind(this);
  this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const itemsRef = firebase.database().ref('items');
    const item = {
      title: this.state.currentItem,
      user: this.state.user.displayName || this.state.user.email
    }
    itemsRef.push(item);
    this.setState({
      currentItem: '',
      username: ''
    });
  }

  componentDidMount() {
      auth.onAuthStateChanged((user) => {
        if (user) {
          this.setState({ user });
        }
      });
      const itemsRef = firebase.database().ref('items');
      itemsRef.on('value', (snapshot) => {
        let items = snapshot.val();
        let newState = [];
        for (let item in items) {
          newState.push({
            id: item,
            title: items[item].title,
            user: items[item].user
          });
        }
        this.setState({
          items: newState
        });
      });
    }

  removeItem(itemId) {
     const itemRef = firebase.database().ref(`/items/${itemId}`);
     itemRef.remove();
  }

  render() {
    const link = 'https://image.tmdb.org/t/p/w300';
    return(
      <div>
        <h3>Review</h3>
        <div className="figureContainer">
          <section className='add-item'>
              <form onSubmit={this.handleSubmit}>
                <input type="text" name="username" placeholder="Username" onChange={this.handleChange} value={this.state.username} />
                <input type="text" name="currentItem" placeholder="Movie review" onChange={this.handleChange} value={this.state.currentItem} />
                <button>Add Review</button>
              </form>
          </section>
          <section className='display-item'>
            <div className="wrapper">
              <ul>
              {this.state.items.map((item) => {
              return (
              <li class="new_style" key={item.id}>
                 <h3>{item.title}</h3>
                 <p>reviewed by: {item.user}
                  {item.user === this.state.user.displayName || item.user === this.state.user.email ?
                   <button onClick={() => this.removeItem(item.id)}>Remove Item</button> : null}
                 </p>
              </li>
              )
              })}
              </ul>
            </div>
          </section>
        </div>
      </div>
    );
  }
}
