import {useState, useEffect, useRef} from 'react'
import axios from 'axios'

const App = () => {
	const [apiKey, setApiKey] = useState('')
	const [text, setText] = useState('{"test": "test"}')
	const [json, setJson] = useState({
		"test": "hi",
		"test1": 1,
		"test2": true,
		"test3": {
			"testDeep": "ok"
		},
		"test4": [1, true, "hi", [1, {"ok": {"ok": 2}}]]
	})
	const [formattedJson, setFormattedJson] = useState({})

	const jsonRef = useRef(null)

	useEffect(() => {
		console.log(json)
		console.log(formattedJson)
	}, [])

	useEffect(() => {
		console.log("OK");
		setFormattedJson(formatJsonAsHtml(json))
	}, [json])

	const formatJsonAsHtml = (json, level=0) => {
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
		if (typeof value === 'object' || Array.isArray(value)) return formatJsonAsHtml(value, level)
	}

	const generateKey = async () => {
		// const res = await axios.get('https://jsonrow-api.herokuapp.com/new')
		const res = await axios.get('http://localhost:3001/new')
		console.log(res)
		setApiKey(res.data.data)
	}

	const sendJson = async () => {
		// const res = await axios.post(`https://jsonrow-api.herokuapp.com/user/${apiKey}`, {
		// 	json: text
		// })
		console.log(text);
		const res = await axios.post(`http://localhost:3001/user/${apiKey}`, {
			json: text
		})
		console.log(res)
	}

	const getJson = async () => {
		// const res = await axios.get(`https://jsonrow-api.herokuapp.com/user/${apiKey}`)
		const res = await axios.get(`http://localhost:3001/user/${apiKey}`)
		console.log(res)
		setJson(res.data.data)
	}

	const copyToClipboard = (text) => {
		console.log(text);
		function listener(e) {
			e.clipboardData.setData("text/plain", text)
			e.preventDefault()
		}
		document.addEventListener("copy", listener)
		document.execCommand("copy")
		document.removeEventListener("copy", listener)
	}

	return (
		<div className="App">
			JSONrow
			<input onChange={(e) => {setApiKey(e.target.value)}} value={apiKey} type="text" />
			<button onClick={() => generateKey()}>Generate Key</button>
			<div onClick={() => copyToClipboard(apiKey)}>{apiKey}</div>
			<textarea onChange={(e) => setText(e.target.value)} placeholder='{"test": "test"}'></textarea>
			<button onClick={() => sendJson()}>Send JSON</button>
			<button onClick={() => getJson()}>Get JSON</button>
			<div className="formatted_json" dangerouslySetInnerHTML={{__html: formattedJson}}></div>
			<button onClick={() => copyToClipboard(jsonRef.current.innerHTML)}>Copy</button>
			<pre hidden>
				<code ref={jsonRef}>
					{JSON.stringify(json, null, 4)}
				</code>
			</pre>
		</div>
	)
}

export default App
