const BeerEntry = (props) => {
  const internal = (
    <div>
      <h2>{props.name}</h2>
      <h3>{props.abv}% abv.</h3>
      <h3>{props.remaining} remaining</h3>
    </div>
  );

  if (props.selected) {
    console.log('one selected');
    return <div className="selected">{internal}</div>;
  } else {
    console.log('one not');
    return <div>{internal}</div>;
  }
};

export default BeerEntry;
