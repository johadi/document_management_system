import React from 'react';

const AlertList = (props) => {
  const list = props.messageList.map((message, i) =>
    <p key={i}>{message}</p>
  );
  return (<div>{list}</div>);
};

export default AlertList;
