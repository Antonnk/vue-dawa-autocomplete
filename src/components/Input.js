import fetch from 'unfetch'

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
		hits: []
	}),

    methods: {
    	
    	async handleInput(e) {
    		this.query = e.target.value
			this.rawHits = await this.fetch()
			this.hits = this.rawHits.map(hit => this.hitTransformer(hit))
    		console.log(this.hits)
    	},

		async fetch() {
			return await fetch(`${this.url}/autocomplete?q=${encodeURI(this.query)}`)
			  .catch(console.error)
			  .then( response => response.json())
		},

		selectHit(index) {
			console.log(this.hits[index])
			this.hit = this.hits[index]
		}
    },

    computed: {
		url() {
			return `${this.baseUrl}/${this.type}`
		}
    },

    render(createElement) {
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
			createElement('ul', 
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
			),
    	])
    }
};
