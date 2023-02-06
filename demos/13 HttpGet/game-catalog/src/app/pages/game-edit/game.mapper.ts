import { Game } from '@/model/game.model';
import { GameVm } from './game.vm';

export const mapGameToVm = (game: Game): GameVm => ({
  name: game.name,
  imageUrl: game.imageUrl ?? '',
  dateRelease: game.dateRelease.toISOString().substring(0, 10),
});

export const mapVmToGame = (gameVm: GameVm): Game =>
  new Game(gameVm.name, gameVm.dateRelease, gameVm.imageUrl);

