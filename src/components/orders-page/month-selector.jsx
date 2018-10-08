import React, { Component } from 'react';
import PrevIcon from 'rmdi/lib/NavigateBefore';
import NextIcon from 'rmdi/lib/NavigateNext';
import './month-selector.css';

const MonthSelector = ({onPrev, onNext}) => {
  const me = new Component();

  me.state = {
    currentMonth: (new Date()).getMonth() + 1
  }

  me.prev = () => {
    onPrev()
  }

  me.next = () => {
    onNext()
  }

  me.render = () => {
    return (
      <div className="month-selector">
        <div className="btn-icon calendar" onClick={() => me.prev()}>
          <PrevIcon />
        </div>
        <div className="btn-icon list" onClick={() => me.next()}>
          <NextIcon />
        </div>
      </div>
    );
  };

  return me;
}

export default MonthSelector;
