import React, { Component } from "react";
import styled from "styled-components";
import axios from "axios";
import Loading from "react-loading-bar";
import SmartCard from "./components/SmartCard";
import SmartNote from "./components/SmartNote";
import FadeIn from "./components/FadeIn";
import Notification from "./components/Notification";

const Container = styled.div`
  width: 100%;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 45px;

  font-weight: 800;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 5rem;
  margin-bottom: 1rem;
`;

const SubTitle = styled.h2`
  text-align: center;
  font-size: 20px;
  color: #303030;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  margin-bottom: 3rem;
`;

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  transform: translate(${({ show }) => (show ? "0" : "-10px")});
  opacity: ${({ show }) => (show ? 1 : 0)};
  padding-bottom: 128px;
`;

class App extends Component {
  state = {
    notes: [],
    loading: false,
    error: false,
    showNotification: false
  };

  getNotes = async () => {
    try {
      this.setState({ loading: true });
      const response = await axios(`/notes`);
      this.setState({ notes: response.data });
      this.setState({ loading: false });
    } catch (err) {
      this.setState({ error: true, loading: false });
    }
  };

  showNotification = () => {
    const { showNotification } = this.state;
    if (showNotification) {
      return;
    }
    this.setState({ showNotification: true });
    setInterval(() => this.setState({ showNotification: false }), 3000);
  };

  componentDidMount() {
    this.getNotes();
  }
  render() {
    const { notes, loading, showNotification } = this.state;
    return (
      <Container>
        <Loading show={loading} color="#202020" showSpinner={false} />
        <FadeIn>
          <Title>Notes</Title>
        </FadeIn>

        {!loading && !notes.length && (
          <FadeIn delay={160}>
            <SubTitle>
              No notes to show. Click the plus button to add one.
            </SubTitle>
          </FadeIn>
        )}

        <FadeIn>
          <Grid show={!loading}>
            {notes.map(note => (
              <SmartCard
                showNotification={this.showNotification}
                getNotes={this.getNotes}
                key={note._id}
                {...note}
              />
            ))}
          </Grid>
        </FadeIn>

        <SmartNote
          showNotification={this.showNotification}
          getNotes={this.getNotes}
        />
        <Notification show={showNotification} />
      </Container>
    );
  }
}

export default App;
