import dispatcher from "../Dispatcher";
import actionTypes from "./actionTypes";
import axios from "axios";

/**
 * dispatch ADD_CATEGORY, adds new category
 * @param {Category} category
 */
export function addCategory(category) {
  axios.post("categories/add", category).then((res) => {
    category.category_id = res.data.category_id;
    dispatcher.dispatch({
      type: actionTypes.ADD_CATEGORY,
      payload: category,
    });
  });
}

/**
 * dispatch GET_CATEGORIES, returns all categories
 */
export function getCategories() {
  axios.get("categories").then((res) => {
    dispatcher.dispatch({
      type: actionTypes.GET_CATEGORIES,
      payload: res.data,
    });
  });
}

/**
 * dispatch UPDATE_CATEGORY, updates category
 * @param {Category} category
 */
export function updateCategory(category) {
  axios.put(`categories/update/${category.category_id}`, category).then(() => {
    dispatcher.dispatch({
      type: actionTypes.UPDATE_CATEGORY,
      payload: category,
    });
  });
}

/**
 * dispatch DEL_CATEGORY, deletes category
 * @param {int} category_id
 */
export function delCategory(category_id) {
  axios.delete(`categories/delete/${category_id}`).then(() => {
    dispatcher.dispatch({
      type: actionTypes.DEL_CATEGORY,
      payload: category_id,
    });
  });
}
