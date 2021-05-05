import {useState, useEffect} from 'react'
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
		"test4": [1, true, "hi"]
	}`)

	useEffect(() => {
		console.log(JSON.parse(json))
		setJson(formatJson(JSON.parse(json)))
		console.log(formatJson(JSON.parse(json)))
	}, [])

	// if object
		// add key
		// check type, add value

	// if array
		// check type add value

	const formatJson = (json, level=0) => {
		let formattedJson = ''
		if (Array.isArray(json)) {
			formattedJson += '[\n' + indentation(level++)
			console.log(level);
			
			for (const item in json) {
				formattedJson += formatValue(item) + ',\n'
			}
			formattedJson += ']'
		}
		else if (typeof json === 'object') {
			formattedJson += '{\n' + indentation(level++)
			console.log(level);
			for (const key in json) {
				formattedJson += `"${key}": `
				formattedJson += formatValue(json[key]) + ',\n'
			}
			formattedJson += '}'
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

	const formatValue = (value) => {
		if (typeof value === 'string') return `"${value}"`
		if (typeof value === 'number' || typeof value === 'boolean') return value
		if (typeof value === 'object' || Array.isArray(value)) return formatJson(value)
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

	const copyToClipboard = () => {
		let str = apiKey
		function listener(e) {
		e.clipboardData.setData("text/plain", str)
		e.preventDefault()
		}
		document.addEventListener("copy", listener)
		document.execCommand("copy")
		document.removeEventListener("copy", listener)
	}

	return (
		<div className="App">
			JSONrow
			<button onClick={() => generateKey()}>Generate Key</button>
			<div onClick={() => copyToClipboard()}>{apiKey}</div>
			<textarea onChange={(e) => setText(e.target.value)} placeholder='{"test": "test"}'></textarea>
			<button onClick={() => sendJson()}>Send JSON</button>
			<button onClick={() => getJson()}>Get JSON</button>
			<textarea value={json}></textarea>
		</div>
	)
}

export default App
