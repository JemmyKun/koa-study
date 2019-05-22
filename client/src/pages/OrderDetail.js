import React from "react";

class OrderDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }
  render() {
    let { id } = this.props.match.params;
    return (
      <div className="detail-page">
        <div>hello detail page: + {id}</div>
      </div>
    );
  }
}

export default OrderDetail;
