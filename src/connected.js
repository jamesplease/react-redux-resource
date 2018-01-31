import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getStatus } from 'redux-resource';

class connectedResource extends Component {
  render() {
    const { data, children, request } = this.props;

    const status = getStatus(request);

    return children({
      status,
      request,
      resources: data
    });
  }
}

// Although we have access to the request in the render callback,
// this subscribes us to updates to the store. So if another
// component makes a new HTTP call with this same request key,
// then this component will be updated as well.
function mapStateToProps(state, props) {
  const request = state[props.resourceRequestSlice].resources[props.requestId];

  return {
    request: state[props.resourceRequestSlice].resources[props.requestId]
  };
}

export default connect(mapStateToProps)(Resource);
