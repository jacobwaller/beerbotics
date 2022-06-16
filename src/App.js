// import map from './mapPGM.png';
import './App.css';
import BeerEntry from './Beer-Entry';
import { Button } from '@mui/material';
import { Col, Container, Row } from 'react-bootstrap';
import React from 'react';
import ImageMarker from 'react-image-marker';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [targetXPercent, setXPercent] = React.useState(() => -1);
  const [targetYPercent, setYPercent] = React.useState(() => -1);
  const [markers, setMarkers] = React.useState([]);
  const [selected, setSelected] = React.useState(['left']);
  const imageClick = (i) => {
    console.log('Clicking on pixels');
    console.log(i);
    const clickedX = i.left;
    const clickedY = i.top;

    setXPercent(clickedX);
    setYPercent(clickedY);
    setMarkers([i]);
  };

  const colClick = (i) => {
    console.log(i);

    setSelected(i);
  };

  const submit = () => {
    console.log(selected);
    console.log(markers);
    axios.post(
      'https://us-central1-beer-bot-309823.cloudfunctions.net/createDelivery',
      {
        x: markers[0].left,
        y: markers[0].top,
        beerIndex: selected === 'left' ? 0 : 1,
      },
    );
  };

  return (
    <div className="App">
      {/* <header className="App-header"> */}
      <h1>Beerbotics</h1>
      <p>1. click where you would like your beverage delivered</p>
      <p>2. select which beverage you'd like</p>
      <p>3. hit submit & wait</p>
      {/* <img src={map} className="App-logo" alt="logo" /> */}
      <Container>
        <div className="image-marker">
          <Row className="justify-content-md-center">
            <Col md={6}>
              <ImageMarker
                src={require('./mapPGM.png')}
                onClick={imageClick}
                markers={markers}
                onAddMarker={imageClick}
              />
            </Col>
          </Row>
        </div>
        <Row className="justify-content-md-center">
          <Col md={3} onClick={() => colClick('left')}>
            <BeerEntry
              name="Miller High Life - Light Beer"
              abv={4.6}
              remaining={8}
              selected={selected === 'left'}
              className="beer"
            />
          </Col>
          <Col md={3} onClick={() => colClick('right')}>
            <BeerEntry
              name="Guinness Draught - Stout"
              abv={6.8}
              remaining={4}
              selected={selected === 'right'}
              className="beer"
            />
          </Col>
        </Row>
      </Container>
      <Button id="submit_button" variant="contained" onClick={submit}>
        Submit
      </Button>
      {/* </header> */}
    </div>
  );
}

export default App;
