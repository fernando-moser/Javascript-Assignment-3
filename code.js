window.onload = function () {
    
    let path = 'flights.json';
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4 && xhr.status == 200) {
            allFlights = JSON.parse(xhr.responseText);
            alert('Finished reading the file');
            btnAllFlightHandler();
            btnSearchHandler();
        }
    };
    xhr.open('GET',path,true);
    xhr.send();
}

let allFlights;


function buildPage(text) {
    document.getElementById('fQuantity').innerHTML = `Flights (${text.flights.length})`;
    let table = document.querySelector('tbody');
    table.innerHTML = '';    
    // Builds flight table
    let output = '<tr>';
    text.flights.forEach(item => {
        output += `<td>${item.flightNumber}</td>
        <td>${item.dayOfWeek}</td>
        <td>${item.departureTime}</td>
        <td>${item.destination.code} (${item.destination.city}, ${item.destination.country}), region = ${item.destination.region}</td>`;
        output += '<td>';
        //Checks Pilot
        output += item.pilot === undefined ? 
            'not yet assigned' : item.pilot.nickName === undefined ? 
            `${item.pilot.firstName} ${item.pilot.lastName}` : `${item.pilot.firstName} ${item.pilot.lastName} (${item.pilot.nickName})`;
        
        output += '</td><td>';
        //Checks CoPilot
        output += item.copilot === undefined ?
            'not yet assigned' : item.copilot.nickName === undefined ?
            `${item.copilot.firstName} ${item.copilot.lastName}` : `${item.copilot.firstName} ${item.copilot.lastName} (${item.copilot.nickName})`;
        
        output += '</td></tr>';
    });
    table = document.querySelector('tbody');
    table.innerHTML = `${output}`;
    
}

function btnAllFlightHandler() {
    let allFlifhtsBtn = document.getElementById('btnAllFlights');
    allFlifhtsBtn.addEventListener('click',() => {
        buildPage(allFlights);
        //Display how many flights
    })
}

function btnSearchHandler() {
    let allFlifhtsBtn = document.getElementById('btnSearch');
    allFlifhtsBtn.addEventListener('click',() => {
        //Fields to get inputs from
        let inputCity = document.getElementById('city').value; //City
        let inputCountry = document.getElementById('country').value; //Country
        let inputRegion = Number(document.getElementById('region').value); //Region
        let inputDay = document.getElementById('day').value; //Day
        let inputMin = document.getElementById('min').value; //Date min
        let inputMax = document.getElementById('max').value; //Date max
        let inputPilot = document.getElementById('pilot').checked; //Pilot
        let inputCoPilot = document.getElementById('co-pilot').checked; //Co-Pilot
        
        if(!inputCity && !inputCountry && !inputRegion && inputDay === 'Any' && !inputMin && !inputMax && !inputPilot && !inputCoPilot){
            buildPage(allFlights);
        } else {
            
            let results = Array.from(allFlights.flights);
            
            if(!!inputCity) {
                results = searchByCity(inputCity,results);
            }
            
            if(!!inputCountry) {
                results = searchByCountry(inputCountry,results);
            }
            
            if(inputRegion !== 0) {
                results = searchByRegion(inputRegion,results);
            }
            
            if(inputDay !== 'Any') {
                results = searchByDay(inputDay,results);
            }
            
            if(!!inputMin || !!inputMax) {
                let min = inputMin;
                let max = inputMax;
                if (!!inputMin & !inputMax) {
                    max = 2400;
                } 
                if (!inputMin & !!inputMax) {
                    min = 1;
                }
                results = searchByTime(min,max,results);
            }
            
            if(inputPilot) {
                let temp = [];
                results.forEach(item => {
                    if(item.pilot !== undefined) {
                        temp.push(item);
                    }
                });
                results = temp;
            }
            if(inputCoPilot) {
                console.log('passei');
                let temp = [];
                results.forEach(item => {
                    if(item.copilot !== undefined) {
                        temp.push(item);
                    }
                });
                results = temp;
            }
            let flights = {flights : results};
            buildPage(flights);
        }
    })
}

function searchByCity(value,array) {
    let expression = new RegExp(value,'i');
    let results = [];
    array.forEach(item => {
        if(expression.test(item.destination.city)) {
            results.push(item);
        }
    })
    return results;
}
function searchByCountry(value,array) {
    let expression = new RegExp(value,'i');
    let results = [];
    array.forEach(item => {
        if(expression.test(item.destination.country)) {
            results.push(item);
        }
    })
    return results;
}
function searchByRegion(value,array) {
    let results = [];
    array.forEach(item => {
        if(value === item.destination.region) {
            results.push(item);
        }
    })
    return results;
}
function searchByDay(value,array) {
    let results = [];
    array.forEach(item => {
        if(value === item.dayOfWeek) {
            results.push(item);
        }
    })
    return results;
}
function searchByTime(min, max, array) {
    let results = [];
    array.forEach(item => {
        if(item.departureTime >= min && item.departureTime <= max) {
            results.push(item);
        }
    })
    return results;
}

