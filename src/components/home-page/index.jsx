import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { currentUserSvc } from 'services'
import { ordersSvc } from 'services'
import FoodImage from 'components/food-image'
import FreeTheViandas from 'components/free-the-viandas'
import moment from 'moment'
import PersonIcon from 'rmdi/lib/Person'
import './index.css'

const Home = () => {
  const me = new Component()

  me.state = {
    currentUser: currentUserSvc.get(),
    todaysOrder: {},
    isLoading: true
  }

  if (me.state.currentUser.id) {
    ordersSvc.getCalendar({}).then((data) => {
      me.setState({
        todaysOrder: data.results[0],
        isLoading: false
      })
    })
  }

  me.render = () => (
    <div className="home-page container">
      <div className="sub-header">
        <div className="username">
          <PersonIcon />
          <span>{ me.state.currentUser.username }</span>
        </div>

        <h4 className="date">{ moment().format('ddd, MMM DD') }</h4>
      </div>

      {me.state.currentUser.id ? (
        <div>
          {
            !me.state.isLoading
            && (
              <div>
                {
                  me.state.todaysOrder.plato_principal
                  && (
                  <h3>{ me.state.todaysOrder.plato_principal.replace(/^[0-9]{1,2}- /, '') }</h3>
                  )
                }

                {
                  !me.state.isLoading
                  && me.state.currentUser.username !== 'Guest'
                  && !me.state.todaysOrder.plato_principal
                  && (
                    <h3>You didn't order any food today!</h3>
                )}

                {
                  me.state.todaysOrder.postre
                  && me.state.todaysOrder.plato_principal
                  && (
                    <h4 className="dessert">{ me.state.todaysOrder.postre }</h4>
                  )
                }

                {
                  !me.state.todaysOrder.postre
                  && me.state.todaysOrder.plato_principal
                  && (
                    <h4 className="dessert">No dessert today!</h4>
                  )
                }

                <FreeTheViandas user={me.state.currentUser} />
                <FoodImage dish={me.state.todaysOrder.plato_principal} />
                <FoodImage dish={me.state.todaysOrder.postre} />
              </div>
            )
          }

          {
            me.state.isLoading
            && (
              <div className="is-loading"></div>
            )
          }
        </div>
      ) : (
        <p>
          Please login {<Link to="login">here</Link>}.
        </p>
      )}
    </div>
  )

  return me
}

export default Home
