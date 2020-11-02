import { EventEmitter } from "events";
import dispatcher from "../Dispatcher";
import actionTypes from "../actions/actionTypes";

const CHANGE_EVENT = "change";
let _categories = [];

class categoryStore extends EventEmitter {
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
  emitChange() {
    this.emit(CHANGE_EVENT);
  }
  getCategories() {
    return _categories;
  }
  addCategory(category) {
    _categories.push(category);
  }
  delCategory(category_id) {
    _categories = _categories.filter(
      (category) => category.category_id !== category_id
    );
  }
  updateCategory(newCategory) {
    _categories = _categories.map((category) =>
      category.category_id === newCategory.category_id ? newCategory : category
    );
  }
}

const store = new categoryStore();

dispatcher.register((action) => {
  switch (action.type) {
    case actionTypes.ADD_CATEGORY:
      store.addCategory(action.payload);
      store.emitChange();
      break;
    case actionTypes.DEL_CATEGORY:
      store.delCategory(action.payload);
      store.emitChange();
      break;
    case actionTypes.UPDATE_CATEGORY:
      store.updateCategory(action.payload);
      store.emitChange();
      break;
    case actionTypes.GET_CATEGORIES:
      _categories = action.payload;
      store.emitChange();
      break;

    default:
  }
});

export default store;
