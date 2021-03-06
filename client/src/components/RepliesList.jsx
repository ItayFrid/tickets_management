import React, { Component } from "react";
import Reply from "./Reply";
import AuthContext from "../context/auth";
import axios from "axios";

export default class RepliesList extends Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      replies: [],
      reply: {
        reply_id: null,
        ticket_id: this.props.ticket_id,
        user_id: this.props.user_id,
        username: "",
        body: "",
        type: "",
      },
      errors: {},
    };
  }

  componentDidMount() {
    axios
      .get(`replies/${this.props.ticket_id}`)
      .then((res) => this.setState({ replies: res.data }))
      .then()
      .catch(() => {});
  }

  formIsValid() {
    const _errors = {};
    if (!this.state.reply.body) _errors.body = "Reply is required";
    this.setState({ errors: _errors });
    // Form is valid if the errors object has no properties
    return Object.keys(_errors).length === 0;
  }

  handleChange = (e) => {
    let reply = this.state.reply;
    reply.body = e.target.value;
    this.setState({ reply });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (!this.formIsValid()) return;
    let reply = this.state.reply;
    reply.type = this.context.authTokens.role;
    reply.user_id = this.context.authTokens.user_id;
    reply.username = this.context.authTokens.username;
    axios.post("http://tickets/replies/add", reply).then((res) => {
      let replies = this.state.replies;
      reply.reply_id = res.data.reply_id;
      replies.push(reply);
      this.setState({
        replies,
        reply: {
          reply_id: null,
          ticket_id: this.props.ticket_id,
          user_id: this.context.authTokens.user_id,
          body: "",
          type: this.context.authTokens.role,
        },
      });
    });
  };

  render() {
    const { replies, reply, errors } = this.state;
    const { ticket_status, getStyle } = this.props;

    return (
      <div>
        {replies.length === 0
          ? "No Comments"
          : replies.map((reply) => (
              <Reply key={reply.reply_id} reply={reply} />
            ))}
        {ticket_status === "open" ? (
          <form className="form-inline" onSubmit={this.handleSubmit}>
            <input
              type="text"
              name="body"
              placeholder="Enter reply"
              value={reply.body}
              className="form-control"
              onChange={this.handleChange}
            />
            <button
              type="submit"
              className={"mr-1 btn btn-outline-" + getStyle()}
            >
              Post Reply
            </button>
            {errors.body && (
              <div className="text-danger">{" " + errors.body}</div>
            )}
          </form>
        ) : (
          ""
        )}
      </div>
    );
  }
}
