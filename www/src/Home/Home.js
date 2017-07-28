import Vue from 'vue';

var random = require('random-js')();

class Home {
	constructor(app) {
		this.app = app;
		this.socket = window.tankGame.socket;

		this.makeDom();
		this.initNetworkEvents();
	}

	makeDom() {
		this.vm = new Vue({
			el: "#page",
			data: {
				socket: this.socket,
				loading: false,
				selectedTankId: 1,
				availableTanks: [],
				tankName: "Tanker"+random.integer(1,9999),
				connected: false,
				inGame: false
			},
			mounted() {
				this.fetchAvailableTanks();
			},
			methods: {
				connect() {
					this.socket.emit('gameJoinRequest', {
						id: this.tankName,
						type: this.selectedTankId
					});
				},
				joinBattle() {
					this.connect();
				},
				selectTank(id) {
					this.selectedTankId = id;
				},
				fetchAvailableTanks() {
					this.socket.emit('availableTanksRequest');
				}
			}
		});
	}

	initNetworkEvents() {
		this.socket.on('connect', () => {
			this.vm.connected = true;
			this.app.renderer.backgroundColor = 0xadd8e6;
		});
		this.socket.on('disconnect', () => {
			this.vm.connected = false;
			this.app.renderer.backgroundColor = 0xde7575;
		});
		this.socket.on('availableTanksResponse', (availableTanks) => {
			this.vm.availableTanks = availableTanks;
			window.tankGame.availableTanks = availableTanks;
		});
		this.socket.on('gameJoinAccept', (tank) => {
			this.vm.inGame = true;
		});
		this.socket.on('gameJoinDeny', (data) => {
			this.vm.inGame = false;
			console.log(data.message);
		});

	}
}

export default Home;