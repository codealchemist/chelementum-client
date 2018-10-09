import React, { Component } from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import styled from 'styled-components'
import { freeTheViandasSvc } from 'services'

const Container = styled.div`
  margin: 20px;
`

function getRandomColor () {
  return '#' + Math.floor(Math.random()*16777215).toString(16)
}

const FreeTheViandasPage = () => {
  const me = new Component()
  me.state = {
    isLoading: true,
    list: []
  }

  freeTheViandasSvc.list()
    .then((response) => {
      console.log(response.data)
      me.setState({ isLoading: false, list: response.data })
    })

  me.render = () => {
    return (
      <Container>
        <h2>Meet the heroes who's <em>viandas</em> are free! 🙌 </h2>

        {
          me.state.isLoading && (
            <div className="is-loading"></div>
          )
        }

        {
          !me.state.isLoading && (
            <List>
              { me.state.list.map(hero => (
                <ListItem key={hero.username} dense button>
                  <Avatar alt={`${hero.name} ${hero.lastname}`} style={{backgroundColor: getRandomColor()}}>
                    {`${hero.name[0]}${hero.lastname[0]}`}
                  </Avatar>
                  <ListItemText primary={`${hero.name} ${hero.lastname}`} />
                </ListItem>
              ))}
            </List>
          )
        }
      </Container>
    )
  }

  return me
}

export default FreeTheViandasPage
