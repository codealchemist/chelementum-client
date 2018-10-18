import React, { Component } from 'react'
import styled from 'styled-components'
import TimerIcon from 'rmdi/lib/Timer'
import { freeTheViandasSvc } from 'services'
import './index.css'
import PowerFist from './powerfist.png'

const Container = styled.div`
  margin-top: 25px;
  button {
    cursor: pointer;
  }

  .card button {
    margin: 20px;
  }
`

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
        <button className="btn btn-primary" onClick={me.free}>
          Yeah! Free my vianda!
        </button>
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
  freeTheViandasSvc.get()
    .then((res) => {
      me.setState({
        isLoading: false,
        isFreeVianda: !!res.data
      })
    })

  me.free = () => {
    me.setState({ isSaving: true })
    freeTheViandasSvc.set(user)
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

  me.unfree = () => {
    me.setState({ isSaving: true })
    freeTheViandasSvc.remove(user)
      .then((res) => {
        if (!res.data.ok) {
          alert('Oops! Something went wrong.')
          me.setState({ isSaving: false })
          return
        }

        me.setState({
          isSaving: false,
          isFreeVianda: false
        })
      })
  }

  const makeItFreeView = (
    <Container>
      <div className="card">
        <div className="card-body">
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

          <p className="spacer"></p>
          <p>
            🙂 If you free it now you can change your mind later, no worries.
          </p>
        </div>

        <div>
          { me.getSaveButton() }
        </div>
      </div>
    </Container>
  )

  const alreadyFreeView = (
    <Container>
      <div>
        Thanks! You're <em>vianda</em> is already free! 🤘
      </div>

      {
        me.state.saving && (
          <div className="icon-container gray">
            <TimerIcon />
            <i>Saving...</i>
          </div>
        )
      }

      {
        !me.state.saving && (
          <button className="btn btn-sm btn-danger" onClick={me.unfree}>
            Unfree
          </button>
        )
      }
    </Container>
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
