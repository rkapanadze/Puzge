export enum ProductType {
  PUZZLE = 'puzzle',
  BOARDGAME = 'boardgame',
  CARDGAME = 'cardgame'
}
export function getProductTypeDisplayText(type: ProductType): { en: string, ka: string } {
  switch (type) {
    case ProductType.PUZZLE:
      return { en: 'Puzzle', ka: 'პაზლი' };
    case ProductType.BOARDGAME:
      return { en: 'Board Game', ka: 'სამაგიდო თამაში' };
    case ProductType.CARDGAME:
      return { en: 'Card Game', ka: 'ბანქოს თამაში' };
    default:
      return { en: 'Unknown', ka: 'უცნობი' };
  }
}
