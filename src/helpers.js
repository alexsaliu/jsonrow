export const formatJsonAsHtml = (json, level=0) => {
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

export const copyToClipboard = (text) => {
    function listener(e) {
        e.clipboardData.setData("text/plain", text)
        e.preventDefault()
    }
    document.addEventListener("copy", listener)
    document.execCommand("copy")
    document.removeEventListener("copy", listener)
}
