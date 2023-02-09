import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gameNames',
})
export class GameNamesPipe implements PipeTransform {
  transform(value: string[]): string {
    console.log('gameNames pipe se esta ejecutando');
    return value.join(', ');
  }
}
