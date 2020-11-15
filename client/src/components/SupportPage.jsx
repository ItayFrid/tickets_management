import React, { Component } from "react";
import AuthContext from "../context/auth";
import ticketStore from "../stores/ticketStore";
import { getTickets } from "../actions/ticketAction";
import TicketItem from "./TicketItem";

export default class SupportPage extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      tickets: ticketStore.getTickets(),
    };
    this.onTicketChange = this.onTicketChange.bind(this);
  }

  componentDidMount() {
    ticketStore.addChangeListener(this.onTicketChange);
    if (ticketStore.getTickets().length === 0) getTickets();
    return () => ticketStore.removeChangeListener(this.onTicketChange);
  }

  onTicketChange() {
    this.setState({ tickets: ticketStore.getTickets() });
  }

  render() {
    const { tickets } = this.state;
    const { userDetails } = this.props;
    return (
      <div className="container">
        <h1 className="display-3">Support</h1>
        <hr />
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
