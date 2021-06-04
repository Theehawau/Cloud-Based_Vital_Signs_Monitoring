const deviceId = document.getElementById('deviceId').innerHTML
const temp = document.getElementById('temperature')
const pulse = document.getElementById('pulse')
const link = `http://vital-signs-project.herokuapp.com/wearable/${deviceId.trim()}/data` 
// const link = `localhost:3000/wearable/${deviceId.trim()}/data`

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
  
}, 50);