
const ctx = document.getElementById('pulseChart');
const deviceId = document.getElementById('deviceId').innerHTML
const temp = document.getElementById('temperature')
const pulse = document.getElementById('pulse')
const link = `http://localhost:3000/${deviceId.trim()}/data` 


setInterval(() => {
  fetch(link, {
    method: 'GET'
  }).then(res => {
    const deviceData = res.json()
    return deviceData
  }).then((deviceData) => {
    temp.innerHTML=deviceData.temperature + "°C"
    pulse.innerHTML = deviceData.pulse + "bpm"
  })
  
}, 100);

  fetch(link, {
    method: 'GET'
  }).then(res => {
    const deviceData = res.json()
    return deviceData
  })
  .then((deviceData) => {
    const labels = deviceData.time
    const data = {
      labels: labels,
      datasets: [{
        label: 'Pulse Rate',
        data: deviceData.pulse,
        fill: false,
        borderColor: 'rgb(0, 0, 128)',
        tension: 0.1
      }]
    };
    var myChart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
          scales: {
              y: {
                  min: 50,
                  max: 190
              }
          },
          plugins:{
            title: {
              display: true,
              text: 'Pulse Rate Line Chart'
            }
          }
          
      }
  });
  })




