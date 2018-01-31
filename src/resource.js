import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { actionTypes } from 'redux-resource';
import { Fetch } from 'react-request';
import Connected from './connected';

export class Resource extends Component {
  render() {
    const {
      request,
      children,
      resourceRequestSlice,
      transformData,
      crudAction,
      dispatch,
      lists
    } = this.props;

    const capitalizedCrudAction = crudAction.toUpperCase();

    return React.cloneElement(request, {
      beforeFetch(info) {
        const { fetchDedupeOptions } = info;
        dispatch({
          type: actionTypes[`${capitalizedCrudAction}_RESOURCES_PENDING`],
          requestKey: fetchDedupeOptions.requestKey,
          requestName: request.props.requestName
        });

        request.props.beforeFetch(info);
      },
      afterFetch(info) {
        const { fetchDedupeOptions, data } = info;
        if (err) {
          if (err.isAborted) {
            dispatch({
              type: actionTypes[`${capitalizedCrudAction}_RESOURCES_IDLE`],
              requestKey: fetchDedupeOptions.requestKey,
              requestName: request.props.requestName
            });
          } else {
            dispatch({
              type: actionTypes[`${capitalizedCrudAction}_RESOURCES_FAIED`],
              requestKey: fetchDedupeOptions.requestKey,
              requestName: request.props.requestName,
              err
            });
          }
        } else {
          dispatch({
            type: actionTypes[`${capitalizedCrudAction}_RESOURCES_SUCCEEDED`],
            requestKey: fetchDedupeOptions.requestKey,
            requestName: request.props.requestName,
            resources: data
          });
        }

        request.props.afterFetch(info);
      },
      render(renderProps) {
        return (
          <Connected
            {...renderProps}
            children={children}
            resourceRequestSlice={resourceRequestSlice}
            lists={lists}
          />
        );
        return;
      }
    });
  }
}

Resource.propTypes = {
  resourceRequestSlice: PropTypes.string.isRequired,
  crudAction: PropTypes.string.isRequired
};

Resource.defaultProps = {
  resourceRequestSlice: 'resourceRequests',
  crudAction: 'read'
};

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(null, mapDispatchToProps)(Resource);
