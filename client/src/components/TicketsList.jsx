import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import TicketItem from "./TicketItem";
import { getUserTickets } from "../actions/ticketAction";
import ticketStore from "../stores/ticketStore";

export default class TicketsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tickets: ticketStore.getTickets(),
    };
    this.onTicketChange = this.onTicketChange.bind(this);
  }

  componentDidMount() {
    ticketStore.addChangeListener(this.onTicketChange);
    if (ticketStore.getTickets().length === 0)
      getUserTickets(this.props.userDetails.user_id);
    return () => ticketStore.removeChangeListener(this.onTicketChange);
  }

  onTicketChange() {
    this.setState({ tickets: ticketStore.getTickets() });
  }

  render() {
    const { tickets } = this.state;
    const { userDetails } = this.props;
    if (userDetails.role !== "user") return <Redirect to="/" />;
    else
      return (
        <div className="container">
          <h3 className="display-3">
            My Tickets
            <small className="text-muted"> /{userDetails.username}</small>
          </h3>
          <hr />
          <div className="text-center my-2">
            <Link to="/createticket" className="btn btn-outline-info">
              Open Ticket
            </Link>
          </div>
          {tickets.map((ticket) => (
            <TicketItem
              key={ticket.ticket_id}
              ticket={ticket}
              userDetails={userDetails}
            />
          ))}
        </div>
      );
  }
}
