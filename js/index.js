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
      searchLocationNear(resData)
      setStoresList(resData)
      setOnClickListener()
    });
};

const setOnClickListener = () => {
  let storeElements = document.querySelectorAll('.store-container');
  storeElements.forEach((elem, index) => {
    elem.addEventListener('click', () => {
      google.maps.event.trigger(markers[index], 'click');
    })
  })
}

const setStoresList = stores => {
  let storesHtml = '';
  stores.forEach((store, index) => {
    storesHtml += `
    <div class="store-container">
      <div class="store-container-background">
        <div class="store-info-container">
          <div class="store-address">
            <span>${store.addressLines[0]}</span>
            <span>${store.addressLines[1]}</span>
          </div>
          <div class="store-phone-number">
            ${store.phoneNumber ? store.phoneNumber : "-"}
          </div>
        </div>
        <div class="store-number-container">
          <div class="store-number">
            ${index + 1}
          </div>
        </div>
      </div>
    </div>
    `;
  })
  document.querySelector('.stores-list').innerHTML = storesHtml;
}

const searchLocationNear = (stores) => {
  let bounds = new google.maps.LatLngBounds();
  stores.forEach((store) => {
    let latlng = new google.maps.LatLng(
      store.location.coordinates[1],
      store.location.coordinates[0]
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
