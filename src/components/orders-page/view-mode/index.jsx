import React, { Component } from 'react';
import CalendarIcon from 'rmdi/lib/Today'
import ListIcon from 'rmdi/lib/List';
import './styles.scss';

const ViewMode = ({onUpdate}) => {
  const me = new Component();

  me.state = {
    viewMode: 'calendar'
  }

  me.calendar = () => {
    me.setState({viewMode: 'calendar'})
    onUpdate('calendar')
  }

  me.list = () => {
    me.setState({viewMode: 'list'})
    onUpdate('list')
  }

  me.render = () => {
    return (
      <div className="view-mode">
        <div className="btn-icon calendar" onClick={() => me.calendar()}>
          <CalendarIcon />
        </div>
        <div className="btn-icon list" onClick={() => me.list()}>
          <ListIcon />
        </div>
      </div>
    );
  };

  return me;
}

export default ViewMode;
