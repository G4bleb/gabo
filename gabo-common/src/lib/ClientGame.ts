import { ClientDeck } from "./ClientDeck";
import { ClientPlayer } from "./ClientPlayer";

export interface ClientGame {
  drawDeck: ClientDeck;
  discardDeck: ClientDeck;
  players: Map<string, ClientPlayer>;
}

export interface SerializableClientGame {
  drawDeck: ClientDeck;
  discardDeck: ClientDeck;
  players: Array<{ key: string; value: ClientPlayer }>;
}

export function deserizalizeClientGame(
  toDeserialize: SerializableClientGame
): ClientGame {
  const playersMap: Map<string, ClientPlayer> = new Map();
  for (const entry of toDeserialize.players) {
    playersMap.set(entry.key, entry.value);
  }
  return {
    drawDeck: toDeserialize.drawDeck,
    discardDeck: toDeserialize.discardDeck,
    players: playersMap,
  };
}
