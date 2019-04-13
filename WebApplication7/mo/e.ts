
class plp {

    private host: any;
    private state: any;

    constructor() {
        this.host = document.createElement('span');
        this.state = {};
    }

    init() {
        const filters = document.querySelectorAll('input[plp-type=filter]');
        filters.forEach(x => {
            x.addEventListener('change', (e) => {                
                const model = (e.target as HTMLElement).getAttribute('plp-model');
                const eventDataJson = decodeHTMLEntities(model);
                const eventData = JSON.parse(eventDataJson);                
                this.raise('filter-changed', {
                    bubbles: false,
                    detail: eventData
                });
            });
        });
    }

    on(eventName: string, handler: ((event: Event) => void)) {
        this.host.addEventListener(eventName, handler);
        console.debug('listen event ', eventName);
    }

    raise(eventName: string, eventData: any) {
        var event = new CustomEvent(eventName, eventData);
        console.debug('raise event', event);
        this.__handleEvent(eventName, eventData);
        this.host.dispatchEvent(event);
    }

    private __handleEvent(eventName: string, eventData: any) {
        switch (eventName) {
            case 'filter-changed':
                this.state.filters = this.state.filters || {};
                this.state.filters[eventData.detail.filter_name] = this.state.filters[eventData.detail.filter_name] || [];
                this.state.filters[eventData.detail.filter_name].push(eventData.detail.filter_value);
                break;
        }
    }
}

function filterChange(event) {
    console.log('filter changed:', event);
    _plp.raise('filter-change', event);
}

var _plp;

window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    init();
});

function init() {
    console.debug('document loaded');
    _plp = new plp();
    _plp.init();
    _plp.on('filter-change', () => repaint())
}

function repaint() {
    console.log('repaint');
}

function decodeHTMLEntities(text) {
    var entities = [
        ['amp', '&'],
        ['apos', '\''],
        ['#x27', '\''],
        ['#x2F', '/'],
        ['#39', '\''],
        ['#47', '/'],
        ['lt', '<'],
        ['gt', '>'],
        ['nbsp', ' '],
        ['quot', '"']
    ];

    for (var i = 0, max = entities.length; i < max; ++i)
        text = text.replace(new RegExp('&' + entities[i][0] + ';', 'g'), entities[i][1]);

    return text;
}