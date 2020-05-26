let map;

function initMap() {
  let kyoto = {
    lat: 35.015758,
    lng: 135.768058
  };
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: kyoto,
  });
  getStores();
}

const getStores = () => {
  const API_URL = "http://localhost:4000/api/stores";
  fetch(API_URL)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        throw new Error(res.status);
      }
    })
    .then((resData) => {
      return searchLocationNear(resData)
    });
};

const searchLocationNear = (stores) => {
  let bounds = new google.maps.LatLngBounds();
  stores.forEach((store, index) => {
    let latlng = new google.maps.LatLng(
      store.location.coordinates[0],
      store.location.coordinates[1]
    );
    let name = store.storeName;
    let address = store.addressLines[0];
    bounds.extend(latlng);
    createMarker(latlng, name, address);
  });
  map.fitBounds(bounds);
};

const createMarker = (latlng, name, address) => {
  let marker = new google.maps.Marker({
    position: latlng,
    map: map,
  });
};
