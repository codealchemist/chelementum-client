import React, { Component } from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import TimerIcon from 'rmdi/lib/Timer'
import freeTheViandasService from 'services/free-the-viandas'
import './index.css'
import PowerFist from './powerfist.png'

const FreeTheViandas = ({ user }) => {
  const me = new Component()
  me.state = {
    isFreeVianda: false,
    isLoading: true,
    isSaving: false
  }

  me.getSaveButton = () => {
    if (!me.state.isSaving) {
      return (
        <Button size="small" color="primary" onClick={me.free}>
          Yeah! Free my vianda!
        </Button>
      )
    }

    // Saving...
    return (
      <div className="icon-container gray">
        <TimerIcon />
        <i>Saving...</i>
      </div>
    )
  }

  // Load user data.
  freeTheViandasService.get()
  .then((res) => {
    me.setState({
      isLoading: false,
      isFreeVianda: !!res.data
    })
  })

  me.free = () => {
    me.setState({ isSaving: true })
    freeTheViandasService.set(user)
    .then((res) => {
      if (!res.data.ok) {
        alert('Oops! Something went wrong.')
        me.setState({ isSaving: false })
        return
      }

      me.setState({
        isSaving: false,
        isFreeVianda: true
      })
    })
  }

  const makeItFreeView = (
    <div className="ftv-container">
      <Card className="card">
        <CardContent>
          <div className="img-container">
            <img src={PowerFist} />
          </div>
          <h2>Free The Viandas!</h2>
          <p>We just noted your <em>vianda</em> is not currently free!</p>

          <p className="spacer"></p>
          <p>💪 But you can fix this right now!</p>
          <p>
            <em>To free</em> your <em>vianda</em> means that &nbsp;
            <b>
              after 6 pm on the date printed on it,
              it will be free for anyone to take it!
            </b>
          </p>
          <p>
            This will contribute to a cleaner fridge and will help a lot your beloved and awesome
            colleagues without the need to bother you asking if they can take it.
          </p>

          <p className="spacer"></p>
          <p>
            🙌 If you choose to free your <em>vianda</em> you're name will appear on the <b>Free The Viandas!</b> page
            and you'll walk the office with pride!
          </p>
        </CardContent>

        <CardActions>
          { me.getSaveButton() }
        </CardActions>
      </Card>
    </div>
  )

  const alreadyFreeView = (
    <div className="ftv-container">
      Thanks! You're <em>vianda</em> is already free! 🤘
    </div>
  )

  const loadingView = (
    <div className="ftv-container">
      I wonder... Is your <em>vianda</em> free?
    </div>
  )

  me.render = () => {
    if (me.state.isLoading) return loadingView
    if (me.state.isFreeVianda) return alreadyFreeView
    return makeItFreeView
  }

  return me
}

export default FreeTheViandas
