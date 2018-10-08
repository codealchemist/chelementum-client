import React, { Component } from 'react';
import './index.css';

const defaultFoodImg = '';

const FoodImage = () => {
  const me = new Component();

  me.render = () => {
    return me.props.dish
    ? (
      <div className="food-container">
        <div
          className="food-image"
          style={{backgroundImage: `url(${defaultFoodImg})`}}
        ></div>
      </div>
    )
    : false
  };

  return me;
};

export default FoodImage;
