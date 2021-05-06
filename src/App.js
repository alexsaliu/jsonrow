import {useState, useEffect, useRef} from 'react'
import axios from 'axios'

const App = () => {
	const [apiKey, setApiKey] = useState('')
	const [text, setText] = useState('{"test": "test"}')
	const [json, setJson] = useState(`{
		"test": "hi",
		"test1": 1,
		"test2": true,
		"test3": {
			"testDeep": "ok"
		},
		"test4": [1, true, "hi", [1, {"ok": {"ok": 2}}]]
	}`)

	const jsonRef = useRef(null)

	useEffect(() => {
		console.log(JSON.parse(json))
		setJson(JSON.parse(json))
		// setJson(formatJson(JSON.parse(json)))
		console.log(json)
	}, [])

	const formatJson = (json, level=0) => {
		let formattedJson = !level ? '<div>' : ''
		if (Array.isArray(json)) {
			formattedJson += '[<div>'
			for (const item of json) {
				formattedJson += '<div>' + indentation(level + 2) + formatValue(item, level + 2)
			}
			formattedJson += '<div>' + indentation(level) + ']</div>'
		}
		else if (typeof json === 'object') {
			formattedJson += '{</div>'
			for (const key in json) {
				formattedJson += `<div>${indentation(level + 2)}<span style="color:green">"${key}"</span>: ${formatValue(json[key], level + 2)}`
			}
			formattedJson += `<div>${indentation(level)}}</div>`
		}
		else {
			return 'not valid json'
		}
		return formattedJson
	}

	const indentation = (amount) => {
		let spaces = ''
		for (let i = 0; i < amount; i++) {
			spaces += '&nbsp;'
		}
		return spaces
	}

	const formatValue = (value, level) => {
		if (typeof value === 'string') return `<span style="color:red">"${value}"</span>,</div>`
		if (typeof value === 'number') return `<span style="color:blue">${value}</span>,</div>`
		if (typeof value === 'boolean') return `<span style="color:purple">${value}</span>,</div>`
		if (typeof value === 'object' || Array.isArray(value)) return formatJson(value, level)
	}

	const generateKey = async () => {
		const res = await axios.get('https://jsonrow-api.herokuapp.com/new')
		console.log(res)
		setApiKey(res.data.data)
	}

	const sendJson = async () => {
		console.log();
		
		const res = await axios.post(`https://jsonrow-api.herokuapp.com/user/${apiKey}`, {
			json: text
		})
		console.log(res)
	}

	const getJson = async () => {
		const res = await axios.get(`https://jsonrow-api.herokuapp.com/user/${apiKey}`)
		console.log(res)
		setJson(JSON.stringify(res.data.data))
	}

	const copyToClipboard = (text) => {
		function listener(e) {
		e.clipboardData.setData("text/html", text)
		e.preventDefault()
		}
		document.addEventListener("copy", listener)
		document.execCommand("copy")
		document.removeEventListener("copy", listener)
	}

	function CopyToClipboard(element) {
		if (document.selection) {
		  var range = document.body.createTextRange();
		  range.moveToElementText(element);
		  range.select().createTextRange();
		  document.execCommand("copy");
		} else if (window.getSelection) {
		  var range = document.createRange();
		  range.selectNode(element);
		  window.getSelection().addRange(range);
		  document.execCommand("copy");
		  alert("Text has been copied, now paste in the text-area")
		}
	  }

	return (
		<div className="App">
			JSONrow
			<button onClick={() => generateKey()}>Generate Key</button>
			<div onClick={() => copyToClipboard(apiKey)}>{apiKey}</div>
			<textarea onChange={(e) => setText(e.target.value)} placeholder='{"test": "test"}'></textarea>
			<button onClick={() => sendJson()}>Send JSON</button>
			<button onClick={() => getJson()}>Get JSON</button>
			<div ref={jsonRef} dangerouslySetInnerHTML={{__html: json}}></div>
			<button onClick={() => CopyToClipboard(jsonRef.current)}>Copy</button>
			<pre>
				<code>
					{JSON.stringify(json, null, 4)}
				</code>
			</pre>
		</div>
	)
}

export default App
