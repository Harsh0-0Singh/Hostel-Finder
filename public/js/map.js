mapboxgl.accessToken = mapToken;
// mapboxgl.accessToken = 'pk.eyJ1IjoiaGFyc2gwLTBzaW5naCIsImEiOiJjbTV5eG5paHQwbXV0MmtxeDU0c3FpcXJ1In0.Lk-5cuM0HVf97ssT45uKLw';
const map = new mapboxgl.Map({
  container: 'map', // container ID
  center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 9 // starting zoom
});

// console.log(coordinates);

const marker = new mapboxgl.Marker({color:"red"})
.setLngLat(listing.geometry.coordinates) //Listing.geometry.coordinates
.setPopup(new mapboxgl.Popup({offset: 25})
.setHTML(`<h4>${listing.title}</h4><p>Exact location provided after booking!</p>`))
.addTo(map);