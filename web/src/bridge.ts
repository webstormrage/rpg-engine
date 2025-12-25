type Handler = (event: any) => void;
type Listener = {
    handler: Handler,
    key: string
};
const listeners: Listener[] = [];

export const name = (...params: (string|number)[]) => {
    return params.join('-');
}

export const on = (key: string, handler: Handler) => {
    listeners.push({
        handler,
        key: key
    });
};

export const off = (handler: Handler) => {
    const index = listeners.findIndex(l => l.handler === handler);
    if (index !== -1){
        listeners.splice(index, 1);
    }
};

export const emit = (key: string, payload: any) => {
    const subscribers = listeners
        .filter(l => {
            return l.key === key;
        });
    subscribers
        .forEach(l => {
            return l.handler(payload);
        });
};