var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var plp = /** @class */ (function () {
    function plp(state) {
        this.state = state;
        this.init();
    }
    plp.prototype.init = function () {
        this.__initFilters();
    };
    // hookup event handlers to filters
    plp.prototype.__initFilters = function () {
        var _this = this;
        var filters = document.querySelectorAll('#plp-available-filters input[plp-type=filter]');
        filters.forEach(function (x) {
            x.addEventListener('change', function (e) {
                console.log('filter changed...');
                var model = _this.__getPLPModel(e);
                var detail = __assign({}, model, { filterRemoved: !e.target['checked'], filterAdded: e.target['checked'] });
                _this.__handleEvent('filter-changed', detail);
            });
        });
        // todo: hookup to existing active filters coming from the server
        var activeFilters = document.querySelectorAll('#plp-active-filters a[plp-type=filter]');
        activeFilters.forEach(function (x) {
            x.addEventListener('click', function (e) { return _this.onRemoveFilterClick(e); });
        });
    };
    plp.prototype.onRemoveFilterClick = function (e) {
        console.log('active filter removed...');
        // stop anchor from updating url
        e.preventDefault();
        var model = this.__getPLPModel(e);
        var detail = __assign({}, model, { filterRemoved: true, filterAdded: false });
        this.__handleEvent('filter-changed', detail);
    };
    plp.prototype.__getPLPModel = function (e) {
        var model = e.target.getAttribute('plp-model');
        var eventDataJson = decodeHTMLEntities(model);
        return JSON.parse(eventDataJson);
    };
    plp.prototype.__handleEvent = function (eventName, eventData) {
        switch (eventName) {
            case 'filter-changed':
                var filterName = eventData.filter_name;
                var filterValue = eventData.filter_value;
                if (eventData.filterAdded) {
                    this.addFilter(eventData);
                }
                else {
                    this.removeFilter(eventData);
                }
                break;
        }
        console.log('the new state:', this.state);
    };
    plp.prototype.removeFilter = function (model) {
        console.log('remove filter', model);
        // manage state        
        var removeAt = this.state.filters[model.name].indexOf(model.value);
        this.state.filters[model.name] = this.state.filters[model.name].splice(removeAt, 0);
        // manage display                   
        var af = document.querySelector('#plp-active-filters *[plp-id="' + model.id + '"]');
        if (af)
            af.remove();
        var fi = document.querySelector('#plp-available-filters input[plp-id="' + model.id + '"]');
        if (fi)
            fi.checked = false;
    };
    plp.prototype.addFilter = function (model) {
        var _this = this;
        // manage state
        console.log('add filter', model);
        this.state.filters[model.name] = this.state.filters[model.name] || [];
        this.state.filters[model.name].push(model.value);
        // manage display
        var f = document.getElementById('plp-active-filters');
        var f2 = document.createElement('li');
        f2.setAttribute('plp-id', model.id);
        f2.classList.add('nav-item');
        var a = document.createElement('a');
        a.classList.add('nav-link');
        a.innerHTML = 'X | ' + model.value;
        a.href = "#";
        a.addEventListener('click', function (e) {
            e.preventDefault();
            _this.removeFilter(model);
        });
        f2.appendChild(a);
        f.appendChild(f2);
    };
    return plp;
}());
var _plp;
window.addEventListener('DOMContentLoaded', function () {
    var stateJson = document.getElementById('plp-state').innerText;
    var state = JSON.parse(stateJson);
    console.log('INITIAL STATE', state);
    _plp = new plp(state);
});
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