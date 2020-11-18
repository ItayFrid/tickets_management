import dispatcher from "../Dispatcher";
import actionTypes from "./actionTypes";
import axios from "axios";

/**
 * dispatch ADD_USER, adds new user
 * @param {User} user
 */
export function addUser(user) {
  return axios.post("users/add", user).then((res) => {
    dispatcher.dispatch({
      type: actionTypes.ADD_USER,
      payload: user,
    });
    return res.data;
  });
}

/**
 * dispatch GET_USERS, get all users
 */
export function getUsers() {
  axios.get("users").then((res) => {
    dispatcher.dispatch({
      type: actionTypes.GET_USERS,
      payload: res.data,
    });
  });
}

/**
 * dispatch UPDATE_USER, updates user
 * @param {User} user
 */
export function updateUser(user) {
  axios.put(`users/update/${user.user_id}`, user).then((res) => {
    dispatcher.dispatch({
      type: actionTypes.UPDATE_USER,
      payload: user,
    });
  });
}

/**
 * dispatch DEL_USER, deletes user
 * @param {int} user_id
 */
export function delUser(user_id) {
  axios.delete(`users/delete/${user_id}`).then(() => {
    dispatcher.dispatch({
      type: actionTypes.DEL_USER,
      payload: user_id,
    });
  });
}

export function getUserDetails(id) {
  return axios.post(`users/details`, id);
}
