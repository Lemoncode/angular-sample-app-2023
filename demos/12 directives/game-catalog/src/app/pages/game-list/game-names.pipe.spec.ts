import { GameNamesPipe } from './game-names.pipe';

describe('GameNamesPipe', () => {
  it('create an instance', () => {
    const pipe = new GameNamesPipe();
    expect(pipe).toBeTruthy();
  });
});
