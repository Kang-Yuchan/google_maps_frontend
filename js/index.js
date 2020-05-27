let map;
let infoWindow;
let markers = [];

function initMap() {
  let kyoto = {
    lat: 35.015758,
    lng: 135.768058
  };
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: kyoto,
  });
  infoWindow = new google.maps.InfoWindow();
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
  stores.forEach((store) => {
    let latlng = new google.maps.LatLng(
      store.location.coordinates[0],
      store.location.coordinates[1]
    );
    let name = store.storeName;
    let address = store.addressLines[0];
    let openStatusText = store.openStatusText;
    let phone = store.phoneNumber;
    bounds.extend(latlng);
    createMarker(latlng, name, address, phone, openStatusText);
  });
  map.fitBounds(bounds);
};

const createMarker = (latlng, name, address, phone, openStatusText) => {
  let html = `
    <div class="store-info-window">
      <div class="store-info-name">
        ${name}
      </div>
      <div class="store-info-open-status">
        ${openStatusText}
      </div>
      <div class="store-info-address">
        <div class="icon">
          <i class="fas fa-location-arrow"></i>
        </div>
        <span>
          ${address}
        </span>
      </div>
      <div class="store-info-phone">
        <div class="icon">
          <i class="fas fa-phone-alt"></i>
        </div>
        <span>
         <a href="tel:${phone ? phone : "-"}">${phone ? phone : "-"}</a> 
        </span>
      </div>
    </div>
  `;
  let marker = new google.maps.Marker({
    position: latlng,
    map: map
  });
  google.maps.event.addListener(marker, 'click', () => {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });
  markers.push(marker);
};
