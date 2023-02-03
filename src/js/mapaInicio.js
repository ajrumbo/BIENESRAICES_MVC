(function(){
    const lat = 10.4631400;
    const lng = -73.2532200;
    const mapa = L.map('mapa-inicio').setView([lat, lng ], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    const obtenerPropiedades = async () => {
        try {
            const url = 'api/propiedades';
            const respuesta = await fetch(url);
            const propiedades = await respuesta.json()

            console.log(propiedades)
        } catch (error) {
            console.log(error);
        }
    }

    obtenerPropiedades();
})()