import { ClientDeck } from "./ClientDeck";
import { ClientPlayer } from "./ClientPlayer";

export interface ClientGame {
  drawDeck: ClientDeck;
  discardDeck: ClientDeck;
  players: Record<string, ClientPlayer>;
  started: boolean;
  playerInTurn: string;
}
