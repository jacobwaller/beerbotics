// import map from './mapPGM.png';
import './App.css';
import BeerEntry from './Beer-Entry';
import { Button } from '@mui/material';
import { Col, Container, ListGroup, Row } from 'react-bootstrap';
import React from 'react';
import ImageMarker from 'react-image-marker';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { v4 } from 'uuid';

// save a uuid in local storage
const saveUuid = (uuid) => {
  localStorage.setItem('uuid', uuid);
  return uuid;
};
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // get uuid from local storage or create a new one
      correlationId: localStorage.getItem('uuid') || saveUuid(v4()),
      submitted: false,
      markers: [],
      selected: 'left',
      orderQueue: [
        {
          name: '...',
        },
      ],
      beerOptions: [
        {
          name: '...',
          abv: 0,
          remaining: 0,
        },
        {
          name: '...',
          abv: 0,
          remaining: 0,
        },
      ],
      pollingCount: 0,
      tickDelay: 1000,
    };

    console.log('state', this.state);
  }

  tick() {
    this.getDeliveries();
    this.setState({
      pollingCount: this.state.pollingCount + 1,
    });
  }

  setMarkers(markers) {
    this.setState({ markers });
  }

  setSelected(selected) {
    console.log('selected', selected);
    this.setState({ selected: selected });
  }

  setOrderQueue(queueItems) {
    this.setState({ orderQueue: queueItems });
  }

  async getOptions() {
    const options = await axios.get(
      'https://us-central1-beer-bot-309823.cloudfunctions.net/getOptions',
    );

    this.setState({
      beerOptions: options.data,
    });

    return options;
  }

  async getDeliveries() {
    let optionsPromise;
    if (this.state.beerOptions[0].name === '...') {
      optionsPromise = this.getOptions();
    }
    const deliveriesPromise = axios.get(
      'https://us-central1-beer-bot-309823.cloudfunctions.net/getDeliveries',
    );

    const results = await Promise.all([optionsPromise, deliveriesPromise]);
    const deliveries = results[1].data;
    const queueItems = deliveries.map((delivery, idx) => {
      return {
        id: idx,
        x: delivery.x,
        y: delivery.y,
        name: this.state.beerOptions[delivery.beerIndex].name,
        correlationId: delivery.correlationId,
      };
    });
    this.setOrderQueue(queueItems);
  }

  async handleSubmit() {
    console.log('state', this.state);
    try {
      await axios.post(
        'https://us-central1-beer-bot-309823.cloudfunctions.net/createDelivery',
        {
          x: this.state.markers[0].left,
          y: this.state.markers[0].top,
          beerIndex: this.state.selected === 'left' ? 0 : 1,
          correlationId: this.state.correlationId,
        },
      );
      await this.getDeliveries();
      this.setState({ submitted: true });
    } catch (e) {
      console.log('error', e);
    }
  }

  componentDidMount() {
    this.getDeliveries();
    this.timer = setInterval(() => this.getDeliveries(), 3000);
  }

  componentWillUnmount() {
    this.timer = null; // here...
  }

  render() {
    const handleImageClick = (i) => {
      this.setMarkers([i]);
    };

    const handleSelect = (i) => {
      this.setSelected(i);
    };

    if (this.state.submitted === false) {
      return (
        <div className="App">
          {/* <header className="App-header"> */}
          <h1>Beerbotics</h1>
          <p>1. click where you would like your beverage delivered</p>
          <p>2. select which beverage you'd like</p>
          <p>3. hit submit & wait</p>
          {/* <img src={map} className="App-logo" alt="logo" /> */}
          <Container>
            <Row className="justify-content-md-center">
              <Col md={4} id="queue" className="row-one">
                <ListGroup>
                  <ListGroup.Item variant="secondary">
                    Order Queue
                  </ListGroup.Item>
                  {this.state.orderQueue.map((item) => {
                    return (
                      <ListGroup.Item key={item.id}>
                        {item.id !== undefined ? item.id + 1 + '.' : ''}{' '}
                        {item.name}
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </Col>
              <Col md={6} className="row-one">
                <ImageMarker
                  src={require('./mapPGM.png')}
                  onClick={this.setMarkers}
                  markers={this.state.markers}
                  onAddMarker={handleImageClick}
                />
              </Col>
            </Row>
            <Row className="justify-content-md-center">
              <Col md={3} onClick={() => handleSelect('left')}>
                <BeerEntry
                  name={this.state.beerOptions[0].name}
                  abv={this.state.beerOptions[0].abv}
                  remaining={this.state.beerOptions[0].remaining}
                  selected={this.state.selected === 'left'}
                  className="beer"
                />
              </Col>
              <Col md={3} onClick={() => handleSelect('right')}>
                <BeerEntry
                  name={this.state.beerOptions[1].name}
                  abv={this.state.beerOptions[1].abv}
                  remaining={this.state.beerOptions[1].remaining}
                  selected={this.state.selected === 'right'}
                  className="beer"
                />
              </Col>
            </Row>
          </Container>
          <Button
            id="submit_button"
            variant="contained"
            onClick={() => this.handleSubmit()}
          >
            Submit
          </Button>
          {/* </header> */}
        </div>
      );
    } else {
      return (
        <div className="App">
          <h1>Beerbotics</h1>
          <p>Your order has been submitted!</p>
          <p>Stay on this page</p>
          <Container>
            <Row className="justify-content-md-center">
              <Col md={4} id="queue" className="row-one">
                <ListGroup>
                  <ListGroup.Item variant="secondary">
                    Order Queue
                  </ListGroup.Item>
                  {this.state.orderQueue.map((item) => {
                    if (item.correlationId === this.state.correlationId) {
                      return (
                        <ListGroup.Item variant="success">
                          {item.id !== undefined ? item.id + 1 + '.' : ''}{' '}
                          {item.name}
                        </ListGroup.Item>
                      );
                    }
                    return (
                      <ListGroup.Item key={item.id}>
                        {item.id !== undefined ? item.id + 1 + '.' : ''}{' '}
                        {item.name}
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </Col>
            </Row>
          </Container>
        </div>
      );
    }
  }
}

export default App;
