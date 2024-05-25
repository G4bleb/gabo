<script lang="ts">
  import { io } from 'socket.io-client';
  import { ErrorCode } from '@gabo-common/SocketEvents.js';
  import { type ClientGame } from '@gabo-common/ClientGame';
  import { CardValues, type Card } from '@gabo-common/Card';
  import { CardSvgMap } from '$lib/assets/CardSvgMap';
  import { ellipse } from '$lib/ellipse';
  import type { ClientPlayer } from '@gabo-common/ClientPlayer';

  export const socket = io('ws://localhost:8080');
  export let socketID: string | null = null;
  export let nickname = '';
  export let roomcode = 'a';
  export let game: ClientGame | null = null;
  export let ingame = false;

  export let innerWidth = 0;
  export let innerHeight = 0;

  $: currentPlayerIndex = game ? Object.keys(game.players).findIndex((name: string) => name === nickname) : 0;
  let cardPositions: { top: number; left: number }[];
  $: cardPositions = game ? ellipse(Object.keys(game.players).length, innerWidth / 3, innerHeight / 3, currentPlayerIndex) : [];

  function joinGame() {
    console.log(nickname, roomcode);
    socket.emit('addPlayer', nickname, roomcode, (result: ErrorCode, message: string, eventGame: ClientGame | null) => {
      if (result == ErrorCode.Success) {
        ingame = true;
        game = eventGame;
        registerGameEvents();
      } else {
        console.error('addPlayer was not successful');
        console.error(message);
        ingame = false;
      }
    });
  }

  function registerGameEvents() {
    socket.on('playerConnected', (playerName: string, player: ClientPlayer) => {
      console.log('playerConnected', player);
      if (!game) {
        throw new Error('playerConnected: game is null');
      }
      game.players[playerName] = player;
      console.log(game.players);
    });
    socket.on('playerDisconnected', (playerName: string) => {
      console.log('playerDisconnected');
    });
    socket.on('deckShuffled', () => {
      console.log('deckShuffled');
    });
    socket.on('gameStarted', () => {
      console.log('gameStarted');
      game!.started = true;
    });
    socket.on('playerTurn', (playerName: string) => {
      console.log('playerTurn', playerName);
    });
  }

  function startGame() {
    socket.emit('startGame');
  }

  socket.on('connect', () => {
    console.log('connected', socket.id);
    socketID = socket.id as string;
  });
  socket.on('noArg', () => {
    console.log('noArg', socket.id);
  });
  export const sendHello = () => {
    socket.emit('hello');
  };
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<div class="text-center">
  {#if ingame && game}
    <div class="">
      <div
        id="gameboard"
        style:width={`${innerWidth / 1.5}px`}
        style:height={`${innerHeight / 1.5}px`}
        class="bg-body-tertiary position-absolute top-50 start-50 translate-middle overflow-visible"
      >
        {#if !game.started}
          <div class="start-button position-absolute top-50 start-50 translate-middle z-2">
            <button type="button" on:click={startGame} class="btn btn-primary">Start game</button>
          </div>
        {/if}
        <div class="decks position-absolute top-50 start-50 translate-middle">
          {#if game.drawDeck.cardOnTop}
            <img id="drawDeck" class="card d-inline" src={CardSvgMap[game.drawDeck.cardOnTop.value]} alt={game.drawDeck.cardOnTop.value} />
          {:else}
            <div class="card-spot d-inline"></div>
          {/if}
          {#if game.discardDeck.cardOnTop}
            <img class="card d-inline" src={CardSvgMap[game.discardDeck.cardOnTop.value]} alt={game.discardDeck.cardOnTop.value} />
          {:else}
            <div class="card-spot d-inline"></div>
          {/if}
        </div>
        {#each Object.entries(game.players) as [playerName, player], index}
          <div class="position-absolute translate-middle" style:top={`${cardPositions[index].top - 28}px`} style:left={`${cardPositions[index].left}px`}>
            <p class="mb-1">{playerName}</p>
            <div class="player-hand container px-0">
              <div class="row row-cols-2 justify-content-center">
                {#each { length: player.handSize } as _}
                  <img class="col card" src={CardSvgMap[CardValues.RED_BACK]} alt={CardValues.RED_BACK} />
                {/each}
              </div>
            </div>
            {#if index === currentPlayerIndex}
              <button type="button" class="btn btn-primary mt-1">Say Gabo</button>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  {:else}
    <form id="login-form" class="m-auto px-2" on:submit|preventDefault={joinGame}>
      <h1 class="h1">Un Gabo ?</h1>
      <input type="text" name="nickname" class="form-control mb-2" placeholder="Nickname" required bind:value={nickname} />
      <input type="text" name="roomcode" class="form-control mb-2" placeholder="Room code" required bind:value={roomcode} />
      <input type="submit" name="join-room" value="Join room" class="btn btn-lg btn-primary btn-block" />
    </form>
    <p class="mt-2 fw-light fs-6">{socketID ?? 'Disconnected'}</p>
  {/if}
  <!-- <button on:click={sendHello}>send hello</button> -->
</div>

<style>
  #login-form {
    display: flex;
    flex-direction: column;
  }
  @media (min-width: 768px) {
    #login-form {
      max-width: 30%;
    }
  }
  #gameboard {
    border-radius: 50%;
  }
  .start-button {
    padding-bottom: 250px;
  }
  .decks .card {
    width: 7.5rem;
  }
  .decks .card-spot {
    padding-left: 7.5rem;
  }
  .player-hand {
    width: 15rem;
  }
  .player-hand .card {
    width: 7.5rem;
    padding: 0px;
  }
  .cursor-pointer {
    cursor: pointer;
  }
</style>
