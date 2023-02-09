import { Game } from '../model/game.model';

export const gameMockCollection = [
  new Game(
    'Super Mario Bros',
    '13 September 2023',
    'https://raw.githubusercontent.com/Lemoncode/angular-sample-app/master/media/super-mario.webp',
    [
      {
        id: 1,
        name: 'Old shop',
        price: 95,
        amount: 2,
        isAvailable: true,
      },
      {
        id: 2,
        name: 'New shop',
        price: 115,
        amount: 1,
        isAvailable: true,
      },
      {
        id: 3,
        name: 'Regular shop',
        price: 135,
        amount: 0,
        isAvailable: false,
      },
    ]
  ),
  new Game(
    'Legend of Zelda',
    '21 February 1986',
    'https://raw.githubusercontent.com/Lemoncode/angular-sample-app/master/media/legend-zelda.webp',
    [
      {
        id: 3,
        name: 'Old shop',
        price: 125,
        amount: 0,
        isAvailable: false,
      },
      {
        id: 4,
        name: 'New shop',
        price: 145,
        amount: 1,
        isAvailable: true,
      },
    ]
  ),
  new Game(
    'Sonic',
    '26 June 1981',
    'https://raw.githubusercontent.com/Lemoncode/angular-sample-app/master/media/sonic-frontiers.webp',
    []
  ),
];
