import React from 'react';
import AlertList from './AlertList.jsx';

/**
 * Alert component class declaration
 */
class Alert extends React.Component {
  /**
   * render - React's render method.
   * Renders component to display alert
   * @return {XML} JSX
   */
  render() {
    const message = (this.props.info.error) ?
      this.props.info.error : this.props.info.success;
    const classes = (this.props.info.error) ?
      'card red-main' : 'card green';

    return (
      <div id="card-alert" className={classes}>
        <div className="card-content white-text">
          {
            ((message.constructor !== Array) ?
              <p>{message}</p> :
              <AlertList messageList={message} />
            )
          }
        </div>
        {
          (this.props.onClose) ?
            <button type="button"
              className="close white-text"
              data-dismiss="alert"
              aria-label="Close"
            >
            <span aria-hidden="true"
              onClick={() => this.props.onClose()}
            >
              ×
            </span>
            </button>
            :
            ''
        }
      </div>
    );
  }
}
export default Alert;
