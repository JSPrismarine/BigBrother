import mc from 'minecraft-protocol';
import data from 'minecraft-data';
import type PluginApi from '@jsprismarine/prismarine/dist/src/plugin/api/versions/1.0/PluginApi';

export default class PluginBase {
    api: PluginApi;
    server?: mc.Server;
    data: data.IndexedData;

    constructor(api: PluginApi) {
        this.api = api;
        this.data = data('1.16.3');
    }

    public async onEnable() {
        this.server = mc.createServer({
            'online-mode': true,
            host: '0.0.0.0',
            port: 25565,
            version: '1.16.3',
            motd: 'Hello World!'
        });

        this.server.on('login', (client: any) => {
            this.api.getLogger().info(client);
        });
    }
    public async onDisable() {
        if (this.server) this.server.close();
    }
}
