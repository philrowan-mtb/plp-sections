var plp = /** @class */ (function () {
    function plp(state) {
        this.apiUrl = 'http://localhost:5000/api/search/';
        this.state = state;
        this.init();
        this.options = {
            loadMoreCount: 1
        };
    }
    plp.prototype.init = function () {
        this.__initSections();
        this.__initFilters();
        this.__initActiveFilters();
        this.__initSort();
        this.__initCategories();
        this.__initLoadMore();
    };
    plp.prototype.__bindSection = function (sectionName) {
        switch (sectionName) {
            case 'activeFilters':
                this.__initActiveFilters();
        }
    };
    plp.prototype.__initLoadMore = function () {
        var _this = this;
        document.querySelector('button[plp-type="load-more"]')
            .addEventListener('click', function () {
            _this.state.productCount += _this.options.loadMoreCount;
            _this.__applyState(_this.state);
        });
    };
    plp.prototype.__initSort = function () {
        var _this = this;
        document.querySelector('select[plp-type=sort]')
            .addEventListener('change', function (e) {
            var s = e.target;
            var o = s.selectedOptions.item(0);
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
    };
    // hookup event handlers to filters
    plp.prototype.__initFilters = function () {
        var _this = this;
        var filters = document.querySelectorAll('*[plp-section=filters] input[plp-type=filter]');
        // bind change to any filter check boxes
        filters.forEach(function (x) {
            x.addEventListener('change', function (e) {
                console.debug('filter changed...');
                var model = _this.__getPLPModel(e);
                if (e.target.checked) {
                    _this.addFilter(model);
                }
                else {
                    _this.removeFilter(model);
                }
            });
        });
    };
    plp.prototype.__initActiveFilters = function () {
        var _this = this;
        document.querySelectorAll('*[plp-section=activeFilters] a[plp-type=filter]').forEach(function (x) {
            x.addEventListener('click', function (e) {
                console.log('remove filter ', e);
                e.preventDefault();
                var model = _this.__getPLPModel(e);
                _this.removeFilter(model);
            });
        });
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
                        console.debug('replacing HTML for section ' + s.name);
                        if (typeof rs[s.name] == 'string') {
                            s.el.innerHTML = rs[s.name];
                        }
                        else {
                            s.el.innerHTML = rs[s.name].html;
                            if (rs[s.name].bind) {
                                _this.__bindSection(s.name);
                            }
                        }
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
        console.debug('remove filter', model);
        debugger;
        var removeAt = this.state.filters[model.name].indexOf(model.value);
        this.state.filters[model.name].splice(removeAt, 1);
        this.__applyState(this.state);
    };
    plp.prototype.addFilter = function (model) {
        console.debug('add filter', model);
        this.state.filters[model.name] = this.state.filters[model.name] || [];
        this.state.filters[model.name].push(model.value);
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