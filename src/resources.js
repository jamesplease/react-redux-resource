import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getStatus, getResources } from 'redux-resource';

class Resources extends Component {
  render() {
    const {
      children,
      ...otherProps
    } = this.props;

    return children({
      ...otherProps
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
  const resourceMeta = resourceSlice.meta || {};
  const request = resourceRequests[props.requestKey] || {};
  const resourcesArray = getResources(resourceSlice, request.ids);

  const status = getStatus(request, 'status', props.treatNullAsPending);

  const resources = {};
  const meta = {};
  resourcesArray.map(resource => {
    meta[resource.id] = resourceMeta[resource.id];
    resources[resource.id] = resource;
  });

  // This prepares us for a future `lists` API.
  const lists = {
    [props.list]: getResources(resourceSlice, resourceSlice.lists[props.list])
  };

  return {
    request,
    status,
    resources,
    meta,
    lists
  };
}

export default connect(mapStateToProps)(Resources);
