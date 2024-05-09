<script lang="ts">
	import { io } from 'socket.io-client';
	import {
		ResponseCode,
		type ClientToServerEvents,
		type ServerToClientEvents
	} from '@gabo-common/SocketEvents.js';
	import type { Card } from '$lib/Card.js';

	export const socket = io('ws://127.0.0.1:8080');
	// export let cards: Card[] = [];
	export let socketID = '';
	export let ingame = false;
	export let nickname = '';
	export let logincode = '';

	function joinGame() {
		console.log(nickname, logincode);
		socket.emit('addPlayer', nickname, logincode, (result: ResponseCode) => {
			if (result == ResponseCode.Success) {
				ingame = true;
			} else {
				console.error('addPlayer was not successfull');
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

<h1>{socketID}</h1>
{#if ingame}
	<div id="gameboard">
		<div>
			<p>ingame</p>
		</div>
		<!-- <div id="hand">
		{#each cards as card}
			<div>{card.value}</div>
		{/each}
	</div> -->
	</div>
{:else}
	<form id="login-form" on:submit|preventDefault={joinGame}>
		<h1 class="h1">Un Gabo ?</h1>
		<input
			type="text"
			name="nickname"
			class=""
			placeholder="Pseudo"
			required
			bind:value={nickname}
		/>
		<input
			type="text"
			name="logincode"
			class=""
			placeholder="Code de connexion"
			required
			bind:value={logincode}
		/>
		<input type="submit" class="" />
	</form>
{/if}
<button on:click={sendHello}>send hello</button>
