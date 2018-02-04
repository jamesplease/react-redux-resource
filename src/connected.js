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
      treatNullAsPending,
      setFetchToIdle,
      lists
    } = this.props;

    const status = getStatus(request, 'status', treatNullAsPending);

    return children({
      status,
      request,
      doFetch,
      setFetchToIdle,
      resourceName,
      url,
      lists,
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
  const resourcesArray = getResources(resourceSlice, request.ids);

  const resources = {};
  resourcesArray.map(resource => {
    resources[resource.id] = resource;
  });

  const lists = {
    [props.list]: getResources(resourceSlice, resourceSlice.lists[props.list])
  };

  return {
    request,
    resources,
    lists
  };
}

export default connect(mapStateToProps)(ConnectedResource);
