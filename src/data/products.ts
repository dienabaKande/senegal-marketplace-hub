import { Product } from '@/types/product';

export const products: Product[] = [
  {
    id: '1',
    name: 'Tissu Wax Traditionnel',
    description: 'Magnifique tissu wax aux motifs traditionnels sénégalais, parfait pour vos créations couture.',
    price: 15000,
    image: '/src/assets/wax-fabric.jpg',
    category: 'tissus',
    stock: 25,
    featured: true
  },
  {
    id: '2',
    name: 'Sculpture en Bois d\'Ébène',
    description: 'Sculpture artisanale en bois d\'ébène représentant un masque traditionnel sénégalais.',
    price: 45000,
    image: '/src/assets/artisanat.jpg',
    category: 'artisanat',
    stock: 8,
    featured: true
  },
  {
    id: '3',
    name: 'Mélange d\'Épices Thiéboudienne',
    description: 'Mélange authentique d\'épices pour préparer le thiéboudienne, plat national du Sénégal.',
    price: 3500,
    image: '/src/assets/wax-fabric.jpg',
    category: 'epices',
    stock: 50
  },
  {
    id: '4',
    name: 'Collier en Perles Africaines',
    description: 'Bijou traditionnel en perles colorées, fabriqué selon les techniques ancestrales.',
    price: 12000,
    image: '/src/assets/artisanat.jpg',
    category: 'bijoux',
    stock: 15,
    featured: true
  },
  {
    id: '5',
    name: 'Tissu Bazin Riche',
    description: 'Tissu bazin de haute qualité, idéal pour les tenues traditionnelles et cérémonies.',
    price: 28000,
    image: '/src/assets/wax-fabric.jpg',
    category: 'tissus',
    stock: 12
  },
  {
    id: '6',
    name: 'Calebasse Sculptée',
    description: 'Calebasse traditionnelle sculptée à la main avec des motifs géométriques sénégalais.',
    price: 8500,
    image: '/src/assets/artisanat.jpg',
    category: 'artisanat',
    stock: 20
  },
  {
    id: '7',
    name: 'Piment de Cayenne Bio',
    description: 'Piment de cayenne cultivé biologiquement au Sénégal, parfait pour relever vos plats.',
    price: 2500,
    image: '/src/assets/wax-fabric.jpg',
    category: 'epices',
    stock: 35
  },
  {
    id: '8',
    name: 'Boucles d\'Oreilles Dorées',
    description: 'Élégantes boucles d\'oreilles en laiton doré avec motifs traditionnels wolof.',
    price: 6500,
    image: '/src/assets/artisanat.jpg',
    category: 'bijoux',
    stock: 22
  }
];