
interface FilterModel {
    name: string;
    value: string;    
}

interface SectionModel {
    name: string;
    el: Element
}

interface SortModel {
    property: string;
    direction: 'asc' | 'desc';
}

class plp {
    private readonly state: any;
    private readonly apiUrl = 'http://localhost:5000/api/search/';
    private sections: SectionModel[];
    private options: {
        loadMoreCount: number
    };

    constructor(state) {
        this.state = state;
        this.init();
        this.options = {
            loadMoreCount: 1
        }
    }

    private init() {
        this.__initSections();
        this.__initFilters();
        this.__initActiveFilters();
        this.__initSort();
        this.__initCategories();
        this.__initLoadMore();
    }

    private __bindSection(sectionName: string) {
        switch (sectionName) {
            case 'activeFilters':
                this.__initActiveFilters();
                break;
            case 'filters':
                this.__initFilters();
                break;
        }
    }

    private __initLoadMore() {
        document.querySelector('button[plp-type="load-more"]')
            .addEventListener('click', () => {
                this.state.productCount += this.options.loadMoreCount;
                this.__applyState(this.state);
            });
    }

    private __initSort() {
        document.querySelector('select[plp-type=sort]')
            .addEventListener('change', e => {
                const s = e.target as HTMLSelectElement;
                const o = s.selectedOptions.item(0);
                const p = o.getAttribute('plp-sort-property');
                const d = o.getAttribute('plp-sort-dir') as ('asc' | 'desc');
                this.setSort({ property: p, direction: d });
            });
    }

    private __initCategories() {
        document.querySelectorAll('a[plp-type=category]').forEach(x => {
            x.addEventListener('click', e => {
                e.preventDefault();
                const catId = x.getAttribute('plp-model');
                this.setCategory(catId);
            });
        });
    }

    private __initSections() {
        this.sections = [];
        document.querySelectorAll('*[plp-section]').forEach(x => {
            const sectionName = x.getAttribute('plp-section');
            this.sections.push({
                el: x,
                name: sectionName,
            });
        });
    }

    // hookup event handlers to filters
    private __initFilters() {
        const filters = document.querySelectorAll('*[plp-section=filters] input[plp-type=filter]');
        // bind change to any filter check boxes
        filters.forEach(x => {
            x.addEventListener('change', (e) => {
                console.debug('filter changed...');
                const t = e.target as HTMLElement;
                const name = t.getAttribute('plp-filter-name');
                const value = t.getAttribute('plp-filter-value');
                const model = {
                    name,
                    value
                };
                if ((e.target as HTMLInputElement).checked) {
                    this.addFilter(model);
                } else {
                    this.removeFilter(model);
                }
            });
        });
    }

    private __initActiveFilters() {
        document.querySelectorAll('*[plp-section=activeFilters] a[plp-type=filter]').forEach(x => {
            x.addEventListener('click', (e) => {
                console.log('remove filter ', e);
                e.preventDefault();
                const t = e.target as HTMLElement;
                const name = t.getAttribute('plp-filter-name');
                const value = t.getAttribute('plp-filter-value');
                const model = {
                    name,
                    value
                };
                this.removeFilter(model);
            });
        });
    }    

    private __applyState(state: any) {
        var q = this.__convertToParams(state);
        fetch(this.apiUrl + '?' + q,
        ).then(response => {
            response.json().then(
                o => {
                    const rs = o.sections as Object;
                    this.sections.forEach(s => {
                        if (rs.hasOwnProperty(s.name)) {
                            console.debug('replacing HTML for section ' + s.name);
                            if (typeof rs[s.name] == 'string') {
                                s.el.innerHTML = rs[s.name];
                            } else {
                                s.el.innerHTML = rs[s.name].html;
                                if (rs[s.name].bind) {
                                    this.__bindSection(s.name);
                                }
                            }
                        }
                    });
                    let url = location.origin + location.pathname + '?' + q;
                    history.pushState(state, '', url);
                });
        });
    }

    private __convertToParams(state: any) {
        // TODO: url encoding
        let q = [];
        if (state.filters) {
            for (let f of Object.getOwnPropertyNames(state.filters)) {
                let vv = (state.filters[f] as []).join('|');
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
        const qs = q.join('&');
        console.debug('state param encoded', qs);
        return qs;
    }

    removeFilter(model: FilterModel) {
        console.debug('remove filter', model);        
        const removeAt = this.state.filters[model.name].indexOf(model.value);
        this.state.filters[model.name].splice(removeAt, 1);
        this.__applyState(this.state);
    }

    addFilter(model: FilterModel) {
        console.debug('add filter', model);
        this.state.filters[model.name] = this.state.filters[model.name] || [];
        this.state.filters[model.name].push(model.value);
        this.__applyState(this.state);
    }

    setCategory(catId: string) {
        console.debug('set category', catId);
        this.state.category = catId;
        this.__applyState(this.state);
    }

    setSort(model: SortModel) {
        console.debug('set sort', model)
        this.state.sort = model;
        this.__applyState(this.state);
    }
}

var _plp;

window.addEventListener('DOMContentLoaded', () => {
    let stateJson = document.getElementById('plp-state').innerText;
    const state = JSON.parse(stateJson);
    console.debug('INITIAL STATE', state);
    _plp = new plp(state);
});

function decodeHTMLEntities(text) {
    const entities = [
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

    for (let i = 0, max = entities.length; i < max; ++i)
        text = text.replace(new RegExp('&' + entities[i][0] + ';', 'g'), entities[i][1]);

    return text;
}