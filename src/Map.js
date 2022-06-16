import React from 'react';
import ImageMarker from 'react-image-marker';

export default function Map() {
  const [targetXPercent, setXPercent] = React.useState(() => -1);
  const [targetYPercent, setYPercent] = React.useState(() => -1);
  const [markers, setMarkers] = React.useState([]);

  const imageClick = (i) => {
    console.log('Clicking on pixels');
    console.log(i);
    const clickedX = i.left;
    const clickedY = i.top;

    setXPercent(clickedX);
    setYPercent(clickedY);
    setMarkers([i]);
  };
  return (
    <div>
      <ImageMarker
        src={require('./mapPGM.png')}
        onClick={imageClick}
        markers={markers}
        onAddMarker={imageClick}
        extraClass="image-marker"
      />
    </div>
  );
}
