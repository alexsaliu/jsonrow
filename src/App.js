import {useState, useEffect} from 'react'
import axios from 'axios'

const App = () => {
	const [apiKey, setApiKey] = useState('')
	const [text, setText] = useState('{"test": "test"}')
	const [json, setJson] = useState('')

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
			<div>{json}</div>
		</div>
	)
}

export default App
