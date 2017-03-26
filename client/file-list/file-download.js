import style from './style.scss'
import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'

module.exports = class FileDownload extends Component {

	componentDidMount() {
		ReactDOM.findDOMNode(this).submit()
		this.props.onDownloadComplete()
	}
	render() {
		const { actionPath, method } = this.props

		if (!actionPath) return null

		return (
<form
action={actionPath}
style={{ display: 'none' }}
method={method}
>
</form>
)
	}
}
