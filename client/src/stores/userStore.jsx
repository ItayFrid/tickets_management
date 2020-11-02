import { EventEmitter } from "events";
import dispatcher from "../Dispatcher";
import actionTypes from "../actions/actionTypes";

const CHANGE_EVENT = "change";
let _users = [];

class userStore extends EventEmitter {
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
  emitChange() {
    this.emit(CHANGE_EVENT);
  }
  getUsers() {
    return _users;
  }
  addUser(user) {
    _users.push(user);
  }
  delUser(user_id) {
    _users = _users.filter((user) => user.user_id !== user_id);
  }
  updateUser(newUser) {
    _users = _users.map((user) =>
      user.user_id === newUser.user_id ? newUser : user
    );
  }
}

const store = new userStore();

dispatcher.register((action) => {
  switch (action.type) {
    case actionTypes.ADD_USER:
      store.addUser(action.payload);
      store.emitChange();
      break;
    case actionTypes.DEL_USER:
      store.delUser(action.payload);
      store.emitChange();
      break;
    case actionTypes.UPDATE_USER:
      store.updateUser(action.payload);
      store.emitChange();
      break;
    case actionTypes.GET_USERS:
      _users = action.payload;
      store.emitChange();
      break;
    case actionTypes.GET_USER:
      store.addUser(action.payload);
      store.emitChange();
      break;

    default:
  }
});

export default store;
