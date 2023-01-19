(function() {
    const lat = 10.4631400;
    const lng = -73.2532200;
    const mapa = L.map('mapa').setView([lat, lng ], 16);
    let marker;

    //Utlizar provider y geocoder
    const geocodeService = L.esri.Geocoding.geocodeService();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);


    //Generar y dibujar el pin
    marker = new L.marker([lat,lng],{
        draggable: true,
        autoPan: true
    }).addTo(mapa);

    //Detectar el movimiento
    marker.on('moveend', function(e){
        marker = e.target;

        const posicion = marker.getLatLng();

        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));
        // mapa.panTo(posicion);

        //Nombre de la calle
        geocodeService.reverse().latlng(posicion, 16).run(function (error, resultado){
            //console.log(resultado)

            marker.bindPopup(resultado.address.LongLabel);
        })
    });

})()