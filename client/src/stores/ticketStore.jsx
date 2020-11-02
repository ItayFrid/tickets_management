import { EventEmitter } from "events";
import dispatcher from "../Dispatcher";
import actionTypes from "../actions/actionTypes";

const CHANGE_EVENT = "change";
let _tickets = [];

class ticketStore extends EventEmitter {
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
  emitChange() {
    this.emit(CHANGE_EVENT);
  }
  getTickets() {
    return _tickets;
  }

  addTicket(ticket) {
    _tickets.push(ticket);
  }
  delTicket(ticket_id) {
    _tickets = _tickets.filter((ticket) => ticket.ticket_id !== ticket_id);
  }
  updateTicket(newTicket) {
    _tickets = _tickets.map((ticket) =>
      ticket.ticket_id === newTicket.ticket_id ? newTicket : ticket
    );
  }
  clearTicketsOnLogout() {
    _tickets = [];
  }
}

const store = new ticketStore();

dispatcher.register((action) => {
  switch (action.type) {
    case actionTypes.ADD_TICKET:
      store.addTicket(action.payload);
      store.emitChange();
      break;
    case actionTypes.DEL_TICKET:
      store.delTicket(action.payload);
      store.emitChange();
      break;
    case actionTypes.UPDATE_TICKET:
      store.updateTicket(action.payload);
      store.emitChange();
      break;
    case actionTypes.GET_TICKETS:
      _tickets = action.payload;
      store.emitChange();
      break;
    case actionTypes.GET_USER_TICKETS:
      _tickets = action.payload;
      store.emitChange();
      break;
    case actionTypes.CLEAR_TICKETS:
      store.clearTicketsOnLogout();
      store.emitChange();
      break;

    default:
  }
});

export default store;
