import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { actionTypes } from 'redux-resource';
import { Fetch } from 'react-request';
import Connected from './connected';

export class ResourceRequest extends Component {
  render() {
    const {
      request,
      children,
      resourceName,
      transformData,
      crudAction,
      resources,
      dispatch,
      list,
      mergeListIds,
      treatNullAsPending
    } = this.props;

    const capitalizedCrudAction = crudAction.toUpperCase();

    return React.cloneElement(request, {
      beforeFetch(info) {
        const { requestKey } = info;
        dispatch({
          resourceName,
          resources,
          type: actionTypes[`${capitalizedCrudAction}_RESOURCES_PENDING`],
          request: requestKey
        });

        request.props.beforeFetch(info);
      },
      afterFetch(info) {
        const { requestKey, data, response, error } = info;
        if (error || response.status >= 400) {
          // This needs to be a more accurate check :)
          if (error && error.isAborted) {
            dispatch({
              resourceName,
              resources,
              type: actionTypes[`${capitalizedCrudAction}_RESOURCES_NULL`],
              request: requestKey
            });
          } else {
            dispatch({
              resourceName,
              resources,
              statusCode: response.status,
              type: actionTypes[`${capitalizedCrudAction}_RESOURCES_FAILED`],
              request: requestKey,
              error
            });
          }
        } else {
          console.log('the data is', data);
          let dispatchResources;
          if (data && transformData) {
            dispatchResources = transformData(data);
          } else if (data) {
            dispatchResources = data;
          } else {
            dispatchResources = resources;
          }
          dispatch({
            resourceName,
            list,
            mergeListIds,
            statusCode: response.status,
            type: actionTypes[`${capitalizedCrudAction}_RESOURCES_SUCCEEDED`],
            request: requestKey,
            resources: dispatchResources
          });
        }

        request.props.afterFetch(info);
      },
      children(renderProps) {
        return (
          <Connected
            {...renderProps}
            treatNullAsPending={treatNullAsPending}
            resourceName={resourceName}
            children={children}
            list={list}
          />
        );
        return;
      }
    });
  }
}

ResourceRequest.propTypes = {
  resourceName: PropTypes.string.isRequired,
  crudAction: PropTypes.string.isRequired,
  lists: PropTypes.arrayOf(PropTypes.string).isRequired
};

ResourceRequest.defaultProps = {
  crudAction: 'read',
  lists: []
};

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(null, mapDispatchToProps)(ResourceRequest);
