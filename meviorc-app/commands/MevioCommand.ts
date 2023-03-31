import {
    IHttp,
    IHttpRequest,
    IModify,
    IRead,
    IMessageBuilder,
    IModifyCreator,
    IPersistence,
} from '@rocket.chat/apps-engine/definition/accessors';
import {
    ISlashCommand,
    SlashCommandContext,
} from '@rocket.chat/apps-engine/definition/slashcommands';
import {IMessage} from '@rocket.chat/apps-engine/definition/messages'
import {IRoom} from '@rocket.chat/apps-engine/definition/rooms'
import {IUser} from '@rocket.chat/apps-engine/definition/users'

export class MevioCommand implements ISlashCommand {
    public command = 'mevio'; // [1]
    public i18nParamsExample = '';
    public i18nDescription = 'Executa uma funcionalidade da plataforma Mevio';
    public providesPreview = false;

    public async executor(
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        http: IHttp
    ): Promise<void> {
        const creator: IModifyCreator = modify.getCreator();
        const sender: IUser = context.getSender();
        const room: IRoom = context.getRoom();
        const thread = context.getThreadId();
        let messageTemplate: IMessage = {
            sender,
            room
        };

        if(!thread){ // Os comandos só podem ser dados dentro de uma conversa
            messageTemplate.text = `Comandos devem ser executados apenas dentro de conversas, não no chat geral.`;
            let messageBuilder: IMessageBuilder = creator.startMessage(messageTemplate)
            await creator.finish(messageBuilder)
            throw new Error('Error!');
        }else{
            messageTemplate.threadId = thread;
        }

        const [subcommand] = context.getArguments(); // [2]

        if (!subcommand) { // [3]
            throw new Error('Error!');
        }

        console.log('room', room);
        console.log('sender', sender);
        console.log('thread', thread);

        // Nota: Todo slashcommand dado aqui no Rocket deve disparar um post para a nossa API para o endpoint shortcuts

        try{
            let url = `https://api.apijuridica.com.br/v1/rocket/shortcuts`;
            let options: IHttpRequest = {
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    room: room.id,
                    thread: thread,
                    command: subcommand
                }
            };
            let response = await http.post(url, options);
            if(!response){
                console.error('Error sending command to Mevio system at room '+room.id+'.');
                throw new Error('Error!');
            }
            messageTemplate.text = `Ok, a sua solicitação foi recebida. Por favor aguarde...`;
        } catch (e) {
            console.log('Error loading remote commands file - room '+room.id, e);
        }
        let messageBuilder: IMessageBuilder = creator.startMessage(messageTemplate)
        await creator.finish(messageBuilder)

    }
}
