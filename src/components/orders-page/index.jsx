import React, { Component } from 'react'
import OrderDay from './order-day'
import ViewMode from './view-mode'
import MonthSelector from './month-selector'
import { ordersSvc } from 'services'
import './orders.css'

import './styles.scss'

const Orders = () => {
  const me = new Component()
  const orders = ordersSvc.buildCalendar()

  me.state = {
    days: [],
    viewMode: 'calendar',
    orders: orders.getState()
  }

  const setViewMode = (viewMode) => {
    me.setState({viewMode})
  }

  const load = () => {
    orders.load()
      .catch(message => {
        alert(message)
      })
      .then(() => {
        me.setState({
          orders: orders.getState()
        })
      })

    me.setState({
      orders: orders.getState()
    })
  }

  const attrs = () => {
    const classes = ['orders', me.state.viewMode, 'd-flex', 'flex-wrap']
    if (me.state.orders.isLoading) {
      classes.push('is-loading')
    }
    return {
      className: classes.join(' ')
    }
  }

  me.componentDidMount = () => {
    load()
  }

  me.refreshOrders = (results) => {
    const ordersObj = orders.getState()
    ordersObj.results = results
    ordersObj.isLoading = false
    me.setState({orders: ordersObj})
  }

  me.setLoading = (isLoading) => {
    const ordersObj = orders.getState()
    ordersObj.isLoading = isLoading
    me.setState({orders: ordersObj})
  }

  me.loadNextMonth = () => {
    me.setLoading(true)
    orders
      .nextMonth()
      .then((orders) => me.refreshOrders(orders))
  }

  me.loadPrevMonth = () => {
    orders
      .prevMonth()
      .then((orders) => me.refreshOrders(orders))
  }

  me.render = () => {
    return (
      <div className="container-fluid">
        <ViewMode onUpdate={ setViewMode } />
        <MonthSelector onNext={ () => me.loadNextMonth() } onPrev={ () => me.loadPrevMonth() } />

        <div { ...attrs() }>
          {me.state.orders.results.map((order, index) => (
            <OrderDay order={ order } key={ order.date }/>
          ))}
        </div>
      </div>
    )
  }
  return me
}

export default Orders
