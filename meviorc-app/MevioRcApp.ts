import {
    IAppAccessors,
    IConfigurationExtend,
    IEnvironmentRead,
    ILogger,
//    IConfigurationModify,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { MevioCommand } from './commands/MevioCommand';

export class MevioRcApp extends App {
    private readonly appLogger: ILogger;
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    public async extendConfiguration(
        configuration: IConfigurationExtend,
        environmentRead: IEnvironmentRead
      ): Promise<void> {
        await configuration.slashCommands.provideSlashCommand(new MevioCommand());
    }
/*
    public async onEnable(
        environmentRead: IEnvironmentRead,
        configurationModify: IConfigurationModify
    ): Promise<boolean> {
        configurationModify.slashCommands.disableSlashCommand("archive");
        configurationModify.slashCommands.disableSlashCommand("create");
        return true;
    }
*/
}
