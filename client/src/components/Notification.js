import React, { Component } from "react";
import styled, { css } from "styled-components";
import * as style from "./style";

const Container = styled.div`
  position: fixed;
  top: 0;
  right: ${style.COLUMN / 2}px;
  transform: translateY(0);
  background: #202020;

  width: 200px;
  height: 50px;

  transform: translateY(-${style.COLUMN * 2}px);

  transition: 0.2s ease-in-out;

  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 22px;
  font-weight: 800;
  box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.2);
  border-radius: 0.1rem;
  ${({ show }) =>
    show &&
    css`
      transform: translateY(${style.COLUMN / 2}px);
    `}
`;

export default class Notification extends Component {
  render() {
    const { show } = this.props;
    return <Container show={show}>Success</Container>;
  }
}
