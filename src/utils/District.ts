export function getZoneFromDistrict(district : string) {
    const southZone = [
        'Betânia',
        'Cachoeirinha',
        'Centro',
        'Colônia Oliveira Machado',
        'Crespo',
        'Distrito Industrial I',
        'Educandos',
        'Japiim',
        'Morro da Liberdade',
        'Nossa Senhora Aparecida',
        'Petrópolis',
        'Praça 14 de Janeiro',
        'Presidente Vargas',
        'Raiz',
        'Santa Luzia',
        'São Francisco',
        'São Lázaro',
        'Vila Buriti'
        ]

    const westZone = ['Compensa',
        'Glória',
        'Lírio do Vale',
        'Nova Esperança',
        'Ponta Negra',
        'Santo Agostinho',
        'Santo Antônio',
        'São Jorge',
        'São Raimundo',
        'Tarumã',
        'Tarumã-Açu',
        'Vila da Prata']

    const northZone = ['Cidade de Deus',
        'Cidade Nova',
        'Colônia Santo Antônio',
        'Colônia Terra Nova',
        'Lago Azul',
        'Monte das Oliveiras',
        'Nova Cidade',
        'Novo Aleixo',
        'Novo Israel',
        'Santa Etelvina'
    ]

    const eastZone = ['Armando Mendes',
        'Colônia Antônio Aleixo',
        'Coroado',
        'Distrito Industrial II',
        'Gilberto Mestrinho',
        'Jorge Teixeira',
        'Mauazinho',
        'Puraquequara',
        'São José Operário',
        'Tancredo Neves',
        'Zumbi dos Palmares']


    const southCenterZone = [
        'Adrianópolis',
        'Aleixo',
        'Chapada',
        'Flores',
        'Nossa Senhora das Graças',
        'Parque 10 de Novembro',
        'São Geraldo'
    ]

    const midwestZone = [
        'Alvorada',
        'Da Paz',
        'Dom Pedro',
        'Planalto',
        'Redenção']

        if(southZone.includes(district))
            return 'Zona Sul'
        if(westZone.includes(district))
            return 'Zona Oeste'
        if(northZone.includes(district))
            return 'Zona Norte'
        if(eastZone.includes(district))
            return 'Zona Leste'
        if(southCenterZone.includes(district))
            return 'Zona Centro-Sul'
        if(midwestZone.includes(district))
            return 'Zona Centro-Oeste'
        
        return 'Zona Desconhecida'

        
        
}