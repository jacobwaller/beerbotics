const BeerEntry = (props) => {
  const internal = (
    <div>
      <h2>{props.name}</h2>
      <h3>{props.abv}% abv.</h3>
      <h3>{props.remaining} remaining</h3>
    </div>
  );

  if (props.selected) {
    return <div className="selected">{internal}</div>;
  } else {
    return <div className="unselected">{internal}</div>;
  }
};

export default BeerEntry;
