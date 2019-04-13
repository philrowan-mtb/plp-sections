var plp = /** @class */ (function () {
    function plp() {
        this.host = document.createElement('span');
        this.state = {};
    }
    plp.prototype.init = function () {
        var _this = this;
        var filters = document.querySelectorAll('input[plp-type=filter]');
        filters.forEach(function (x) {
            x.addEventListener('change', function (e) {
                var model = e.target.getAttribute('plp-model');
                var eventDataJson = decodeHTMLEntities(model);
                var eventData = JSON.parse(eventDataJson);
                _this.raise('filter-changed', {
                    bubbles: false,
                    detail: eventData
                });
            });
        });
    };
    plp.prototype.on = function (eventName, handler) {
        this.host.addEventListener(eventName, handler);
        console.debug('listen event ', eventName);
    };
    plp.prototype.raise = function (eventName, eventData) {
        var event = new CustomEvent(eventName, eventData);
        console.debug('raise event', event);
        this.__handleEvent(eventName, eventData);
        this.host.dispatchEvent(event);
    };
    plp.prototype.__handleEvent = function (eventName, eventData) {
        switch (eventName) {
            case 'filter-changed':
                this.state.filters = this.state.filters || {};
                this.state.filters[eventData.detail.filter_name] = this.state.filters[eventData.detail.filter_name] || [];
                this.state.filters[eventData.detail.filter_name].push(eventData.detail.filter_value);
                break;
        }
    };
    return plp;
}());
function filterChange(event) {
    console.log('filter changed:', event);
    _plp.raise('filter-change', event);
}
var _plp;
window.addEventListener('DOMContentLoaded', function (event) {
    console.log('DOM fully loaded and parsed');
    init();
});
function init() {
    console.debug('document loaded');
    _plp = new plp();
    _plp.init();
    _plp.on('filter-change', function () { return repaint(); });
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
//# sourceMappingURL=e.js.map