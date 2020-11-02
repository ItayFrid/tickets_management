import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TicketItem from "./TicketItem";
import { useAuth } from "../context/auth";
import { getUserTickets } from "../actions/ticketAction";
import ticketStore from "../stores/ticketStore";

function TicketsList() {
  const { authTokens } = useAuth();
  const [tickets, setTickets] = useState(ticketStore.getTickets());

  useEffect(() => {
    ticketStore.addChangeListener(onTicketChange);
    if (ticketStore.getTickets().length === 0)
      getUserTickets(authTokens.user_id);
    return () => ticketStore.removeChangeListener(onTicketChange);
  }, [authTokens.user_id]);

  function onTicketChange() {
    setTickets(ticketStore.getTickets());
  }
  return (
    <div className="container">
      <h3 className="display-3">
        My Tickets<small className="text-muted"> /{authTokens.username}</small>
      </h3>
      <hr />
      <div className="text-center my-2">
        <Link to="/createticket" className="btn btn-outline-info">
          Open Ticket
        </Link>
      </div>
      {tickets.map((ticket) => (
        <TicketItem key={ticket.ticket_id} ticket={ticket} />
      ))}
    </div>
  );
}

export default TicketsList;
