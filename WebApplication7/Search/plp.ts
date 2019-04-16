
interface FilterModel {
    name: string;
    value: string;
    id: string;
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
    constructor(state) {
        this.state = state;
        this.init();
    }

    private init() {
        this.__initSections();
        this.__initFilters();
        this.__initSort();
        this.__initCategories();
        this.__initLoadMore();
    }

    __initLoadMore() {
        document.querySelector('button[plp-type="load-more"]')
            .addEventListener('click', () => {
                this.state.productCount += 3;
                this.__applyState(this.state);
            });
    }

    __initSort() {
        document.querySelector('select[plp-type=sort]')
            .addEventListener('change', e => {
                const s = e.target as HTMLSelectElement;
                const o = s.selectedOptions.item(0);
                console.debug(o);
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
        console.log('sections', this.sections);
    }

    // hookup event handlers to filters
    private __initFilters() {        
        const filters = document.querySelectorAll('*[plp-section=filters] input[plp-type=filter]');
        // bind change to any filter check boxes
        filters.forEach(x => {
            x.addEventListener('change', (e) => {
                console.log('filter changed...');
                const model = this.__getPLPModel<FilterModel>(e);
                if ((e.target as HTMLInputElement).checked) {
                    this.addFilter(model);
                } else {
                    this.removeFilter(model);
                }                
            });
        });

        // bind click to existing active filters coming from the server
        // todo: bind higher in the DOM and use event targeting strategy to decide what to do.
        // PROS: 1 click handler per type (filter check, active filter, etc.) means we can bind the DOM once and let events bubble so we do not have to hookup events 
        // when new elements are added client side
        const activeFilters = document.querySelectorAll('#plp-active-filters a[plp-type=filter]');
        activeFilters.forEach(x => {
            x.addEventListener('click', (e) => this.onRemoveFilterClick(e));
        });
    }

    public onRemoveFilterClick(e) {        
        // stop anchor from updating url
        e.preventDefault();
        const model = this.__getPLPModel<FilterModel>(e);        
        this.removeFilter(model);
    }

    private __getPLPModel<TModel>(e): TModel {
        const model = (e.target as HTMLElement).getAttribute('plp-model');
        const eventDataJson = decodeHTMLEntities(model);
        return JSON.parse(eventDataJson) as TModel;
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
                            console.log('replacing HTML for section ' + s.name);
                            // TODO: bug here that is placing the section and the wrapper inside it again;
                            s.el.innerHTML = rs[s.name];
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
        console.log('remove filter', model);
        // manage state        
        const removeAt = this.state.filters[model.name].indexOf(model.value);
        this.state.filters[model.name] = this.state.filters[model.name].splice(removeAt, 0);

        // manage display                   
        const af = document.querySelector('#plp-active-filters *[plp-id="' + model.id + '"]');
        if (af) af.remove();

        const fi = document.querySelector('#plp-available-filters input[plp-id="' + model.id + '"]');
        if (fi) (fi as HTMLInputElement).checked = false;
        this.__applyState(this.state);
    }

    addFilter(model: FilterModel) {
        // manage state
        console.log('add filter', model);
        this.state.filters[model.name] = this.state.filters[model.name] || [];
        this.state.filters[model.name].push(model.value);

        // manage display
        const f = document.getElementById('plp-active-filters');
        const f2 = document.createElement('li');
        f2.setAttribute('plp-id', model.id);
        f2.classList.add('nav-item');
        const a = document.createElement('a');
        a.classList.add('nav-link');
        a.innerHTML = 'X | ' + model.value;
        a.href = "#";
        a.addEventListener('click', (e) => {
            e.preventDefault();
            this.removeFilter(model);            
        });
        f2.appendChild(a);
        f.appendChild(f2);
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