
interface FilterModel {
    name: string;
    value: string;
    id: string;
}

class plp {
    private readonly state: any;

    constructor(state) {
        this.state = state;
        this.init();
    }

    private init() {
        this.__initFilters();
    }

    // hookup event handlers to filters
    private __initFilters() {
        const filters = document.querySelectorAll('#plp-available-filters input[plp-type=filter]');
        filters.forEach(x => {
            x.addEventListener('change', (e) => {
                console.log('filter changed...');
                const model = this.__getPLPModel<FilterModel>(e);
                const detail = {
                    ...model,
                    filterRemoved: !e.target['checked'],
                    filterAdded: e.target['checked']
                };
                this.__handleEvent('filter-changed', detail);
            });
        });

        // todo: hookup to existing active filters coming from the server
        const activeFilters = document.querySelectorAll('#plp-active-filters a[plp-type=filter]');
        activeFilters.forEach(x => {
            x.addEventListener('click', (e) => this.onRemoveFilterClick(e));
        });
    }

    public onRemoveFilterClick(e) {
        console.log('active filter removed...');
        // stop anchor from updating url
        e.preventDefault();
        const model = this.__getPLPModel<FilterModel>(e);
        const detail = {
            ...model,
            filterRemoved: true,
            filterAdded: false
        };
        this.__handleEvent('filter-changed', detail);
    }

    private __getPLPModel<TModel>(e): TModel {
        const model = (e.target as HTMLElement).getAttribute('plp-model');
        const eventDataJson = decodeHTMLEntities(model);
        return JSON.parse(eventDataJson) as TModel;
    }

    private __handleEvent(eventName: string, eventData: any) {
        switch (eventName) {
            case 'filter-changed':
                const filterName = eventData.filter_name;
                const filterValue = eventData.filter_value;
                if (eventData.filterAdded) {
                    this.addFilter(eventData as FilterModel);
                } else {
                    this.removeFilter(eventData as FilterModel);
                }
                break;
        }

        console.log('the new state:', this.state);
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
            this.removeFilter(model)
        });
        f2.appendChild(a);
        f.appendChild(f2);
    }
}

var _plp;

window.addEventListener('DOMContentLoaded', () => {
    let stateJson = document.getElementById('plp-state').innerText;
    const state = JSON.parse(stateJson);
    console.log('INITIAL STATE', state);
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