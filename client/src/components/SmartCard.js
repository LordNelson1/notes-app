import React, { Component } from "react";
import styled from "styled-components";
import axios from "axios";
import moment from "moment";
import FadeIn from "./FadeIn";
import * as style from "./style";
import trash from "../assets/trash.svg";

const Card = styled(FadeIn)`
  width: 100%;
  min-height: 250px;
  padding: 32px 64px;
  box-sizing: border-box;
  margin: 0.5rem;
  padding-top: 48px;

  border-radius: 0.1rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  img {
    width: 20px;
  }
`;

const CheckMark = styled.div`
  position: absolute;
  left: -32px;
  opacity: ${({ show }) => (show ? 1 : 0)};
  transition: 0.2s ease-in-out;
  &:after {
    /*Add another block-level blank space*/
    content: "";
    display: block;

    /*Make it a small rectangle so the border will create an L-shape*/
    width: 5px;
    height: 10px;

    /*Add a white border on the bottom and left, creating that 'L' */
    border: solid #000;
    border-width: 0 2px 2px 0;

    /*Rotate the L 45 degrees to turn it into a checkmark*/
    transform: rotate(45deg);
  }
`;

const CharLeftContainer = styled.div``;

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 32px;
`;

export const BodyContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 32px;
`;

export const CardTitle = styled.h1`
  font-weight: 800;
  font-size: 22px;
  margin: 0;
  width: 100%;
  cursor: pointer;
  color: #404040;
`;

export const TitleInput = styled.input`
  font-weight: 800;
  font-size: 22px;
  font-family: "Open Sans", sans-serif;
  padding: 0;
  border: 0;
  outline: none;
  width: 100%;
  color: #404040;
  background: none;
  position: relative;
  margin: 0;
  &::placeholder {
    font-weight: 800;
    font-size: 22px;
  }
`;

export const BodyInput = styled.textarea`
  font-weight: 300;
  font-size: 12px;
  font-family: "Open Sans", sans-serif;
  border: 0;
  outline: none;
  width: 100%;
  color: #202020;
  background: none;
  position: relative;
  resize: none;
  overflow: auto;
  height: ${({ height }) => height}px;
  padding: 0;
  margin: 0;
  &::placeholder {
    font-weight: 800;
    font-size: 22px;
  }
  /* width */
  ::-webkit-scrollbar {
    width: 10px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #888;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #303030;
  }
`;

const CardDate = styled.h4`
  font-weight: 300;
  font-size: 9px;
  color: #404040;
`;

const CardBody = styled.p`
  font-weight: 300;
  color: #202020;
  font-size: 12px;
  width: 100%;
  height: 100%;
  cursor: pointer;
  overflow-y: scroll;
  word-wrap: break-word;
`;

export default class SmartCard extends Component {
  state = {
    title: this.props.title,
    body: this.props.body,
    prevTitle: "",
    prevBody: "",
    titleEdit: false,
    bodyEdit: false,
    titleUpdated: false,
    bodyUpdated: false,
    bodyCharCount: style.BODY_CHAR_COUNT
  };

  titleRef = React.createRef();
  bodyRef = React.createRef();
  paragraphRef = React.createRef();

  handleUpdateMessage = part => {
    const fragment = `${part}Updated`;
    this.setState({
      [fragment]: true
    });
    setTimeout(
      () =>
        this.setState({
          [fragment]: false
        }),
      2000
    );
  };

  handleFocus = () => {
    this.setState({
      prevTitle: this.state.title.trim(),
      prevBody: this.state.body.trim()
    });
  };

  handleTitle = async () => {
    this.setState(({ titleEdit }) => ({
      titleEdit: !titleEdit
    }));
    if (!this.state.titleEdit) {
      setTimeout(() => this.titleRef.current.focus(), 0);
    } else {
      if (!this.state.title) {
        return this.setState({
          title: this.state.prevTitle
        });
      }
      if (this.state.title.trim() === this.state.prevTitle) return;

      this.setState({ loading: true });

      try {
        axios.put(`/notes/${this.props._id}`, {
          data: {
            title: this.state.title.trim()
          }
        });
      } catch (err) {
        this.setState({
          error: true,
          loading: false
        });
      }
      this.setState({ loading: false });
      this.handleUpdateMessage("title");
    }
  };

  handleBody = () => {
    this.setState(({ bodyEdit }) => ({
      bodyEdit: !bodyEdit
    }));
    if (!this.state.bodyEdit) {
      setTimeout(() => this.bodyRef.current.focus(), 0);
    } else {
      if (!this.state.body) {
        return this.setState({
          body: this.state.prevBody
        });
      }
      if (this.state.body.trim() === this.state.prevBody) return;
      this.setState({ loading: true });
      try {
        axios.put(`/notes/${this.props._id}`, {
          data: {
            body: this.state.body.trim()
          }
        });
      } catch (err) {
        this.setState({
          error: true,
          loading: false
        });
      }
      this.setState({ loading: false });
      this.handleUpdateMessage("body");
    }
  };

  handleChange = e =>
    this.setState({
      [e.target.name]: e.target.value
    });

  handleDelete = async () => {
    await axios.delete(`/notes/${this.props._id}`);
    this.props.getNotes();
    this.props.showNotification();
  };

  componentDidMount() {
    this.setState({
      bodyHeight:
        this.paragraphRef.current && this.paragraphRef.current.clientHeight
    });
  }

  render() {
    const {
      title,
      titleEdit,
      bodyEdit,
      body,
      titleUpdated,
      bodyUpdated,
      bodyHeight,
      bodyCharCount
    } = this.state;

    const { date } = this.props;
    const bodyCharLeft = bodyCharCount - body.length;
    return (
      <Card>
        <TitleContainer>
          {titleEdit ? (
            <TitleInput
              placeholder={title}
              value={title}
              name="title"
              onChange={this.handleChange}
              onBlur={this.handleTitle}
              onFocus={this.handleFocus}
              ref={this.titleRef}
            />
          ) : (
            <CardTitle onClick={this.handleTitle}>{title}</CardTitle>
          )}
          <CheckMark show={titleUpdated} />
        </TitleContainer>

        <CardDate>Created {moment(date).fromNow()}</CardDate>
        <CharLeftContainer>
          {bodyEdit && bodyCharLeft <= 15 && (
            <FadeIn>{`You have ${bodyCharLeft} characters left`}</FadeIn>
          )}
        </CharLeftContainer>
        <BodyContainer>
          {bodyEdit ? (
            <BodyInput
              placeholder={body}
              value={body}
              name="body"
              onChange={this.handleChange}
              onBlur={this.handleBody}
              onFocus={this.handleFocus}
              ref={this.bodyRef}
              rows="10"
              height={bodyHeight}
              maxLength={bodyCharCount}
            />
          ) : (
            <CardBody ref={this.paragraphRef} onClick={this.handleBody}>
              {body}
            </CardBody>
          )}
          <CheckMark show={bodyUpdated} />
        </BodyContainer>
        <img onClick={this.handleDelete} src={trash} alt="delete" />
      </Card>
    );
  }
}
