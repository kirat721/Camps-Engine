mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
   
    center: cood, // starting position [lng, lat]
    zoom: 10, // starting zoom
    projection: 'globe' // display the map as a 3D globe
});
map.addControl(new mapboxgl.NavigationControl())
new mapboxgl.Marker()
.setLngLat(cood)
.setPopup(
  new mapboxgl.Popup({offset:25})
  .setHTML(`<h5>${title}</h5><p>${loc}</p>`)
)
.addTo(map)