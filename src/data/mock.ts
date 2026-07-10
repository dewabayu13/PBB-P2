import { House, Taxpayer, User } from '../types';

export const currentUser: User = {
  id: 'u1',
  name: 'Personal Admin',
  role: 'ADMIN',
};

// Center of a hypothetical village in Java (e.g., somewhere in Yogyakarta)
export const VILLAGE_CENTER = { lat: -7.7956, lng: 110.3695 };

export const mockHouses: House[] = [
  { id: 'H-321217001404100180', lat: -7.795100, lng: 110.368500 },
  { id: 'H-321217001404200420', lat: -7.794200, lng: 110.369100 },
  { id: 'H-321217001404200600', lat: -7.796300, lng: 110.370200 },
  { id: 'H-321217001404200610', lat: -7.795400, lng: 110.371300 },
  { id: 'H-321217001404300250', lat: -7.797500, lng: 110.368400 },
  { id: 'H-321217001404400010', lat: -7.796600, lng: 110.367500 },
  { id: 'H-321217001404400020', lat: -7.794700, lng: 110.366600 },
  { id: 'H-321217001404400060', lat: -7.793800, lng: 110.368700 },
  { id: 'H-321217001404400070', lat: -7.795900, lng: 110.365800 },
  { id: 'H-321217001404400080', lat: -7.798000, lng: 110.369900 },
  { id: 'H-321217001404400090', lat: -7.797100, lng: 110.372000 },
  { id: 'H-321217001404400110', lat: -7.795200, lng: 110.373100 },
  { id: 'H-321217001404400140', lat: -7.794300, lng: 110.374200 },
  { id: 'H-321217001404400840', lat: -7.793400, lng: 110.371300 },
  { id: 'H-321217001404400900', lat: -7.796500, lng: 110.370400 },
  { id: 'H-321217001404400910', lat: -7.798600, lng: 110.367500 },
  { id: 'H-321217001404401030', lat: -7.792700, lng: 110.368600 },
  { id: 'H-321217001404401090', lat: -7.791800, lng: 110.369700 },
  { id: 'H-321217001404500030', lat: -7.797900, lng: 110.365800 },
  { id: 'H-321217001404500040', lat: -7.798100, lng: 110.366900 },
  { id: 'H-321217001404500180', lat: -7.799200, lng: 110.368000 },
  { id: 'H-321217001404500020', lat: -7.794300, lng: 110.365100 },
  { id: 'H-321217001404500060', lat: -7.795400, lng: 110.364200 },
  { id: 'H-321217001404500070', lat: -7.796500, lng: 110.363300 },
  { id: 'H-321217001404500080', lat: -7.793600, lng: 110.367400 }
];

const createTaxpayer = (id: string, name: string, landArea: number, taxAmount: number, status: any = 'NOT_VISITED'): Taxpayer => ({
  id,
  name,
  address: 'Sesuai SPPT',
  village: 'Sukamaju',
  hamlet: 'Karanglo',
  rt: '01',
  rw: '01',
  block: 'A',
  landArea,
  buildingArea: 0,
  taxAmount,
  phone: '-',
  status,
  houseId: `H-${id}`
});

export const mockTaxpayers: Taxpayer[] = [
  createTaxpayer('321217001404100180', 'KATINI', 127, 50927, 'PAID'),
  createTaxpayer('321217001404200420', 'IPONG RASIDI', 4391, 226137, 'PAID'),
  createTaxpayer('321217001404200600', 'KUSMINI / DANA', 1400, 72100, 'UNPAID'),
  createTaxpayer('321217001404200610', 'ACEM KASEM LASIH', 1400, 72100),
  createTaxpayer('321217001404300250', 'H ANTO SUHARYANTO, SEAK', 1500, 120000),
  createTaxpayer('321217001404400010', 'SUGIARTO', 1400, 1684200, 'UNPAID'),
  createTaxpayer('321217001404400020', 'KASIM MURTI', 1344, 1607075),
  createTaxpayer('321217001404400060', 'AKRIM AMINAH', 167, 20000, 'PAID'),
  createTaxpayer('321217001404400070', 'YULI ASRI APRIYANTI', 188, 20000),
  createTaxpayer('321217001404400080', 'TINAH', 161, 20000),
  createTaxpayer('321217001404400090', 'EKA ADIPURNAMA, AMD', 210, 20000, 'UNPAID'),
  createTaxpayer('321217001404400110', 'NARSIH KURNIASIH', 166, 20000),
  createTaxpayer('321217001404400140', 'YAHIM KURDI', 1548, 79722),
  createTaxpayer('321217001404400840', 'ASTI', 1247, 64221),
  createTaxpayer('321217001404400900', 'SUHARI', 709, 36514, 'PAID'),
  createTaxpayer('321217001404400910', 'RUMINAH SANTARI', 700, 36050),
  createTaxpayer('321217001404401030', 'AKRIM AMINAH', 280, 20000),
  createTaxpayer('321217001404401090', 'SAPTA', 1400, 72100),
  createTaxpayer('321217001404500030', 'KASIM MURTI', 347, 135483),
  createTaxpayer('321217001404500040', 'RAHMAT', 465, 188865),
  createTaxpayer('321217001404500180', 'SAYI', 2759, 275900, 'UNPAID'),
  createTaxpayer('321217001404500020', 'AHMAD SUAWI', 279, 114279),
  createTaxpayer('321217001404500060', 'LIE PHITJEN', 3759, 375900),
  createTaxpayer('321217001404500070', 'LIE PHITJEN', 2530, 253000),
  createTaxpayer('321217001404500080', 'LIE PHITJEN', 4920, 492000)
];
