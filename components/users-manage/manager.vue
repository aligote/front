<script>
function bytes(bytes, decimals, kib, maxunit) {
	kib = kib || false;
	if (bytes === 0) return '0 B';
	if (Number.isNaN(parseFloat(bytes)) && !Number.isFinite(bytes)) return 'NaN';
	const k = kib ? 1024 : 1000;
	const dm = decimals != null && !Number.isNaN(decimals) && decimals >= 0 ? decimals : 2;
	const sizes = kib ? ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB', 'BiB'] : ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB'];
	let i = Math.floor(Math.log(bytes) / Math.log(k));
	if (maxunit !== undefined) {
		const index = sizes.indexOf(maxunit);
		if (index !== -1) i = index;
	}
	//  eslint-disable-next-line no-restricted-properties
	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
export default {
    data() {
        return {
             
        authenticated: true,
            authenticating: false,
                password: true,
                    requiresPassword: null,
                        clients: null,
                            clientsPersist: { },
        clientDelete: null,
            clientCreate: null,
                clientCreateName: '',
                    clientSessionEnd: null,
                        clientEditName: null,
                            clientEditNameId: null,
                                clientEditAddress: null,
                                    clientEditAddressId: null,
                                        expirationDate: null,
                                            qrcode: null,
                                                currentRelease: null,
                                                    latestRelease: null,

                                                        chartOptions: {
            chart: {
                background: 'transparent',
                    type: 'bar',
                        stacked: false,
                            toolbar: {
                    show: false,
			},
                animations: {
                    enabled: false,
			},
            },
            colors: [
                '#DDDDDD', // rx
                '#EEEEEE', // tx
            ],
                dataLabels: {
                enabled: false,
		},
            plotOptions: {
                bar: {
                    horizontal: false,
			},
            },
            xaxis: {
                labels: {
                    show: false,
			},
                axisTicks: {
                    show: true,
			},
                axisBorder: {
                    show: true,
			},
            },
            yaxis: {
                labels: {
                    show: false,
			},
                min: 0,
		},
            tooltip: {
                enabled: false,
		},
            legend: {
                show: false,
		},
            grid: {
                show: false,
                    padding: {
                    left: -10,
                        right: 0,
                            bottom: -15,
                                top: -15,
			},
                column: {
                    opacity: 0,
			},
                xaxis: {
                    lines: {
                        show: false,
				},
                },
            },
        }
        }
       
    },


    methods: {
        dateTime: value => {
            return new Intl.DateTimeFormat(undefined, {
                year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric',
            }).format(value)
        },
        async refresh({
            updateCharts = false,
        } = {}) {
            if (!this.authenticated) return;

            const clients = await this.api.getClients()
            this.clients = clients.map(client => {
                if (client.name.includes('@') && client.name.includes('.')) {
                    client.avatar = `https://www.gravatar.com/avatar/${md5(client.name)}?d=blank`;
                }
                if (!this.clientsPersist[client.id]) {
                    this.clientsPersist[client.id] = {};
                    this.clientsPersist[client.id].transferRxHistory = Array(50).fill(0);
                    this.clientsPersist[client.id].transferRxPrevious = client.transferRx;
                    this.clientsPersist[client.id].transferTxHistory = Array(50).fill(0);
                    this.clientsPersist[client.id].transferTxPrevious = client.transferTx;
                }

                // Debug
                // client.transferRx = this.clientsPersist[client.id].transferRxPrevious + Math.random() * 1000;
                // client.transferTx = this.clientsPersist[client.id].transferTxPrevious + Math.random() * 1000;

                if (updateCharts) {
                    this.clientsPersist[client.id].transferRxCurrent = client.transferRx - this.clientsPersist[client.id].transferRxPrevious;
                    this.clientsPersist[client.id].transferRxPrevious = client.transferRx;
                    this.clientsPersist[client.id].transferTxCurrent = client.transferTx - this.clientsPersist[client.id].transferTxPrevious;
                    this.clientsPersist[client.id].transferTxPrevious = client.transferTx;

                    this.clientsPersist[client.id].transferRxHistory.push(this.clientsPersist[client.id].transferRxCurrent);
                    this.clientsPersist[client.id].transferRxHistory.shift();

                    this.clientsPersist[client.id].transferTxHistory.push(this.clientsPersist[client.id].transferTxCurrent);
                    this.clientsPersist[client.id].transferTxHistory.shift();
                }

                client.transferTxCurrent = this.clientsPersist[client.id].transferTxCurrent;
                client.transferRxCurrent = this.clientsPersist[client.id].transferRxCurrent;

                client.transferTxHistory = this.clientsPersist[client.id].transferTxHistory;
                client.transferRxHistory = this.clientsPersist[client.id].transferRxHistory;
                client.transferMax = Math.max(...client.transferTxHistory, ...client.transferRxHistory);

                client.hoverTx = this.clientsPersist[client.id].hoverTx;
                client.hoverRx = this.clientsPersist[client.id].hoverRx;

                return client;
            });
        },
        login(e) {
            e.preventDefault();

            if (!this.password) return;
            if (this.authenticating) return;

            this.authenticating = true;
            this.api.createSession({
                password: this.password,
            })
                .then(async () => {
                    const session = await this.api.getSession();
                    this.authenticated = session.authenticated;
                    this.requiresPassword = session.requiresPassword;
                    return this.refresh();
                })
                .catch(err => {
                    alert(err.message || err.toString());
                })
                .finally(() => {
                    this.authenticating = false;
                    this.password = null;
                });
        },
        logout(e) {
            e.preventDefault();

            this.api.deleteSession()
                .then(() => {
                    this.authenticated = false;
                    this.clients = null;
                })
                .catch(err => {
                    alert(err.message || err.toString());
                });
        },
        createClient() {
            const name = this.clientCreateName;
            if (!name) return;
            const clientEnd = new Date(this.clientSessionEnd)
            this.api.createClient({ name, clientEnd })
                .catch(err => alert(err.message || err.toString()))
                .finally(() => this.refresh().catch(console.error));
        },
        deleteClient(client) {
            this.api.deleteClient({ clientId: client.id })
                .catch(err => alert(err.message || err.toString()))
                .finally(() => this.refresh().catch(console.error));
        },
        enableClient(client) {
            this.api.enableClient({ clientId: client.id })
                .catch(err => alert(err.message || err.toString()))
                .finally(() => this.refresh().catch(console.error));
        },
        disableClient(client) {
            this.api.disableClient({ clientId: client.id })
                .catch(err => alert(err.message || err.toString()))
                .finally(() => this.refresh().catch(console.error));
        },
        updateClientName(client, name) {
            this.api.updateClientName({ clientId: client.id, name })
                .catch(err => alert(err.message || err.toString()))
                .finally(() => this.refresh().catch(console.error));
        },
        updateClientAddress(client, address) {
            this.api.updateClientAddress({ clientId: client.id, address })
                .catch(err => alert(err.message || err.toString()))
                .finally(() => this.refresh().catch(console.error));
        },
        setExpirationDate(period) {
            let today = new Date()
            let nextMonth = new Date()
            nextMonth.setMonth(nextMonth.getMonth() + period);
            let year = nextMonth.getFullYear();
            let month = nextMonth.getMonth() + 1;
            let day = nextMonth.getDate();

            if (month < 10) {
                month = '0' + month;
            }

            if (day < 10) {
                day = '0' + day;
            }
            this.clientSessionEnd = `${year}-${month}-${day}`
            // console.log(`Сегодня: ${today}`);
            // console.log(`Дата через ${period}: ${nextMonth}`);
        }
    },
    filters: {
        bytes,
        timeago: value => {
            return timeago().format(value);
        },
    },
    async mounted() {

        this.api = new API();
        //   const cl = await this.api.getClients()
        //   cl.forEach(el => {
        //   if (el.dataEnd < el.createdAt) {
        //  this.api.deleteClient({ clientId: el.id }).catch(err => alert(err.message || err.toString()))
        //  .finally(() => this.refresh().catch(console.error))
        //   }
        // })
        this.api.getSession()
            .then(session => {
                this.authenticated = session.authenticated;
                this.requiresPassword = session.requiresPassword;
                this.refresh({
                    updateCharts: true,
                }).catch(err => {
                    alert(err.message || err.toString());
                });
            })
            .catch(err => {
                alert(err.message || err.toString());
            });
        setInterval(() => {
            this.refresh({
                updateCharts: true,
            }).catch(console.error);
        }, 5000);
        /**
            Promise.resolve().then(async () => {
              const currentRelease = await this.api.getRelease();
              const latestRelease = await fetch('https://weejewel.github.io/wg-easy/changelog.json')
                .then(res => res.json())
                .then(releases => {
                  const releasesArray = Object.entries(releases).map(([version, changelog]) => ({
                    version: parseInt(version, 10),
                    changelog,
                  }));
                  releasesArray.sort((a, b) => {
                    return b.version - a.version;
                  });
    
                  return releasesArray[0];
                });
    
              console.log(`Current Release: ${currentRelease}`);
              console.log(`Latest Release: ${latestRelease.version}`);
    
              if (currentRelease >= latestRelease.version) return;
    
              this.currentRelease = currentRelease;
              this.latestRelease = latestRelease;
            }).catch(console.error);
            */
    }
}
</script>
<template>
    <div id="app">

        <div v-cloak class="container mx-auto max-w-3xl px-5 md:px-0">
    
          <div v-if="authenticated === true">
            <span v-if="requiresPassword"
              class="text-sm text-gray-400 dark:text-neutral-400 mb-10 mr-2 mt-3 cursor-pointer hover:underline float-right"
              @click="logout">
              {{$t("logout")}}
    
              <svg class="h-3 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </span>
            <h1 class="text-4xl dark:text-neutral-200 font-medium mt-2 mb-2">
              <img src="./img/logo.png" width="32" class="inline align-middle dark:bg" />
              <span class="align-middle">WireGuard</span>
            </h1>
            <h2 class="text-sm text-gray-400 dark:text-neutral-400 mb-10"></h2>
    
    
            <div class="shadow-md rounded-lg bg-white dark:bg-neutral-700 overflow-hidden">
              <div class="flex flex-row flex-auto items-center p-3 px-5 border-b-2 border-gray-100 dark:border-neutral-600">
                <div class="flex-grow">
                  <p class="text-2xl font-medium dark:text-neutral-200"></p>
                </div>
                <div class="flex-shrink-0">
                  <button @click="clientCreate = true; clientCreateName = '';"
                    class="hover:bg-red-800 hover:border-red-800 hover:text-white text-gray-700 dark:text-neutral-200 border-2 border-gray-100 dark:border-neutral-600 py-2 px-4 rounded inline-flex items-center transition">
                    <svg class="w-4 mr-2" inline xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span class="text-sm">{{$t("new")}}</span>
                  </button>
                </div>
              </div>
    
              <div>
                <!-- Client -->
                <div v-if="clients && clients.length > 0" v-for="client in clients" :key="client.id"
                  class="relative overflow-hidden border-b last:border-b-0 border-gray-100 dark:border-neutral-600 border-solid">
    
                  <!-- Chart -->
                  <div class="absolute z-0 bottom-0 left-0 right-0" style="top: 60%;">
                    <!-- <apexchart width="100%" height="100%" :options="client.chartOptions" :series="client.transferTxSeries">
                    </apexchart> -->
                  </div>
                  <div class="absolute z-0 top-0 left-0 right-0" style="bottom: 60%;">
                    <!-- <apexchart width="100%" height="100%" :options="client.chartOptions" :series="client.transferRxSeries"
                      style="transform: scaleY(-1);">
                    </apexchart> -->
                  </div>
                  <div class="relative p-5 z-10 flex flex-col md:flex-row justify-between">
                    <div class="flex items-center pb-2 md:pb-0">
                      <div class="h-10 w-10 mr-5 rounded-full bg-gray-50 relative">
                        <svg class="w-6 m-2 text-gray-300" xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clip-rule="evenodd" />
                        </svg>
                        <img v-if="client.avatar" :src="client.avatar" class="w-10 rounded-full absolute top-0 left-0" />
    
                        <div
                          v-if="client.latestHandshakeAt && ((new Date() - new Date(client.latestHandshakeAt) < 1000 * 60 * 10))">
                          <div
                            class="animate-ping w-4 h-4 p-1 bg-red-100 dark:bg-red-100 rounded-full absolute -bottom-1 -right-1">
                          </div>
                          <div class="w-2 h-2 bg-red-800 dark:bg-red-600 rounded-full absolute bottom-0 right-0"></div>
                        </div>
                      </div>
    
                      <div class="flex-grow">
    
                        <!-- Name -->
                        <div class="text-gray-700 dark:text-neutral-200 group"
                          :title="$t('createdOn') + dateTime(new Date(client.createdAt))">
    
                          <!-- Show -->
                          <input v-show="clientEditNameId === client.id" v-model="clientEditName"
                            v-on:keyup.enter="updateClientName(client, clientEditName); clientEditName = null; clientEditNameId = null;"
                            v-on:keyup.escape="clientEditName = null; clientEditNameId = null;"
                            :ref="'client-' + client.id + '-name'"
                            class="rounded px-1 border-2 dark:bg-neutral-700 border-gray-100 dark:border-neutral-600 focus:border-gray-200 dark:focus:border-neutral-500 dark:placeholder:text-neutral-500 outline-none w-30" />
                          <span v-show="clientEditNameId !== client.id"
                            class="inline-block border-t-2 border-b-2 border-transparent">{{client.name}}</span>
    
                          <!-- Edit -->
                          <span v-show="clientEditNameId !== client.id"
                            @click="clientEditName = client.name; clientEditNameId = client.id; setTimeout(() => $refs['client-' + client.id + '-name'][0].select(), 1);"
                            class="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg xmlns="http://www.w3.org/2000/svg"
                              class="h-4 w-4 inline align-middle opacity-25 hover:opacity-100" fill="none"
                              viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </span>
                        </div>
    
                        <!-- Info -->
                        <div class="text-gray-400 dark:text-neutral-400 text-xs">
    
                          <!-- Address -->
                          <span class="group block md:inline-block pb-1 md:pb-0">
    
                            <!-- Show -->
                            <input v-show="clientEditAddressId === client.id" v-model="clientEditAddress"
                              v-on:keyup.enter="updateClientAddress(client, clientEditAddress); clientEditAddress = null; clientEditAddressId = null;"
                              v-on:keyup.escape="clientEditAddress = null; clientEditAddressId = null;"
                              :ref="'client-' + client.id + '-address'"
                              class="rounded border-2 dark:bg-neutral-700 border-gray-100 dark:border-neutral-600 focus:border-gray-200 dark:focus:border-neutral-500 outline-none w-20 text-black dark:text-neutral-300 dark:placeholder:text-neutral-500" />
                            <span v-show="clientEditAddressId !== client.id"
                              class="inline-block border-t-2 border-b-2 border-transparent">{{client.address}}</span>
    
                            <!-- Edit -->
                            <span v-show="clientEditAddressId !== client.id"
                              @click="clientEditAddress = client.address; clientEditAddressId = client.id; setTimeout(() => $refs['client-' + client.id + '-address'][0].select(), 1);"
                              class="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                              <svg xmlns="http://www.w3.org/2000/svg"
                                class="h-4 w-4 inline align-middle opacity-25 hover:opacity-100" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </span>
                          </span>
    
                          <!-- Transfer TX -->
                          <span v-if="client.transferTx" :title="$t('totalDownload') + bytes(client.transferTx)">
                            ·
                            <svg class="align-middle h-3 inline" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                              fill="currentColor">
                              <path fill-rule="evenodd"
                                d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
                                clip-rule="evenodd" />
                            </svg>
                            {{client.transferTxCurrent | bytes}}/s
                          </span>
    
                          <!-- Transfer RX -->
                          <span v-if="client.transferRx" :title="$t('totalUpload') + bytes(client.transferRx)">
                            ·
                            <svg class="align-middle h-3 inline" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                              fill="currentColor">
                              <path fill-rule="evenodd"
                                d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                                clip-rule="evenodd" />
                            </svg>
                            {{client.transferRxCurrent | bytes}}/s
                          </span>
    
                          <!-- Last seen -->
                          <span v-if="client.latestHandshakeAt"
                            :title="$t('lastSeen') + dateTime(new Date(client.latestHandshakeAt))">
                            · {{new Date(client.latestHandshakeAt) | timeago}}
                          </span>
                        </div>
                      </div>
                    </div>
    
                    <div class="flex items-center justify-end">
                      <div class="text-gray-400 dark:text-neutral-400 flex gap-1 items-center justify-between">
    
                        <!-- Enable/Disable -->
                        <div @click="disableClient(client)" v-if="client.enabled === true" :title="$t('disableClient')"
                          class="inline-block align-middle rounded-full w-10 h-6 mr-1 bg-red-800 cursor-pointer hover:bg-red-700 transition-all">
                          <div class="rounded-full w-4 h-4 m-1 ml-5 bg-white"></div>
                        </div>
    
                        <div @click="enableClient(client)" v-if="client.enabled === false" :title="$t('enableClient')"
                          class="inline-block align-middle rounded-full w-10 h-6 mr-1 bg-gray-200 dark:bg-neutral-400 cursor-pointer hover:bg-gray-300 dark:hover:bg-neutral-500 transition-all">
    
                          <div class="rounded-full w-4 h-4 m-1 bg-white"></div>
                        </div>
    
                        <!-- Show QR-->
    
                        <button
                          class="align-middle bg-gray-100 dark:bg-neutral-600 dark:text-neutral-300 hover:bg-red-800 dark:hover:bg-red-800 hover:text-white dark:hover:text-white p-2 rounded transition"
                          :title="$t('showQR')" @click="qrcode = `./api/wireguard/client/${client.id}/qrcode.svg`">
                          <svg class="w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                          </svg>
                        </button>
    
                        <!-- Download Config -->
                        <a :href="'./api/wireguard/client/' + client.id + '/configuration'" download
                          class="align-middle inline-block bg-gray-100 dark:bg-neutral-600 dark:text-neutral-300 hover:bg-red-800 dark:hover:bg-red-800 hover:text-white dark:hover:text-white p-2 rounded transition"
                          :title="$t('downloadConfig')">
                          <svg class="w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </a>
    
                        <!-- Delete -->
    
                        <button
                          class="align-middle bg-gray-100 dark:bg-neutral-600 dark:text-neutral-300 hover:bg-red-800 dark:hover:bg-red-800 hover:text-white dark:hover:text-white p-2 rounded transition"
                          :title="$t('deleteClient')" @click="clientDelete = client">
                          <svg class="w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clip-rule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
    
                  </div>
    
                </div>
                <div v-if="clients && clients.length === 0">
                  <p class="text-center m-10 text-gray-400 dark:text-neutral-400 text-sm">
                    {{$t("noClients")}}<br /><br />
                    <button @click="clientCreate = true; clientCreateName = '';"
                      class="bg-red-800 hover:bg-red-700 text-white border-2 border-none py-2 px-4 rounded inline-flex items-center transition">
                      <svg class="w-4 mr-2" inline xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span class="text-sm">{{$t("newClient")}}</span>
                    </button>
                  </p>
                </div>
                <div v-if="clients === null" class="text-gray-200 dark:text-red-300 p-5">
                  <svg class="w-5 animate-spin mx-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                    fill="currentColor">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                  </svg>
                </div>
              </div>
            </div>
    
            <!-- QR Code-->
            <div v-if="qrcode">
              <div class="bg-black bg-opacity-50 fixed top-0 right-0 left-0 bottom-0 flex items-center justify-center z-20">
                <div class="bg-white rounded-md shadow-lg relative p-8">
                  <button @click="qrcode = null"
                    class="absolute right-4 top-4 text-gray-600 dark:text-neutral-500 hover:text-gray-800 dark:hover:text-neutral-700">
                    <svg class="w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <img :src="qrcode" />
                </div>
              </div>
            </div>
    
            <!-- Create Dialog -->
            <div v-if="clientCreate" class="fixed z-10 inset-0 overflow-y-auto">
              <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <!--
            Background overlay, show/hide based on modal state.
    
            Entering: "ease-out duration-300"
              From: "opacity-0"
              To: "opacity-100"
            Leaving: "ease-in duration-200"
              From: "opacity-100"
              To: "opacity-0"
          -->
                <div class="fixed inset-0 transition-opacity" aria-hidden="true">
                  <div class="absolute inset-0 bg-gray-500 dark:bg-black opacity-75 dark:opacity-50"></div>
                </div>
    
                <!-- This element is to trick the browser into centering the modal contents. -->
                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <!--
            Modal panel, show/hide based on modal state.
    
            Entering: "ease-out duration-300"
              From: "opacity-0 tranneutral-y-4 sm:tranneutral-y-0 sm:scale-95"
              To: "opacity-100 tranneutral-y-0 sm:scale-100"
            Leaving: "ease-in duration-200"
              From: "opacity-100 tranneutral-y-0 sm:scale-100"
              To: "opacity-0 tranneutral-y-4 sm:tranneutral-y-0 sm:scale-95"
          -->
                <div
                  class="inline-block align-bottom bg-white dark:bg-neutral-700 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full"
                  role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                  <div class="bg-white dark:bg-neutral-700 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                      <div
                        class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-800 sm:mx-0 sm:h-10 sm:w-10">
                        <svg class="h-6 w-6 text-white" inline xmlns="http://www.w3.org/2000/svg"
                          fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <div class="flex-grow mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-neutral-200" id="modal-headline">
                          {{$t("newClient")}}
                        </h3>
                        <div class="mt-2">
                          <p class="text-sm text-gray-500">
                            <input
                              class="rounded p-2 border-2 dark:bg-neutral-700 dark:text-neutral-200 border-gray-100 dark:border-neutral-600 focus:border-gray-200 focus:dark:border-neutral-500 dark:placeholder:text-neutral-400 outline-none w-full"
                              type="text" v-model.trim="clientCreateName" :placeholder="$t('name')" />
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="bg-gray-50 dark:bg-neutral-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button v-if="clientCreateName.length" type="button" @click="createClient(); clientCreate = null"
                      class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-800 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
                      {{$t("create")}}
                    </button>
                    <button v-else type="button"
                      class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-200 dark:bg-neutral-400 text-base font-medium text-white dark:text-neutral-300 sm:ml-3 sm:w-auto sm:text-sm cursor-not-allowed">
                      {{$t("create")}}
                    </button>
                    <button type="button" @click="clientCreate = null"
                      class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-neutral-500 shadow-sm px-4 py-2 bg-white dark:bg-neutral-500 text-base font-medium text-gray-700 dark:text-neutral-50 hover:bg-gray-50 dark:hover:bg-neutral-600 dark:hover:border-neutral-600 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                      {{$t("cancel")}}
                    </button>
                  </div>
                </div>
              </div>
            </div>
    
            <!-- Delete Dialog -->
            <div v-if="clientDelete" class="fixed z-10 inset-0 overflow-y-auto">
              <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <!--
            Background overlay, show/hide based on modal state.
    
            Entering: "ease-out duration-300"
              From: "opacity-0"
              To: "opacity-100"
            Leaving: "ease-in duration-200"
              From: "opacity-100"
              To: "opacity-0"
          -->
                <div class="fixed inset-0 transition-opacity" aria-hidden="true">
                  <div class="absolute inset-0 bg-gray-500 dark:bg-black opacity-75 dark:opacity-50"></div>
                </div>
    
                <!-- This element is to trick the browser into centering the modal contents. -->
                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <!--
            Modal panel, show/hide based on modal state.
    
            Entering: "ease-out duration-300"
              From: "opacity-0 tranneutral-y-4 sm:tranneutral-y-0 sm:scale-95"
              To: "opacity-100 tranneutral-y-0 sm:scale-100"
            Leaving: "ease-in duration-200"
              From: "opacity-100 tranneutral-y-0 sm:scale-100"
              To: "opacity-0 tranneutral-y-4 sm:tranneutral-y-0 sm:scale-95"
          -->
                <div
                  class="inline-block align-bottom bg-white dark:bg-neutral-700 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full"
                  role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                  <div class="bg-white dark:bg-neutral-700 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                      <div
                        class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <!-- Heroicon name: outline/exclamation -->
                        <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                          stroke="currentColor" aria-hidden="true">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-neutral-200" id="modal-headline">
                          {{$t("deleteClient")}}
                        </h3>
                        <div class="mt-2">
                          <p class="text-sm text-gray-500 dark:text-neutral-300">
                            {{$t("deleteDialog1")}} <strong>{{clientDelete.name}}</strong>? {{$t("deleteDialog2")}}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="bg-gray-50 dark:bg-neutral-600 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button type="button" @click="deleteClient(clientDelete); clientDelete = null"
                      class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 dark:bg-red-600 text-base font-medium text-white dark:text-white hover:bg-red-700 dark:hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
                      {{$t("deleteClient")}}
                    </button>
                    <button type="button" @click="clientDelete = null"
                      class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-neutral-500 shadow-sm px-4 py-2 bg-white dark:bg-neutral-500 text-base font-medium text-gray-700 dark:text-neutral-50 hover:bg-gray-50 dark:hover:bg-neutral-600 dark:hover:border-neutral-600 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                      {{$t("cancel")}}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
    
          <div v-if="authenticated === false">
            <h1 class="text-4xl font-medium my-16 text-gray-700 dark:text-neutral-200 text-center">
              <img src="./img/logo.png" width="32" class="inline align-middle dark:bg" />
              <span class="align-middle">WireGuard</span>
            </h1>
    
            <form @submit="login"
              class="shadow rounded-md bg-white dark:bg-neutral-700 mx-auto w-64 p-5 overflow-hidden mt-10">
              <!-- Avatar -->
              <div class="h-20 w-20 mb-10 mt-5 mx-auto rounded-full bg-red-800 dark:bg-red-800 relative overflow-hidden">
                <svg class="w-10 h-10 m-5 text-white dark:text-white" xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                </svg>
              </div>
    
              <input type="password" name="password" :placeholder="$t('password')" v-model="password"
                class="px-3 py-2 text-sm dark:bg-neutral-700 text-gray-500 dark:text-gray-500 mb-5 border-2 border-gray-100 dark:border-neutral-800 rounded-lg w-full focus:border-red-800 dark:focus:border-red-800 dark:placeholder:text-neutral-400 outline-none" />
    
              <button v-if="authenticating"
                class="bg-red-800 dark:bg-red-800 w-full rounded shadow py-2 text-sm text-white dark:text-white cursor-not-allowed">
                <svg class="w-5 animate-spin mx-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                  fill="currentColor">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
              </button>
              <input v-if="!authenticating && password" type="submit"
                class="bg-red-800 dark:bg-red-800 w-full rounded shadow py-2 text-sm text-white dark:text-white hover:bg-red-700 dark:hover:bg-red-700 transition cursor-pointer"
                :value="$t('signIn')">
              <input v-if="!authenticating && !password" type="submit"
                class="bg-gray-200 dark:bg-neutral-800 w-full rounded shadow py-2 text-sm text-white dark:text-white cursor-not-allowed"
                :value="$t('signIn')">
            </form>
          </div>
    
          <div v-if="authenticated === null" class="text-gray-300 dark:text-red-300 pt-24 pb-12">
    
            <svg class="w-5 animate-spin mx-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              fill="currentColor">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
    
          </div>
    
        </div>
    
    
      </div>
</template>
