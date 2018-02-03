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
          type: actionTypes[`${capitalizedCrudAction}_RESOURCES_PENDING`],
          request: requestKey
        });

        request.props.beforeFetch(info);
      },
      afterFetch(info) {
        const { requestKey, data, error } = info;
        if (error) {
          if (error.isAborted) {
            dispatch({
              resourceName,
              type: actionTypes[`${capitalizedCrudAction}_RESOURCES_IDLE`],
              request: requestKey
            });
          } else {
            dispatch({
              resourceName,
              type: actionTypes[`${capitalizedCrudAction}_RESOURCES_FAIED`],
              request: requestKey,
              error
            });
          }
        } else {
          const resources = data && transformData ? transformData(data) : data;
          dispatch({
            resourceName,
            list,
            mergeListIds,
            type: actionTypes[`${capitalizedCrudAction}_RESOURCES_SUCCEEDED`],
            request: requestKey,
            resources
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
