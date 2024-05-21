<script lang="ts">
	import { io } from 'socket.io-client';
	import { ErrorCode } from '@gabo-common/SocketEvents.js';
	import {
		type ClientGame,
		type SerializableClientGame,
		deserizalizeClientGame
	} from '@gabo-common/ClientGame';
	import type { Card } from '@gabo-common/Card';
	import { CardSvgMap } from '$lib/assets/CardSvgMap';
	import { ellipse } from '$lib/ellipse';
	import type { ClientPlayer } from '@gabo-common/ClientPlayer';

	export const socket = io('ws://localhost:8080');
	export let cards: Card[] = [{ value: 'KH' }];
	export let socketID: string | null = null;
  //TODO switch this
	export let ingame = true; 
	export let nickname = '';
	export let roomcode = '';
	export let game: ClientGame | null = null;

	//TODO this is for testing, to be integrated
	export let tempPlayers: Map<string, ClientPlayer> = new Map();
	tempPlayers.set('tempPlayer1', { handSize: 1 });
	tempPlayers.set('tempPlayer2', { handSize: 1 });
	tempPlayers.set('tempPlayer3', { handSize: 1 });
	tempPlayers.set('tempPlayer4', { handSize: 1 });
	export let cardPositions: { top: string; left: string }[] = ellipse(tempPlayers.size, 300, 300);
	export let currentPlayerIndex: number = Array.from(tempPlayers.keys()).findIndex(
		(entry: string) => entry === 'tempPlayer3'
	);

	function joinGame() {
		console.log(nickname, roomcode);
		socket.emit(
			'addPlayer',
			nickname,
			roomcode,
			(result: ErrorCode, message: string, serializedGame: SerializableClientGame | null) => {
				if (result == ErrorCode.Success) {
					ingame = true;
					game = deserizalizeClientGame(serializedGame!);
					console.log(game);
				} else {
					console.error('addPlayer was not successful');
					console.error(message);
					ingame = false;
				}
			}
		);
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

<div class="text-center">
	{#if ingame}
		<div class="bg-dark-subtle">
			<div id="gameboard" class="mx-auto">
				{#each tempPlayers.entries() as playerEntry, index}
					<div
						class="position-absolute"
						style:top={cardPositions[(index + currentPlayerIndex) % cardPositions.length].top}
						style:left={cardPositions[(index + currentPlayerIndex) % cardPositions.length].left}
					>
						<p>{playerEntry[0]}</p>
						<img src={CardSvgMap['KH']} />
					</div>
				{/each}
				<!-- <div id="hand">
					{#each cards as card}
						<div>{card.value}</div>
						<img src={CardSvgMap[card.value]} />
					{/each}
				</div> -->
			</div>
		</div>
	{:else}
		<form id="login-form" class="m-auto px-2" on:submit|preventDefault={joinGame}>
			<h1 class="h1">Un Gabo ?</h1>
			<input
				type="text"
				name="nickname"
				class="form-control mb-2"
				placeholder="Nickname"
				required
				bind:value={nickname}
			/>
			<input
				type="text"
				name="roomcode"
				class="form-control mb-2"
				placeholder="Room code"
				required
				bind:value={roomcode}
			/>
			<input
				type="submit"
				name="join-room"
				value="Join room"
				class="btn btn-lg btn-primary btn-block"
			/>
		</form>
	{/if}
	<p class="mt-2 fw-light fs-6">{socketID ?? 'Disconnected'}</p>
</div>

<button on:click={sendHello}>send hello</button>

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
</style>
