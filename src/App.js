import {useState, useEffect, useRef} from 'react'
import axios from 'axios'

import BracketLoader from './BracketLoader.js'
import { formatJsonAsHtml, copyToClipboard } from './helpers.js'
const API = process.env.REACT_APP_API

const App = () => {
	const [apiKey, setApiKey] = useState('')
	const [text, setText] = useState('{"test": "test"}')
	const [json, setJson] = useState()
	const [formattedJson, setFormattedJson] = useState({})
	const [processingRequest, setProcessingRequest] = useState(0)
	const [success, setSuccess] = useState(false)
	const [error, setError] = useState({'number': 0, 'messaage': ''})

	const jsonRef = useRef(null)

	useEffect(() => {
		setFormattedJson(formatJsonAsHtml(json))
	}, [json])

	const handleRequest = async (number, request) => {
		setSuccess(false)
		setProcessingRequest(number)
		await request()
		setProcessingRequest(0)
	}

	const generateKey = async () => {
		try {
			const res = await axios.get(`${API}/new`)
			console.log(res.data.api_key)
			setApiKey(res.data.api_key)
			setError({'number': 0, 'message': ''})
		}
		catch (e) {
			console.log(e.response.data)
			console.log(e.response.status)
			const message = handleErrorMessage(e.response)
			setError({'number': 1, message})
		}
	}

	const getJson = async () => {
		try {
			const res = await axios.get(`${API}/user/${apiKey}`)
			console.log(res.data.json)
			setJson(res.data.json)
			setError({'number': 0, 'message': ''})
		}
		catch(e) {
			console.log(e.response.data)
			console.log(e.response.status)
			const message = handleErrorMessage(e.response)
			setError({'number': 2, message})
		}
	}

	const sendJson = async () => {
		try {
			const res = await axios.post(`${API}/user/${apiKey}`, {
				json: text
			})
			console.log(res.data.json)
			setError({'number': 0, 'message': ''})
			setSuccess(true)
		}
		catch(e) {
			console.log(e.response.data)
			console.log(e.response.status)
			const message = handleErrorMessage(e.response)
			setError({'number': 3, message})
		}
	}

	const handleErrorMessage = (response) => {
		const status = response.status
		if (status === 404) return '404 - Not Found'
		if (status === 408) return '408 - Request Timeout'
		if (status === 500 || status === 401) return response.data
		return 'Response status code - ' + response.status
	}


	return (
		<div className="App">
			<div className="content">
				<h1 className="title">JSONrow</h1>
				<h4 className="tagline">A minimalist API to store and retrieve your JSON</h4>
				<div className="input-container">
					<input className="apikey-input" onChange={(e) => {setApiKey(e.target.value)}} value={apiKey} placeholder="Enter existing API key or generate" type="text" />
					<button onClick={() => handleRequest(1, generateKey)}>Generate Key</button>
					{processingRequest === 1 ? <div className="loader1">
						<BracketLoader />
					</div> : ''}
				</div>
				{error.number === 1 ? <div className="copy error">{error.message}</div> : ''}

				<div className="container">
					<div>
						<div className="formatted-json" dangerouslySetInnerHTML={{__html: formattedJson}}></div>
						<div className="copy">GET &nbsp; https://jsonrow.herokuapp.com/user/{apiKey ? apiKey : '{API key}'}</div>
						<div className="copy" style={{color: '#ffffff'}}>-</div>
						<div className="button-container">
							<button onClick={() => handleRequest(2, getJson)}>Get JSON</button>
							{ processingRequest === 2 ? <div className="loader3">
								<BracketLoader />
							</div> : ''}
						</div>
						{error.number === 2 ? <div className="copy error">{error.message}</div> : ''}
					</div>

					<div>
						<textarea onChange={(e) => setText(e.target.value)} placeholder='{"test": "test"}'></textarea>
						<div className="copy">POST &nbsp; https://jsonrow.herokuapp.com/user/{apiKey ? apiKey : '{API key}'}</div>
						<div className="copy">Body &nbsp; {'{'}json: <span style={{color: "var(--green)"}}>{'{'}your json{'}'}</span>{'}'}</div>
						<div className="button-container">
							<button onClick={() => handleRequest(3, sendJson)}>Send JSON</button>
							{ processingRequest === 3 ? <div className="loader3">
								<BracketLoader />
							</div> : ''}
						</div>
						{error.number === 3 ? <div className="copy error">{error.message}</div> : ''}
						{success ? <div className="copy success">Success!</div> : ''}
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
