import {useState, useEffect, useRef} from 'react'
import axios from 'axios'

import { formatJsonAsHtml, copyToClipboard } from './helpers.js'

const App = () => {
	const [apiKey, setApiKey] = useState('')
	const [text, setText] = useState('{"test": "test"}')
	const [json, setJson] = useState({
		"test": "hi there friend",
		"test1": 1,
		"test2": true,
		"test3": {
			"testDeep": "ok"
		},
		"test4": [1, true, false, "hi", [1235, {"ok": {"ok": 232}}, false]]
	})
	const [formattedJson, setFormattedJson] = useState({})

	const jsonRef = useRef(null)

	useEffect(() => {
		setFormattedJson(formatJsonAsHtml(json))
	}, [json])

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

	return (
		<div className="App">
			<div className="content">
				<h1 className="title">JSONrow</h1>
				<h4 className="tagline">An minamilist API to store and retrieve your JSON</h4>
				<div className="input-container">
					<input className="apikey-input" onChange={(e) => {setApiKey(e.target.value)}} value={apiKey} placeholder="Enter existing API key or generate" type="text" />
					<button onClick={() => generateKey()}>Generate Key</button>
				</div>

				<div className="container">
					<div>
						<div className="formatted-json" dangerouslySetInnerHTML={{__html: formattedJson}}></div>
						<div className="endpoint">GET  https://jsonrow.herokuapp.com/user/{apiKey ? apiKey : '{API key}'}</div>
						<button onClick={() => getJson()}>Get JSON</button>
					</div>

					<div>
						<textarea onChange={(e) => setText(e.target.value)} placeholder='{"test": "test"}'></textarea>
						<div className="endpoint">GET  https://jsonrow.herokuapp.com/user/{apiKey ? apiKey : '{API key}'}</div>
						<button onClick={() => sendJson()}>Send JSON</button>
					</div>
				</div>
			</div>


			{/* <button onClick={() => copyToClipboard(jsonRef.current.innerHTML)}>Copy</button> */}
			{/* <div className="json-container" onClick={() => copyToClipboard(apiKey)}></div> */}
			<pre hidden>
				<code ref={jsonRef}>
					{JSON.stringify(json, null, 4)}
				</code>
			</pre>
		</div>
	)
}

export default App
