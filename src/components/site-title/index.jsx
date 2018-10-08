import React from 'react';

const SiteTitle = ({siteName, children}) => {
  document.title = `${ children } :: ${ siteName }`;
  return '';
}

export default SiteTitle;
