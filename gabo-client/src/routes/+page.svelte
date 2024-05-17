<script lang="ts">
	import { io } from 'socket.io-client';
	import {
		ErrorCode,
		type ClientToServerEvents,
		type ServerToClientEvents
	} from '@gabo-common/SocketEvents.js';
	import type { Card } from '$lib/Card.js';
	import { CardSvgMap } from '$lib/assets/CardSvgMap';

	export const socket = io('ws://localhost:8080');
	export let cards: Card[] = [{ value: 'KH' }];
	export let socketID = '';
	export let ingame = false;
	export let nickname = '';
	export let roomcode = '';

	function joinGame() {
		console.log(nickname, roomcode);
		socket.emit('addPlayer', nickname, roomcode, (result: ErrorCode, message: string) => {
			if (result == ErrorCode.Success) {
				ingame = true;
			} else {
				console.error('addPlayer was not successfull');
				console.error(message);
				ingame = false;
			}
		});
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
		<div id="gameboard">
			<div id="hand">
				{#each cards as card}
					<div>{card.value}</div>
					<img src={CardSvgMap[card.value]} />
				{/each}
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
	<p class="mt-2 fw-light fs-6">{socketID}</p>
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
