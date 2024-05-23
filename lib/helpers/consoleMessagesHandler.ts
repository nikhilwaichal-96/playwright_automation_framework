import { Page } from 'playwright';

class ConsoleMessagesHandler {
    consoleMessages: string[];
    page: Page;

    constructor(page: Page) {
        this.page = page;
        this.consoleMessages = [];
    }

    /**
     * This function captures console messages in browser and stores them in consoleMessages array
     * @method captureConsoleMessages
     * @memberof consoleMessagesHandler
     */
    captureConsoleMessages() {
        this.page.on("console", (msg) => {
            this.consoleMessages.push(msg.text());
        });
    }

    /**
     * This function returns captured console messages array.
     * @method getConsoleMessages
     * @memberof consoleMessagesHandler
     * @returns {consoleMessages[]} 
     */
    getConsoleMessages() {
        return this.consoleMessages;
    }

    /**
     * This function clears the captured network requests.
     * @method clearConsoleMessages
     * @memberof consoleMessagesHandler
     */
    clearConsoleMessages() {
        this.consoleMessages = [];
    }

    /**
     * Waits for a console message to appear in the `consoleMessages` array and returns a Promise.
     * The Promise resolves when the specified message is found, or rejects if the timeout is reached.
     * @param message - The desired console message to wait for.
     * @param timeout - The timeout duration in milliseconds. Default is 5000 milliseconds.
     * @returns A Promise that resolves when the message is found or rejects if the timeout is reached.
     */
    waitForConsoleMessage(message: string, timeout: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error(`Timed out waiting for '${message}' in console`));
            }, timeout);

            const checkMessage = () => {
                if (this.consoleMessages.toString().includes(message)) {
                    clearTimeout(timer);
                    clearInterval(interval);
                    resolve();
                }
            };
            //check for console messages after every 100ms interval
            const interval = setInterval(checkMessage, 100);
        });
    }

    /**
     * Checks if the console messages are present in the `consoleMessages` array.
     * @param messages - An array of console messages to check for.
     * @param checkPartial - Optional. If true, checks for partial matches. Default is true.
     * @param timeout - Optional The timeout duration in milliseconds. Default is 5000 milliseconds.
     * @returns True if all messages are present in the console messages array, otherwise false.
     */
    async isConsoleMessagePresent(messages: string[], { checkPartial = true, timeout = 5000 } = {}) {
        let status = true;
        for (let i = 0; i < messages.length; i++) {
            await this.waitForConsoleMessage(messages[i],timeout)
            if (checkPartial) {
                status = this.consoleMessages.toString().includes(messages[i]);
            } else {
                status = this.consoleMessages.includes(messages[i]);
            }
            if (!status) {
                return false;
            }
        }
        return true;
    }
}
export default ConsoleMessagesHandler;