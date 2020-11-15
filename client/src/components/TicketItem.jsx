import React, { Component } from "react";
import { updateTicket, delTicket } from "../actions/ticketAction";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import RepliesList from "./RepliesList";

export default class TicketItem extends Component {
  constructor(props) {
    super(props);

    this.getStyle = this.getStyle.bind(this);
  }

  delReplies(ticket_id) {
    axios.delete("http://tickets/replies/delete/".concat(ticket_id));
  }

  getStyle() {
    switch (this.props.ticket.status) {
      case "open":
        return "danger";
      case "closed":
        return "success";
      default:
    }
  }
  render() {
    const { ticket, userDetails } = this.props;
    return (
      <div className={"card my-2 alert-" + this.getStyle()}>
        <div className="card-header">
          <div className="row">
            <div className="col-sm-6">
              {ticket.name} -{" "}
              <span className="font-weight-bold">{ticket.status}</span>
            </div>
            <div className="col-sm-6 text-right">
              {ticket.status !== "archived" ? (
                <button
                  className="btn btn-sm btn-outline-dark mr-1"
                  onClick={() => {
                    ticket.status = "archived";
                    updateTicket(ticket);
                  }}
                >
                  Archive
                </button>
              ) : (
                ""
              )}

              {ticket.status !== "open" ? (
                <button
                  className="btn btn-sm btn-outline-dark mr-1"
                  onClick={() => {
                    ticket.status = "open";
                    updateTicket(ticket);
                  }}
                >
                  Open
                </button>
              ) : (
                ""
              )}

              {ticket.status !== "closed" ? (
                <button
                  className="btn btn-sm btn-outline-dark mr-1"
                  onClick={() => {
                    ticket.status = "closed";
                    updateTicket(ticket);
                  }}
                >
                  Close
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <div className="card-body">
          <h5 className="card-title">{ticket.title}</h5>
          <p className="card-text">{ticket.body}</p>
          <hr />
          <RepliesList
            ticket_id={ticket.ticket_id}
            user_id={ticket.user_id}
            ticket_status={ticket.status}
            getStyle={this.getStyle}
            userDetails={userDetails}
          />
        </div>
        <div className="card-footer text-muted">
          <div className="row">
            <div className="col-sm-6"> {ticket.created_at}</div>
            <div className="col-sm-6 text-right">
              <button
                className={"btn btn-sm btn-link text-" + this.getStyle()}
                onClick={() => {
                  delTicket(ticket.ticket_id);
                  this.delReplies(ticket.ticket_id);
                }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
TicketItem.propTypes = {
  ticket: PropTypes.object.isRequired,
};
