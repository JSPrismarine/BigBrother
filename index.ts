import mc from 'minecraft-protocol';
import data from 'minecraft-data';

export default class PluginBase {
    api: any;
    server?: mc.Server;
    data;

    constructor(api: any) {
        this.api = api;
        this.data = data('1.16.3');
    }

    public async onStart() {
        this.server = mc.createServer({
            'online-mode': true,
            host: '0.0.0.0',
            port: 25565,
            version: '1.16.3',
            motd: 'Hello World!'
        });

        this.server.on('login', (client) => {});
    }
    public async onExit() {
        this.server?.close();
    }
}
