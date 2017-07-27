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
				app: this.app,
				socket: this.socket,
				self: this,
				loading: false,
				selectedTankId: 1,
				availableTanks: [],
				tankName: "Tanker"+random.integer(1,9999),
				connected: false,
				inGame: false
			},
			watch: {
				'connected': function(e) {
					if (e) {
						this.setConnectedBackground();
					} else {
						this.setDisconnectedBackground();
					}
				}
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
				setConnectedBackground() {
					this.app.renderer.backgroundColor = 0xadd8e6;
				},
				setDisconnectedBackground() {
					this.app.renderer.backgroundColor = 0xde7575;
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
		});
		this.socket.on('disconnect', () => {
			this.vm.connected = false;
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