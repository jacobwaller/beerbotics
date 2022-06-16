// import map from './mapPGM.png';
import Map from './Map';
import './App.css';
import BeerEntry from './Beer-Entry';
import { Button, Switch } from '@mui/material';
import { Col, Container, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  let isLeft = true;

  const setSelected = (isLeftLocal) => {
    console.log(isLeftLocal);
    isLeft = isLeftLocal;
    this.setState({});
  };

  return (
    <div className="App">
      {/* <header className="App-header"> */}
      <h1>Beerbotics</h1>
      <p>click where you would like your beverage delivered</p>
      {/* <img src={map} className="App-logo" alt="logo" /> */}
      <Container>
        <Map className="App-logo" />
        <Row className="justify-content-md-center">
          <Col md={3} onClick={() => setSelected(true)}>
            <BeerEntry
              name="Miller High Life - Light Beer"
              abv={4.6}
              remaining={8}
              selected={isLeft}
              className="beer"
            />
          </Col>
          <Col md={3} onClick={() => setSelected(false)}>
            <BeerEntry
              name="Guinness Draught - Stout"
              abv={6.8}
              remaining={4}
              selected={!isLeft}
              className="beer"
            />
          </Col>
        </Row>
      </Container>
      <Button id="submit_button" variant="contained">
        Submit
      </Button>
      {/* </header> */}
    </div>
  );
}

export default App;
