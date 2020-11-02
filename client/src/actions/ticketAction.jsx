import dispatcher from "../Dispatcher";
import actionTypes from "./actionTypes";
import axios from "axios";

/**
 * this function dispatch ADD_TICKET to the dispatcher with the ticket as payload
 * and sends post request to server
 * @param {object} ticket
 */
export function addTicket(ticket) {
  axios.post("tickets/add", ticket).then((res) => {
    ticket.ticket_id = res.data.ticket_id;
    ticket.created_at = res.data.created_at;
    dispatcher.dispatch({
      type: actionTypes.ADD_TICKET,
      payload: ticket,
    });
  });
}

/**
 * dispatch GET_TICKETS to the dispatcher and gets all tickets from DB
 */
export function getTickets() {
  axios.get("tickets").then((res) => {
    dispatcher.dispatch({
      type: actionTypes.GET_TICKETS,
      payload: res.data,
    });
  });
}

/**
 * dispatch GET_USER_TICKETS to the dispactcher and gets specific user's tickets to DB
 * @param {int} id
 */
export function getUserTickets(id) {
  axios.get(`tickets/${id}`).then((res) => {
    dispatcher.dispatch({
      type: actionTypes.GET_USER_TICKETS,
      payload: res.data,
    });
  });
}

/**
 * dispatch UPDATE_TICKET to the dispatcher and updates ticket in DB
 * @param {object} ticket
 */
export function updateTicket(ticket) {
  axios.put(`tickets/update/${ticket.ticket_id}`, ticket).then(() => {
    dispatcher.dispatch({
      type: actionTypes.UPDATE_TICKET,
      payload: ticket,
    });
  });
}

/**
 * dispatch DEL_TICKET to the dispatcher and deletes ticket from DB
 * @param {int} ticket_id
 */
export function delTicket(ticket_id) {
  axios.delete(`tickets/delete/${ticket_id}`).then(() => {
    dispatcher.dispatch({
      type: actionTypes.DEL_TICKET,
      payload: ticket_id,
    });
  });
}

/**
 * dispatch CLEAR_TICKETS to the dispatcher
 */
export function clearTickets() {
  dispatcher.dispatch({
    type: actionTypes.CLEAR_TICKETS,
    payload: "",
  });
}
