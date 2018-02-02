import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getStatus, getResources, resourceReducer } from 'redux-resource';

class ConnectedResource extends Component {
  render() {
    const {
      children,
      request,
      resources,
      doFetch,
      url,
      resourceName,
      treatNullAsPending
    } = this.props;

    const status = getStatus(request, 'status', treatNullAsPending);

    return children({
      status,
      request,
      doFetch,
      resourceName,
      url,
      resources
    });
  }
}

// Although we have access to the request in the render callback,
// this subscribes us to updates to the store. So if another
// component makes a new HTTP call with this same request key,
// then this component will be updated as well.
function mapStateToProps(state, props) {
  const resourceSlice = state[props.resourceName] || {};
  const resourceRequests = resourceSlice.requests || {};
  const request = resourceRequests[props.requestKey] || {};
  const resources = getResources(resourceSlice, request.ids);

  return {
    request,
    resources
  };
}

export default connect(mapStateToProps)(ConnectedResource);
