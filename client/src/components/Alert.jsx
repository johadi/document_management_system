import React from 'react';

const Alert = (props) => {
  let card = '';
  let message = '';
  if (props.info.error) {
    card = 'card red';
    message = props.info.error;
  }
  if (props.info.success) {
    card = 'card green';
    message = props.info.success;
  }
  return (
    <div id="card-alert" className={card}>
      <div className="card-content white-text">
        <p>{message}</p>
      </div>
      <button type="button" className="close white-text"
          data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">×</span>
      </button>
    </div>
  );
};

const Alert2 = (props) => {
  // const color = props.issues.map(issue => <IssueRow key={issue.id} issue={issue} />);
  // const message = props.issues.map(issue => <IssueRow key={issue.id} issue={issue} />);
  return (
    <div id="card-alert" className="card ">
      <div className="card-content white-text">
        <p>SUCCESS : The page has been added.</p>
      </div>
      <button type="button" className="close white-text"
              data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">×</span>
      </button>
    </div>
  );
};

export {
  Alert,
  Alert2
};
