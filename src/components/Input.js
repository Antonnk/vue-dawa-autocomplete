import fetch from 'unfetch'
import debounce from 'lodash.debounce'

export default {
	name: "DawaAutocompleteInput",

	props: {
		type: {
			type: String,
			default: 'adresser'
		},
		baseUrl: {
			type: String,
			default: 'https://dawa.aws.dk'
		},
		hitTransformer: {
			type: Function,
			default: (hit) => {
				return {
					...hit,
					text: hit.tekst
				}
			}
		}
	},

	data: vm => ({
		query: "",
		hit: {},
		rawHits: [],
		isOpen: false
	}),

    methods: {
    	
    	handleInput(e)  {
    		this.isOpen = true
    		this.query = e.target.value
    	},

		fetch() {
			fetch(`${this.url}/autocomplete?q=${encodeURI(this.query)}`)
			  .catch(console.error)
			  .then( response => response.json())
			  .then( json => {
			  	this.rawHits = json
			  })
		},

		selectHit(index) {
			this.isOpen = false
			this.hit = this.hits[index]
			this.query = this.hit.text
		}
    },

    computed: {
		url() {
			return `${this.baseUrl}/${this.type}`
		},
		hits() {
			return this.rawHits.map(hit => this.hitTransformer(hit))
		}
    },

    created() {
		this.debouncedFetch = debounce(this.fetch, 200);
    },

    watch: {
		query(newVal) {
			this.debouncedFetch()
		}
    },

    render(createElement) {
		let listElement
		if(this.hits.length && this.isOpen) {
			listElement = createElement('ul', 
				{attrs:{role:'listbox'}}, 
				this.hits.map((hit, index) => createElement('li', 
					{
						attrs:{role:'option', tabindex: 0},
						on: {
							click: e => this.selectHit(index),
							keyup: e => {
							    // Abort if the element emitting the event is not
							    // the element the event is bound to
							    if (e.target !== event.currentTarget) return
							    if (e.keyCode !== 13) return
								this.selectHit(index)
							  }
						}
					}, 
					hit.text
				))
			)
		}


    	return createElement('div', [
    		createElement('input', {
				attrs: {
					name: "test",
					type: 'text',
					autoFocus: true,
				},
				domProps: {
			      value: this.query
			    },
				on: {
					input: this.handleInput,
				}
			}),
			listElement
    	])
    }
};
