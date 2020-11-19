window.onload = () => {
  const defaultCenter = {
    lat: 55.7834592, 
    lng: -4.2834392
  };
  
  const markers = []
  
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: defaultCenter
  });

  let center = {
    lat: undefined,
    lng: undefined
  };

  function getPlaces() {
    axios.get('/api')
      .then(res => showPlaces(res.data.places))
      .catch(e => console.log(`Error retreiving places: ${e}`))
  }

  function showPlaces(places) {
    places.forEach(function(place) {
      const center = {
        lat: place.location.coordinates[0],
        lng: place.location.coordinates[1]
      };
      const pin = new google.maps.Marker({
        position: center,
        map: map,
        title: place.name
      });
      markers.push(pin)
    })
  }

  getPlaces();
};