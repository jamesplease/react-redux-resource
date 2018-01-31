import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getStatus, getResources, getList } from 'redux-resource';

class connectedResource extends Component {
  render() {
    const {
      children,
      request,
      resources,
      hydratedLists,
      doFetch,
      url
    } = this.props;

    const status = getStatus(request);

    return children({
      status,
      request,
      doFetch,
      url,
      resources,
      lists: hydratedLists
    });
  }
}

// Although we have access to the request in the render callback,
// this subscribes us to updates to the store. So if another
// component makes a new HTTP call with this same request key,
// then this component will be updated as well.
function mapStateToProps(state, props) {
  const request =
    state[props.resourceRequestSlice].resources[props.requestId] || {};
  const resourcesIds = request.resources || {};

  let resources = {};
  for (var key in resourcesIds) {
    resources[key] = getResources(state[key], resourcesIds[key]);
  }

  let hydratedLists = {};
  for (var key in props.lists) {
    hydratedLists[key] = getList(state[key], props.lists[key]);
  }

  return {
    request: state[props.resourceRequestSlice].resources[props.requestId],
    resources,
    hydratedLists
  };
}

export default connect(mapStateToProps)(Resource);
