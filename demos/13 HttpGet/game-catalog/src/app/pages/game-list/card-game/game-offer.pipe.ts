import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gameOffer',
})
export class GameOffer implements PipeTransform {
  transform(value: string | null): string {
    if (value == null) return '';
    const currentYear = new Date().getFullYear();
    return +value >= currentYear ? 'Novedad' : 'Oferta';
  }
}
