import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useAuth } from "../context/auth";
import ticketStore from "../stores/ticketStore";
import { getTickets } from "../actions/ticketAction";
import TicketItem from "./TicketItem";

export default function SupportPage() {
  const { authTokens } = useAuth();
  const [tickets, setTickets] = useState(ticketStore.getTickets());

  useEffect(() => {
    ticketStore.addChangeListener(onTicketChange);
    if (ticketStore.getTickets().length === 0) getTickets();
    return () => ticketStore.removeChangeListener(onTicketChange);
  }, []);

  function onTicketChange() {
    setTickets(ticketStore.getTickets());
  }

  if (authTokens.role !== "support") {
    return <Redirect to="/" />;
  }

  return (
    <div className="container">
      <h1 className="display-3">Support</h1>
      <hr />
      {tickets.map((ticket) => (
        <TicketItem key={ticket.ticket_id} ticket={ticket} />
      ))}
    </div>
  );
}
