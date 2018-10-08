import React, { Component } from 'react'
import { isEqual } from 'lodash'
import moment from 'moment'

import './styles.scss'

import { ordersSvc } from 'services'
import { TODAY } from 'services/constants'

const OrderDay = ({ order }) => {
  const me = new Component()
  let orderInitData = {}
  const orderModel = ordersSvc.buildEntity(undefined, order)
  const cancellations = []
  let cancelPromise = () => {}

  me.state = {
    order: orderModel.getState(),
    options: {
      isLoading: false,
      results: []
    }
  }

  const loadMenu = () => {
    me.setState({
      options: {
        isLoading: true,
        results: me.state.options.results
      }
    })

    const promise = ordersSvc.getMenu({
      date: order.date,
      menuId: order.menu_id
    })

    cancellations.push(promise.cancel)

    promise.then(({ foods }) => {
      orderModel.setData({
        plato_principal_id: (foods.plato_principal_id.find(food => food.food_name === order.plato_principal) || {}).food_id || '',
        postre_id: (foods.postre_id.find(food => food.food_name === order.postre) || {}).food_id || '',
      })

      orderInitData = { ...orderModel.getState().data }

      me.setState({
        order: orderModel.getState(),
        options: {
          isLoading: false,
          results: foods
        }
      })
    })
  }

  const saveOrder = () => {
    orderModel.save()
      .then(() => {
        orderInitData = { ...orderModel.getState().data }
      })
      .catch((error) => {
        alert(error)
      }).then(() => {
        me.setState({ order: orderModel.getState() })
      })

    me.setState({ order: orderModel.getState() })
  }

  const resetOrder = () => {
    orderModel.setData(orderInitData)
    me.setState({
      order: orderModel.getState()
    })
  }

  const changeField = (event, target = event.target) => {
    orderModel.setData({
      [target.name]: target.value
    })

    me.setState({
      order: orderModel.getState()
    })
  }

  const getAttrs = () => {
    const classes = ['day', order.status, 'p-3', 'rounded', moment(order.date).format('ddd').toLowerCase()]

    if (order.date.getTime() === TODAY().getTime()) {
      classes.push('current')
    }
    if (me.state.options.isLoading || me.state.order.isLoading) {
      classes.push('is-loading')
    }
    return {
      className: classes.join(' ')
    }
  }

  const isEditable = () => ['queued', 'standby'].includes(order.status)

  const getOptions = (category) => {
    return me.state.options.results[category] || []
  }

  const allowSave = () => {
    return !me.state.order.isLoading && !isEqual(orderInitData, me.state.order.data)
  }

  me.componentDidMount = () => {
    if (order.menu_id && isEditable()) {
      loadMenu()
    }
  }

  me.componentWillUnmount = () => {
    cancellations.forEach(cancel => {
      cancel()
    })
  }

  me.render = () => {
    if (!order.enabled) {
      return (
        <div { ...getAttrs() }>
          <h4>{ moment(order.date).format('MMM DD') }</h4>
        </div>
      )
    }

    return (
      <div { ...getAttrs() }>
        <h4>{ moment(order.date).format('MMM DD') }</h4>
        <form
          onSubmit={ (e) => {
            e.preventDefault()
            saveOrder()
          }}
          onReset={ (e) => {
            e.preventDefault()
            resetOrder()
          }}
        >
          {isEditable() || order.plato_principal ? (
          <div className="form-group">
            <label><strong>Main Dish:</strong></label>
            {isEditable() ? (
              <select name="plato_principal_id" value={ me.state.order.data.plato_principal_id } className="form-control" onChange={ changeField }>
                <option value="">None</option>
                {getOptions('plato_principal_id').map((option, key) => (
                  <option
                    key={ key }
                    value={ option.food_id }
                  >{ option.food_name }</option>
                ))}
              </select>
            ) : (
              <p>{ order.plato_principal }</p>
            )}
          </div>
          ) : ''}

          {isEditable() || order.postre ? (
          <div className="form-group">
            <label><strong>Dessert:</strong></label>
            {isEditable() ? (
            <select name="postre_id" value={ me.state.order.data.postre_id } className="form-control" onChange={ changeField }>
              <option value="">None</option>
              {getOptions('postre_id').map((option, key) => (
                <option
                  key={ key }
                  value={ option.food_id }
                >{ option.food_name }</option>
              ))}
            </select>
            ) : (
            <p>{ order.postre }</p>
            )}
          </div>
          ) : ''}

          { isEditable() ?
            <div className="form-group">
              <button { ...{ disabled: !allowSave() } } type="submit" className="btn btn-primary btn-sm">Save</button>
              &nbsp;<button { ...{ disabled: !allowSave() } } type="reset" className="btn btn-secondary btn-sm">Reset</button>
            </div>
          : '' }

        </form>
      </div>
    )
  }

  return me
}

export default OrderDay
