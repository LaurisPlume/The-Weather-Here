async function getData(){
    const mymap = L.map('checkinsMap').setView([0, 0], 1);
    const attribution = 
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

    const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const tiles = L.tileLayer(tileUrl, {attribution});
    tiles.addTo(mymap);

    const response = await fetch('/viewCheckinsRoute')
    const data = await response.json();
    console.log(data);

    for(item of data){
        let txt = `The weather here at ${item.lat}&deg;, ${item.lon}&deg;
        is ${item.weather.weather[0].description} with a temperature of ${item.weather.main.temp} F.`
        
        if(item.air.value < 0){
            txt+=` There is NO on air quality data.`;
        }else{
            txt+=`The particulate matter (${item.air.results[0].measurements[0].parameter}) pollution is 
            ${item.air.results[0].measurements[0].value} ${item.air.results[0].measurements[0].unit} 
            last updated at ${item.air.results[0].measurements[0].lastUpdated}`;
        }
        const marker = L.marker([item.lat, item.lon]).addTo(mymap);
        marker.bindPopup(txt);

    }
};
getData();