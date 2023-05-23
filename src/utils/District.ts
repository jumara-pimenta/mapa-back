import { Employee } from '../entities/employee.entity';
import { AddressComponent } from '../integrations/services/googleService/response/getLocation.response';

export function getZoneFromDistrict(district: string) {
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
    'Vila Buriti',
  ];

  const westZone = [
    'Compensa',
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
    'Vila da Prata',
  ];

  const northZone = [
    'Cidade de Deus',
    'Cidade Nova',
    'Colônia Santo Antônio',
    'Colônia Terra Nova',
    'Lago Azul',
    'Monte das Oliveiras',
    'Nova Cidade',
    'Novo Aleixo',
    'Novo Israel',
    'Santa Etelvina',
  ];

  const eastZone = [
    'Armando Mendes',
    'Colônia Antônio Aleixo',
    'Col Antonio Aleixo',
    'Coroado',
    'Distrito Industrial II',
    'Gilberto Mestrinho',
    'Jorge Teixeira',
    'Mauazinho',
    'Puraquequara',
    'São José Operário',
    'Tancredo Neves',
    'Zumbi dos Palmares',
  ];

  const southCenterZone = [
    'Adrianópolis',
    'Aleixo',
    'Chapada',
    'Flores',
    'Nossa Senhora das Graças',
    'Nossa Sra. das Gracas',
    'Parque 10 de Novembro',
    'São Geraldo',
  ];

  const midwestZone = [
    'Alvorada',
    'Da Paz',
    'Dom Pedro',
    'Planalto',
    'Redenção',
  ];

  if (southZone.includes(district)) return 'Zona Sul';
  if (westZone.includes(district)) return 'Zona Oeste';
  if (northZone.includes(district)) return 'Zona Norte';
  if (eastZone.includes(district)) return 'Zona Leste';
  if (southCenterZone.includes(district)) return 'Zona Centro-Sul';
  if (midwestZone.includes(district)) return 'Zona Centro-Oeste';

  return 'Zona Desconhecida';
}

class Zone {
  name: string;
  employees: string[];
}

export function separateByZone(employees: any[]): Zone[] {
  const bairros = employees.reduce((acc, curr) => {
    const district = getZoneFromDistrict(curr.pins[0].district);

    const index = acc.findIndex((item) => item.name === district);
    if (index === -1) {
      acc.push({ name: district, employees: [curr] });
    }

    if (index !== -1) {
      acc[index].employees.push(curr);
    }

    return acc;
  }, []);

  return bairros;
}

export function separateByDistrict(employees: any[]): Zone[] {
  const bairros = employees.reduce((acc, curr) => {
    const district = curr.pins[0].district;

    const index = acc.findIndex((item) => item.name === district);
    if (index === -1) {
      acc.push({ name: district, employees: [curr.id] });
    }

    if (index !== -1) {
      acc[index].employees.push(curr.id);
    }

    return acc;
  }, []);

  return bairros;
}

export function getDistrictGoogle(addressComponent: AddressComponent[]) {
  const district = addressComponent.find((item) =>
    item.types.includes('sublocality_level_1'),
  );
  if (district) return district.long_name;
  return 'Não identificado';
}
