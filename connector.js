fetch('http://127.0.0.1:5500/get_data')
    .then(response => response.json())
    .then(data => console.log(data));


