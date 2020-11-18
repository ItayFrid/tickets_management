import React, { Component } from "react";
import Reply from "./Reply";
import axios from "axios";

export default class RepliesList extends Component {
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
    axios
      .post("http://tickets/checks/input", { text: e.target.value })
      .then((res) => {
        this.setState({
          reply: { ...this.state.reply, body: res.data.text },
        });
      });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (!this.formIsValid()) return;
    let reply = this.state.reply;
    reply.type = this.props.userDetails.role;
    reply.user_id = this.props.userDetails.user_id;
    reply.username = this.props.userDetails.username;
    axios.post("http://tickets/replies/add", reply).then((res) => {
      let replies = this.state.replies;
      reply.reply_id = res.data.reply_id;
      replies.push(reply);
      this.setState({
        replies,
        reply: {
          reply_id: null,
          ticket_id: this.props.ticket_id,
          user_id: this.props.userDetails.user_id,
          body: "",
          type: this.props.userDetails.role,
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
          ? "No Replies"
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
              className="form-control mr-1"
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
