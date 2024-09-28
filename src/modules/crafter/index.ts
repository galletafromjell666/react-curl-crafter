import { isEmpty } from "lodash";

interface Header {
  key: string;
  value: string;
}

interface JsonData {
  [key: string]: string;
}

interface FormState {
  url: string;
  method: "GET" | "DELETE" | "PUT" | "POST" | "PATCH";
  headers: Header[];
  data: JsonData | string;
}

const NEW_LINE = '\n'
const TAB = '\t'
const CONTINUE_ON_NEW_LINE = ` \\${NEW_LINE}${TAB}`

export function craftCurl(formState: FormState) {
	let curlString = `curl '${formState.url}'${CONTINUE_ON_NEW_LINE}-X '${formState.method}'`
	const data = getData(formState)
	const headers = [...formState.headers]
	if (data) headers.push(data.contentHeader)
	const headersString = getHeadersString(headers)

	if(headers)curlString = curlString.concat(headersString)
	if(data?.stringData) curlString = curlString.concat(data.stringData)

	return curlString
}

export function getHeadersString(headers: Header[]): string {
	if (isEmpty(headers)) return ''
	// not empty
	let headersString = ''
	headers.forEach((header) => {
		const headerString = `${CONTINUE_ON_NEW_LINE}-H '${header.key}: ${header.value}'`
		headersString = headersString.concat(headerString)
	})
	return headersString
}

export function getData(
	formState: FormState
): { contentHeader: Header; stringData: string } | null {
	const { data } = formState
	if (isEmpty(data)) return null
	// Not empty
	let stringData = ''
	const contentHeader = { key: 'Content-Type', value: '' }
	try {
		const jsonStringData = JSON.stringify(data)
		stringData = `$${jsonStringData}`
		contentHeader.value = 'application/json'
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		stringData = data as string
		contentHeader.value = 'text/plain'
	}
	// Remove all whitespace
	stringData = stringData.replace(/ {2}|\r\n|\n|\r/gm, '')
	stringData = `${CONTINUE_ON_NEW_LINE}--data-raw ${stringData}`
	return { contentHeader, stringData }
}
