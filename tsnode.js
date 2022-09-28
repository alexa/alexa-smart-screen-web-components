import tsAutoMockTransformer from 'ts-auto-mock/transformer';
import fetch from 'node-fetch';
if (!global.Headers) {
    global.fetch = fetch;
    global.Headers = fetch.Headers;
    global.Request = fetch.Request;
    global.Response = fetch.Response;
}

require('ts-node').register({
    transformers: program => ({
        before: [
            tsAutoMockTransformer(program)
        ]
    })
});