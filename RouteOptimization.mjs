
    const employees = [
      { name: 'Coroado', latitude: -3.105909713309351, longitude:-59.9805596328994 },
      { name: 'Av Codajás', latitude: -3.1198002157200477,longitude: -60.00569416305016 },
      { name: 'Amor aos Pedaços', latitude: -3.0999995684123403,longitude: -60.00956843965123 },
      { name: 'R. Dr. Castro e Costa', latitude: -3.1041229956175806,longitude: -59.99109569384656 },
      { name: 'R. Benjamin Constant', latitude: -3.113164808435121, longitude:-59.99676051878162 },
      { name: 'Denso', latitude: -3.1191640730036774, longitude:-59.97573200033794 }]
    

  
    const b = [1,0,3,6,5,4]

    //change the order of employees array to match the order of the b array
    const c = b.map((item) => {
      return employees[item]
    })

    console.log(c)