import React, { Component } from "react";
import styled from "styled-components";
import axios from "axios";
import * as style from "./style";
import { TitleContainer, TitleInput, BodyInput } from "./SmartCard";
import FadeIn from "./FadeIn";

const AddButton = styled.div`
  position: fixed;
  width: 50px;
  height: 50px;
  background: black;
  z-index: 2;
  bottom: ${style.COLUMN / 2}px;
  right: ${style.COLUMN / 2}px;
  border-radius: 50%;
  box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.6);
  transition: 0.2s ease-in-out;
  cursor: pointer;
  background: #000000;
  background: linear-gradient(to right, #434343, #000000);

  &:hover {
    transform: scale(1.2);
    box-shadow: 5px 5px 25px rgba(0, 0, 0, 0.3);
  }

  &::after {
    content: "Add a new note";
    position: absolute;
    width: 80px;
    font-size: 11px;
    right: 100%;
    top: 50%;
    opacity: 0;
    transition: 0.25s ease-in-out;
  }
  &:hover::after {
    transform: translate(-10%, -50%);
    opacity: 1;
  }
`;

const Plus = styled.div`
  width: 20px;
  height: 5px;
  background: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 5px 5px 25px rgba(0, 0, 0, 0.3);
  transition: 0.2s;
  &::after {
    content: "";
    position: absolute;
    height: 20px;
    width: 5px;
    background: white;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 5px 5px 25px rgba(0, 0, 0, 0.3);
  }
`;

const CharLeftContainer = styled.div``;

const AddNoteContainer = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 3;
  transition: all 0.3s ease-in-out;
  transform: scale(${({ open }) => (open ? 1 : 0.95)});
  opacity: ${({ open }) => (open ? "1" : "0")};
  background: rgba(255, 255, 255, 0.8);
  display: ${({ destroy }) => (destroy ? "none" : "block")};
`;

const AddNote = styled(FadeIn)`
  position: absolute;
  width: 100%;
  max-width: 800px;
  height: 90%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, ${({ open }) => (open ? "-50%" : "-45%")});
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 48px ${style.COLUMN}px;
  padding-bottom: 92px;
  box-sizing: border-box;
  box-shadow: 0px 0px 34px rgba(0, 0, 0, 0.2);
  border-radius: 0.1rem;
  transition: all s 0.35s ease-in-out;
`;

const StyledBody = styled(FadeIn)`
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 32px;
  height: 100%;
  margin-bottom: 34px;
  border-radius: 0.1rem;
  ${BodyInput} {
    font-size: 22px;
    height: 100%;
  }
`;

const ButtonContainer = styled(FadeIn)`
  /* position: absolute; */
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  bottom: 48px;
  left: 64px;
  right: 0;
`;

const Button = styled.button`
  cursor: pointer;
  outline: none;
  background: #202020;
  font-size: 20px;
  font-weight: 800;
  border: none;
  border-radius: 0.1rem;
  color: white;
  margin-right: 32px;
  box-sizing: border-box;
  padding: 4px 128px;
  border: 5px solid #202020;
`;

const DangerButton = styled(Button)`
  background: white;
  color: #202020;
  box-sizing: border-box;
  font-weight: 300;
  padding: 4px 16px;
  margin-right: 8px;
  transition: 0.2s ease-in-out;
  &:hover {
    background: #202020;
    color: white;
  }
`;

class SmartNote extends Component {
  state = {
    open: false,
    destroy: true,
    title: "",
    body: "",
    loading: false,
    error: false,
    titlePlaceholder: "Add a title",
    bodyPlaceholder: "Start typing your new idea",
    bodyCharCount: style.BODY_CHAR_COUNT
  };

  inputRef = React.createRef();
  bodyInput = React.createRef();

  handleOpenNote = () => {
    this.setState({ destroy: false });
    setTimeout(() => {
      this.setState({ open: true });
      if (!this.state.title) {
        this.inputRef.current.focus();
      } else {
        this.bodyInput.current.focus();
      }
    }, 200);
  };

  handleActions = async accepted => {
    const { title, body } = this.state;
    if (accepted) {
      this.setState({
        titlePlaceholder: "Add a title",
        bodyPlaceholder: "Start typing your new idea"
      });

      if (!title.length) {
        this.setState({
          titlePlaceholder: "You need to add a title!"
        });
        return;
      }
      if (!body.length) {
        this.setState({
          bodyPlaceholder: `You need to add text to ${`"${title}""` ||
            "your note"}`
        });
        return;
      }

      this.setState({ loading: true });
      try {
        await axios.post("/notes/new", {
          data: {
            title,
            body
          }
        });
        this.setState({ loading: false });
        this.props.showNotification();
        this.props.getNotes();
      } catch (err) {
        this.setState({ loading: false, error: true });
      }
    }
    localStorage.removeItem("title");
    localStorage.removeItem("body");
    this.setState({
      title: "",
      body: ""
    });

    this.handleCloseModal();
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
    localStorage.setItem(e.target.name, e.target.value);
  };

  handleClear = () => {
    localStorage.removeItem("title");
    localStorage.removeItem("body");
    this.setState({
      title: "",
      body: ""
    });
    this.inputRef.current.focus();
  };

  handleCloseModal = () => {
    this.setState({ open: false });
    setTimeout(() => this.setState({ destroy: true }), 200);
  };

  componentDidMount() {
    window.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        this.handleCloseModal();
      }
      if (e.key === "Enter") {
        if (this.state.title.length && this.state.body.length) {
          this.handleActions(true);
        }
      }
    });

    this.setState({
      title: localStorage.getItem("title") || "",
      body: localStorage.getItem("body") || ""
    });
  }
  render() {
    const {
      open,
      destroy,
      title,
      body,
      titlePlaceholder,
      bodyPlaceholder,
      bodyCharCount
    } = this.state;
    const bodyCharLeft = bodyCharCount - body.length;
    return (
      <React.Fragment>
        <AddNoteContainer open={open} destroy={destroy}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%"
            }}
            onClick={this.handleCloseModal}
          />
          <AddNote open={open}>
            <FadeIn delay="80">
              <TitleContainer>
                <TitleInput
                  name="title"
                  value={title}
                  onChange={this.handleChange}
                  ref={this.inputRef}
                  placeholder={titlePlaceholder}
                />
              </TitleContainer>
            </FadeIn>
            <CharLeftContainer>
              {bodyCharLeft <= 15 && (
                <FadeIn>{`You have ${bodyCharLeft} characters left`}</FadeIn>
              )}
            </CharLeftContainer>

            {title.length ? (
              <StyledBody>
                <BodyInput
                  name="body"
                  value={body}
                  onChange={this.handleChange}
                  ref={this.bodyInput}
                  placeholder={bodyPlaceholder}
                  maxLength={bodyCharCount}
                />
              </StyledBody>
            ) : null}

            <ButtonContainer delay="160">
              <Button onClick={() => this.handleActions(true)}>SAVE</Button>
              <div style={{ display: "flex" }}>
                <DangerButton onClick={() => this.handleActions(false)}>
                  CANCEL
                </DangerButton>
                {(title || body) && (
                  <FadeIn>
                    <DangerButton onClick={this.handleClear}>
                      CLEAR
                    </DangerButton>
                  </FadeIn>
                )}
              </div>
            </ButtonContainer>
          </AddNote>
        </AddNoteContainer>

        {!open && (
          <AddButton onClick={this.handleOpenNote}>
            <Plus />
          </AddButton>
        )}
      </React.Fragment>
    );
  }
}

export default SmartNote;
