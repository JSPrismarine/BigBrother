import Packet from '@jsprismarine/raknet/dist/protocol/Packet';
import Player from '../../src/player/Player';
// import type PluginApi from '@jsprismarine/prismarine/dist/src/plugin/api/versions/1.0/PluginApi';
import type PluginApi from '../../src/plugin/api/versions/1.0/PluginApi';
import data from 'minecraft-data';
import mc from 'minecraft-protocol';

class Connection {
    private client;
    constructor(client) {
        this.client = client;
    }

    public kick(message) {
        this.client.end(message);
    }

    public getAddress() {
        return '';
    }

    public sendDataPacket(packet: Packet) {}

    public sendMessage(message: string) {
        this.client.write('chat', { message: JSON.stringify({
            translate: "chat.type.text",
            with: [{
                text: message.split(' ')[0]
            }, {
                text: message.replace(message.split(' ')[0], '')
            }]
        }), position: 0, sender: '0' })
    }
}

export default class PluginBase {
    api!: PluginApi;
    server!: mc.Server;
    data!: any;

    constructor(api: PluginApi) {
        this.api = api;
        this.data = data('1.16.5');
    }

    public async onEnable() {
        this.server = mc.createServer({
            'online-mode': this.api.getServer().getConfig().getOnlineMode(),
            host: this.api.getServer().getConfig().getServerIp(),
            port: 25565,
            version: '1.16.5',
            motd: this.api.getServer().getConfig().getMotd()
        });

        this.server.on('login', (client: any) => {
            client.write('login', {
                entityId: client.id,
                isHardcore: false,
                gameMode: 0,
                previousGameMode: 255,
                worldNames: this.data.loginPacket.worldNames,
                dimensionCodec: this.data.loginPacket.dimensionCodec,
                dimension: this.data.loginPacket.dimension,
                worldName: 'minecraft:overworld',
                hashedSeed: [0, 0],
                maxPlayers: this.server.maxPlayers,
                viewDistance: 10,
                reducedDebugInfo: false,
                enableRespawnScreen: true,
                isDebug: false,
                isFlat: false
            });

            client.write('position', {
                x: 0,
                y: 1.62,
                z: 0,
                yaw: 0,
                pitch: 0,
                flags: 0x00
            });

            const player = new Player(
                null as any,
                this.api.getServer().getWorldManager().getDefaultWorld(),
                this.api.getServer()
            );
            
            // Replacce default connector
            player.playerConnection = new Connection(client) as any;

            player.username.name = client.profile.name;
            player.uuid = 'bb_' + client.profile.uuid;
            player.xuid = 'bb_' + client.profile.xuid;
            this.api.getServer().getPlayerManager().addPlayer('', player);

            client.on('chat', (data) => {
                // TODO:
            });
        });
    }
    public async onDisable() {
        if (this.server) this.server.close();
    }
}
