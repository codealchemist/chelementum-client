import React, { Component } from 'react'
import styled from 'styled-components'
import { freeTheViandasSvc } from 'services'

const Container = styled.div`
  margin: 20px;

  .badge {
    vertical-align: text-top;
    margin-right: 5px;
  }
`

function getRandomColor () {
  return '#' + Math.floor(Math.random() * 16777215).toString(16)
}

const FreeTheViandasPage = () => {
  const me = new Component()
  me.state = {
    isLoading: true,
    list: []
  }

  freeTheViandasSvc.list().then(response => {
    console.log(response.data)
    me.setState({ isLoading: false, list: response.data })
  })

  me.render = () => {
    return (
      <Container>
        <h2>
          Meet the heroes who's <em>viandas</em> are free! 🙌{' '}
        </h2>

        {me.state.isLoading && <div className="is-loading" />}

        {!me.state.isLoading && (
          <ul className="list-group">
            {me.state.list.map(hero => (
              <li className="list-group-item" key={hero.username}>
                <span className="badge badge-secondary" style={{ backgroundColor: getRandomColor() }}>
                  {`${hero.name[0]}${hero.lastname[0]}`}
                </span>
                <span>{`${hero.name} ${hero.lastname}`}</span>
              </li>
            ))}
          </ul>
        )}
      </Container>
    )
  }

  return me
}

export default FreeTheViandasPage
