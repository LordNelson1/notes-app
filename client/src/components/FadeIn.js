import React, { Component } from "react";
import styled, { css } from "styled-components";
import VisibilitySensor from "react-visibility-sensor";

const Fade = styled.div`
  opacity: 0;
  transform: translate3d(0, 5px, 0);
  transition: all 0.2s cubic-bezier(0.79, 0.03, 0.17, 1);

  ${({ delay }) =>
    delay &&
    css`
      transition-delay: ${delay}ms;
    `};

  ${({ isVisible }) =>
    isVisible &&
    css`
      opacity: 1;
      transform: translate3d(0, 0, 0);
    `}
`;

export class FadeIn extends Component {
  static defaultProps = {
    delay: 0
  };

  state = {
    isVisible: false
  };

  handleReveal = receivedState => {
    const { isVisible } = this.state;

    if (!isVisible) {
      setTimeout(() => this.setState({ isVisible: receivedState }));
    }
  };

  render() {
    const { children, ...otherProps } = this.props;
    const { isVisible } = this.state;

    return (
      <VisibilitySensor onChange={this.handleReveal}>
        <Fade isVisible={isVisible} {...otherProps}>
          {children}
        </Fade>
      </VisibilitySensor>
    );
  }
}

export default FadeIn;
