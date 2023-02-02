const latln = [{lat: 30, lng :40},{lat: 30, lng :40}]
console.log(latln)

const number = latln.map((item) => {return [item.lat, item.lng]})
console.log(number)