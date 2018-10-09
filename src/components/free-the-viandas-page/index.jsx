import React from 'react'
import { freeTheViandasSvc } from 'services'
import styled from 'styled-components'

const FreeTheViandasPage = () => {
  const isLoading = true
  freeTheViandasSvc.list()
  .then((err, data) => {
    console.log(err, data)
  })

  return (
    <div>
      
    </div>
  )
}

export default FreeTheViandasPage
