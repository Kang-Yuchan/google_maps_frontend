let map;

function initMap() {
  let kyoto = { lat: 35.015758, lng: 135.768058 };
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: kyoto,
  });
  createMarker();
}

const createMarker = () => {
  let marker = new google.maps.Marker({
    position: { lat: 35.015758, lng: 135.768058 },
    map: map,
  });
};
