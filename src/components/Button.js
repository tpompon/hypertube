import React from 'react';

const Button = ({ content, action }) => (
  <div onClick={action} className="button">
    {content}
  </div>
)

export default Button;
