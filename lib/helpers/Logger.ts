import { ICIWorld } from '../setup/ci-world';

export default class Logger {
    world: ICIWorld;
    //static logger: Logger = log4js.getLogger();

    constructor(world: ICIWorld) {
        this.world = world;
    }

    log(...message: string[]) {
        if (global.world_parameters.log_enabled) {
            try {
                if (global.world_parameters.log_location === "report")
                    this.world.log(message.join(" "));
                else
                    console.log(message.join(" "));
            }
            catch (exception) {
                console.log(message.join(" "));
            }
        }
    }

    static debug(message: string) {
        //this.logger.debug(message);
    }

    static info(message: string) {
        //this.logger.info(message);
    }
    static trace(message: string) {
        //this.logger.trace(message);
    }
}