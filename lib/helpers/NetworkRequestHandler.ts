import { Page, Request } from 'playwright';
class NetworkRequestHandler {

    requests: Request[];
    page: Page;

    constructor(page: Page) {
        this.page = page;
        this.requests = [];
    }

    /**
     * This function captures all network requests.
     * @method captureNetworkRequests
     * @memberof NetworkRequestHandler
     */
    captureNetworkRequests(): void {
        this.page.on("request", (request) => {
            this.requests.push(request);
        })
    }

    /**
     * This function returns all captured network requests.
     * @method getRequests
     * @memberof NetworkRequestHandler
     * @returns {Request[]} The captured network requests.
     */
    getRequests(): Request[] {
        return this.requests;
    }

    /**
     * This function clears the captured network requests.
     * @method clearRequests
     * @memberof NetworkRequestHandler
     */
    clearRequests(): void {
        this.requests = [];
    }

    /**
     * This function is used for fetching a particular request with matching URL.
     * By default, it returns the latest request matching the URL.
     * @method getRequestByUrl
     * @memberof NetworkRequestHandler
     * @param {string} query - The URL query string to match.
     * @param {number} occurrence - The occurrence of the request to return (default: 1).
     * @returns {Request} The matching request.
     * @throws {Error} If no request with a matching URL is found.
     */
    getRequestByUrl(query: string, occurrence = 1): Request {
        const filteredRequests = this.queryNetworkRequests(query)
        if (filteredRequests.length >= occurrence) {
            return filteredRequests[filteredRequests.length - occurrence];
        } else {
            throw new Error(`No Request with matching url ${query} found`);
        }
    }

    /**
     * This function is used for fetching a particular request with matching URL and method.
     * By default, it returns the latest request matching the URL.
     * @method getRequestByMethod
     * @memberof NetworkRequestHandler
     * @param {string} urlMatchText - Matching URL text string to match request url
     * @param {string} method - method type of Network request for example GET,POST etc
     * @returns {Request} The matching request.
     * @throws {Error} If no request with a matching URL is found.
     */
    getRequestByMethod(urlMatchText: string, method: string): Request {
        const req = this.getRequests()
        const requests = req.filter((request) => {
            if (request.url().includes(urlMatchText) &&request.method() == method){
                return request;
            }
        })
        if(requests.length==0){
            throw new Error(`No Request with matching url ${urlMatchText} found`);
        }
        return requests[requests.length - 1];
    }
    
    /**
     * This function is used for fetching multiple requests with matching URL.
     * @method queryNetworkRequests
     * @memberof NetworkRequestHandler
     * @param {string} query - The URL query string to match.
     * @returns {Request[]} An array of requests matching the URL.
     */
    queryNetworkRequests(query: string): Request[] {
        const requests = this.getRequests();
        return requests.filter(req => req.url().includes(query));
    }

    /**
     * This function is used for getting the total count of network requests matching a URL.
     * @method getCountOfNetworkRequest
     * @memberof NetworkRequestHandler
     * @param {string} query - The URL query string to match.
     * @returns {number} The count of matching network requests.
     */
    getCountOfNetworkRequest(query: string): number {
        return this.queryNetworkRequests(query).length
    }

    /**
  * This function waits for a network request with a specific URL to occur.
  * @method waitForRequest
  * @memberof NetworkRequestHandler
  * @param {string} url - The URL to wait for.
  * @param {number} timeout - The maximum time to wait in milliseconds (default: 5000).
  * @returns {Promise<Request>} A promise that resolves with the matching request.
  * @throws {Error} If the request is not found within the specified timeout.
  */
    waitForRequest(url: string, timeout = 5000): Promise<Request> {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error(`Timed out waiting for request with URL: ${url}`));
            }, timeout);

            this.page.on('request', (request) => {
                if (request.url().includes(url)) {
                    clearTimeout(timer);
                    resolve(request);
                }
            });
        });
    }
}

export default NetworkRequestHandler;