import React from 'react';
import translations from '../translations'
import { ReactComponent as CheckMark } from '../svg/checkmark.svg'

function Logout({language}) {
  return (
    <div className="text-center">
      <CheckMark width="50" height="50" fill="#5CB85C" />
      <p>{translations[language].logout.title}</p>
    </div>
  );
}

export default Logout;
