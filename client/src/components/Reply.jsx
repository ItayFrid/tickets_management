// import React from "react";

// export default function Reply(props) {
//   const { reply } = props;

//   return (
//     <p>
//       <span className="font-weight-bold">
//         {reply.type === "support" ? reply.type : reply.username}
//       </span>
//       :{" " + reply.body}
//     </p>
//   );
// }

import React, { Component } from "react";

export default class Reply extends Component {
  render() {
    const { reply } = this.props;
    return (
      <p>
        <span className="font-weight-bold">
          {reply.type === "support" ? reply.type : reply.username}
        </span>
        :{" " + reply.body}
      </p>
    );
  }
}
