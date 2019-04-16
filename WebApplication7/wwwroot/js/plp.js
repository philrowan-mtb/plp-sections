var plp = /** @class */ (function () {
    function plp(state) {
        this.apiUrl = 'http://localhost:5000/api/search/';
        this.state = state;
        this.init();
    }
    plp.prototype.init = function () {
        this.__initSections();
        this.__initFilters();
        this.__initSort();
        this.__initCategories();
        this.__initLoadMore();
    };
    plp.prototype.__initLoadMore = function () {
        var _this = this;
        document.querySelector('button[plp-type="load-more"]')
            .addEventListener('click', function () {
            _this.state.productCount += 3;
            _this.__applyState(_this.state);
        });
    };
    plp.prototype.__initSort = function () {
        var _this = this;
        document.querySelector('select[plp-type=sort]')
            .addEventListener('change', function (e) {
            var s = e.target;
            var o = s.selectedOptions.item(0);
            console.debug(o);
            var p = o.getAttribute('plp-sort-property');
            var d = o.getAttribute('plp-sort-dir');
            _this.setSort({ property: p, direction: d });
        });
    };
    plp.prototype.__initCategories = function () {
        var _this = this;
        document.querySelectorAll('a[plp-type=category]').forEach(function (x) {
            x.addEventListener('click', function (e) {
                e.preventDefault();
                var catId = x.getAttribute('plp-model');
                _this.setCategory(catId);
            });
        });
    };
    plp.prototype.__initSections = function () {
        var _this = this;
        this.sections = [];
        document.querySelectorAll('*[plp-section]').forEach(function (x) {
            var sectionName = x.getAttribute('plp-section');
            _this.sections.push({
                el: x,
                name: sectionName,
            });
        });
        console.log('sections', this.sections);
    };
    // hookup event handlers to filters
    plp.prototype.__initFilters = function () {
        var _this = this;
        var filters = document.querySelectorAll('*[plp-section=filters] input[plp-type=filter]');
        // bind change to any filter check boxes
        filters.forEach(function (x) {
            x.addEventListener('change', function (e) {
                console.log('filter changed...');
                var model = _this.__getPLPModel(e);
                if (e.target.checked) {
                    _this.addFilter(model);
                }
                else {
                    _this.removeFilter(model);
                }
            });
        });
        // bind click to existing active filters coming from the server
        // todo: bind higher in the DOM and use event targeting strategy to decide what to do.
        // PROS: 1 click handler per type (filter check, active filter, etc.) means we can bind the DOM once and let events bubble so we do not have to hookup events 
        // when new elements are added client side
        var activeFilters = document.querySelectorAll('#plp-active-filters a[plp-type=filter]');
        activeFilters.forEach(function (x) {
            x.addEventListener('click', function (e) { return _this.onRemoveFilterClick(e); });
        });
    };
    plp.prototype.onRemoveFilterClick = function (e) {
        // stop anchor from updating url
        e.preventDefault();
        var model = this.__getPLPModel(e);
        this.removeFilter(model);
    };
    plp.prototype.__getPLPModel = function (e) {
        var model = e.target.getAttribute('plp-model');
        var eventDataJson = decodeHTMLEntities(model);
        return JSON.parse(eventDataJson);
    };
    plp.prototype.__applyState = function (state) {
        var _this = this;
        var q = this.__convertToParams(state);
        fetch(this.apiUrl + '?' + q).then(function (response) {
            response.json().then(function (o) {
                var rs = o.sections;
                _this.sections.forEach(function (s) {
                    if (rs.hasOwnProperty(s.name)) {
                        console.log('replacing HTML for section ' + s.name);
                        // TODO: bug here that is placing the section and the wrapper inside it again;
                        s.el.innerHTML = rs[s.name];
                    }
                });
                var url = location.origin + location.pathname + '?' + q;
                history.pushState(state, '', url);
            });
        });
    };
    plp.prototype.__convertToParams = function (state) {
        // TODO: url encoding
        var q = [];
        if (state.filters) {
            for (var _i = 0, _a = Object.getOwnPropertyNames(state.filters); _i < _a.length; _i++) {
                var f = _a[_i];
                var vv = state.filters[f].join('|');
                q.push('f_' + f + '=' + vv);
            }
        }
        if (state.category) {
            q.push('c=' + state.category);
        }
        if (state.sort) {
            q.push('s_p=' + state.sort.property);
            q.push('s_d=' + state.sort.direction);
        }
        if (state.productCount) {
            q.push('pc=' + state.productCount);
        }
        var qs = q.join('&');
        console.debug('state param encoded', qs);
        return qs;
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
        this.__applyState(this.state);
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
        this.__applyState(this.state);
    };
    plp.prototype.setCategory = function (catId) {
        console.debug('set category', catId);
        this.state.category = catId;
        this.__applyState(this.state);
    };
    plp.prototype.setSort = function (model) {
        console.debug('set sort', model);
        this.state.sort = model;
        this.__applyState(this.state);
    };
    return plp;
}());
var _plp;
window.addEventListener('DOMContentLoaded', function () {
    var stateJson = document.getElementById('plp-state').innerText;
    var state = JSON.parse(stateJson);
    console.debug('INITIAL STATE', state);
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
//# sourceMappingURL=plp.js.map