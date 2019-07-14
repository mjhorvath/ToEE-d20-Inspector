// This is free and unencumbered software released into the public domain.
// 
// Anyone is free to copy, modify, publish, use, compile, sell, or
// distribute this software, either in source code form or as a compiled
// binary, for any purpose, commercial or non-commercial, and by any
// means.
// 
// In jurisdictions that recognize copyright laws, the author or authors
// of this software dedicate any and all copyright interest in the
// software to the public domain. We make this dedication for the benefit
// of the public at large and to the detriment of our heirs and
// successors. We intend this dedication to be an overt act of
// relinquishment in perpetuity of all present and future rights to this
// software under copyright law.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
// OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
// ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.
// 
// For more information, please refer to <http://unlicense.org/>


var error_section = ''
var characters_table = {}
var descriptions_table = {}
//var protos_path = 'protos_mini_co8.tab'
var protos_path = 'protos.tab'
var descriptions_path = 'description.mes'
var not_applicable = "n/a"

function errorHandler(message, url, line)
{
	var new_message = error_section
	new_message += '\nError: ' + message
	new_message += '\nLine: ' + line
	new_message += '\nURL: ' + url
	alert(new_message)
	return true
}
window.onerror = errorHandler

function init()
{
	resize_box()
	window.onresize = resize_box
	read_descriptions()
	load_protos()
}

function load_protos()
{
	read_protos()
	for (var i in characters_table)
	{
		if (characters_table[i].char_inp.OBJECTTYPE == 'obj_t_npc')
		{
			calc_stuff(i)
		}
	}
	print_front_table()
}

function read_descriptions()
{
	var forReading = 1, forWriting = 2, forAppending = 8
	// Create the object 
	var fs = new ActiveXObject('Scripting.FileSystemObject')
	var f = fs.GetFile(descriptions_path)
	// Open the file 
	var is = f.OpenAsTextStream(forReading, 0)
	// start and continue to read until we hit the end of the file. 
	while (!is.AtEndOfStream)
	{
		var input_text = is.ReadLine()
		var match_regx = /\{([^\{\}]*)\}/g
		var match_result = input_text.match(match_regx)
		if (match_result)
		{
			var result_1 = match_result[0].replace(match_regx, '$1')
			var result_2 = match_result[1].replace(match_regx, '$1')
			descriptions_table[result_1] = result_2
		}
	}
	// Close the stream 
	is.Close()
}

function read_protos()
{
	var forReading = 1, forWriting = 2, forAppending = 8
	// Create the object 
	var fs = new ActiveXObject('Scripting.FileSystemObject')
	var f = fs.GetFile(protos_path)
	// Open the file 
	var is = f.OpenAsTextStream(forReading, 0)
	// start and continue to read until we hit the end of the file. 
	while (!is.AtEndOfStream)
	{
		var temp_line = is.ReadLine()
		var proto_number = null
		var temp_table = temp_line.split('\t')
		var temp_hash = {}
		for (var i = 0, n = temp_table.length; i < n; i++)
		{
			var this_field = protos_fields[i].toString()
			var this_value = temp_table[i].toLowerCase()
			if (this_value == '')
			{
				this_value = null
			}
			if (this_field == 'PROTONUMBER')
			{
				proto_number = this_value
			}
			temp_hash[this_field] = this_value
		}
		characters_table[proto_number] = {}
		characters_table[proto_number].char_inp = temp_hash
		characters_table[proto_number].char_out = characters_table[proto_number].char_inp
		characters_table[proto_number].char_pro = {}
		characters_table[proto_number].char_raw = {}
		characters_table[proto_number].char_dsc = {}
		characters_table[proto_number].err_pro = {}
		characters_table[proto_number].err_raw = {}
		characters_table[proto_number].err_total = 0
	}
	// Close the stream 
	is.Close()
}

// Returns the version of Internet Explorer or a -1 (indicating the use of another browser).
// Should return IE 7 in our case.
function getInternetExplorerVersion()
{
	var rv = -1	// Return value assumes failure.
	if (navigator.appName == 'Microsoft Internet Explorer')
	{
		var ua = navigator.userAgent
		var re  = new RegExp('MSIE ([0-9]{1,}[\.0-9]{0,})')
		if (re.exec(ua) != null)
		{
			rv = parseFloat(RegExp.$1)
		}
	}
	return rv
}
function CustomErrorMessage_broken(my_message, e)
{
	my_message += '\n' + e.name
	my_message += '\n' + e.number
	my_message += '\n' + e.toString()
	my_message += '\n' + e.message
	// not supported in IE7 goddammit
//	my_message += '\n' + e.fileName
//	my_message += '\n' + e.lineNumber
//	my_message += '\n' + e.columnNumber
//	my_message += '\n' + e.stack
//	my_message += '\n' + e.toSource()
	alert(my_message)
}
function CustomErrorMessage(my_message, e)
{
	error_section = my_message
//	CustomErrorMessage_broken(my_message, e)
	throw e
}

function prepare_output()
{
}

function print_front_table()
{
	var target_table = document.getElementById('front_table')
	// remove any existing nodes first
	while (target_table.firstChild)
	{
		target_table.removeChild(target_table.firstChild);
	}
	// header row
	var tbl_row = document.createElement('tr')

	var tbl_hed = document.createElement('th')
	var tbl_txt = document.createTextNode('PROTO ID#')
	tbl_hed.className = 'datacell'
	tbl_hed.appendChild(tbl_txt)
	tbl_row.appendChild(tbl_hed)

	tbl_hed = document.createElement('th')
	tbl_txt = document.createTextNode('NAME')
	tbl_hed.className = 'datacell'
	tbl_hed.appendChild(tbl_txt)
	tbl_row.appendChild(tbl_hed)

	tbl_hed = document.createElement('th')
	tbl_txt = document.createTextNode('ISSUES')
	tbl_hed.className = 'datacell'
	tbl_hed.appendChild(tbl_txt)
	tbl_row.appendChild(tbl_hed)

	tbl_hed = document.createElement('th')
	tbl_txt = document.createTextNode('SUMMARY')
	tbl_hed.className = 'datacell'
	tbl_hed.appendChild(tbl_txt)
	tbl_row.appendChild(tbl_hed)

	tbl_hed = document.createElement('th')
	tbl_txt = document.createTextNode('PROTOS')
	tbl_hed.className = 'datacell'
	tbl_hed.appendChild(tbl_txt)
	tbl_row.appendChild(tbl_hed)

	tbl_hed = document.createElement('th')
	tbl_txt = document.createTextNode('OUTPUT')
	tbl_hed.className = 'datacell'
	tbl_hed.appendChild(tbl_txt)
	tbl_row.appendChild(tbl_hed)

	target_table.appendChild(tbl_row)

	// row for every character
	for (var i in characters_table)
	{
		var this_char = characters_table[i]
		char_inp = this_char.char_inp
		err_total = this_char.err_total
		if (char_inp.OBJECTTYPE == 'obj_t_npc')
		{
			tbl_row = document.createElement('tr')

			// proto id
			tbl_hed = document.createElement('td')
			tbl_hed.className = 'datacell green'
			tbl_txt = document.createTextNode(i)
			tbl_hed.appendChild(tbl_txt)
			tbl_row.appendChild(tbl_hed)

			// name
			tbl_hed = document.createElement('td')
			tbl_hed.className = 'datacell green'
			tbl_txt = document.createTextNode(descriptions_table[char_inp.DESCRIPTION_ID])
			tbl_hed.appendChild(tbl_txt)
			tbl_row.appendChild(tbl_hed)

			// is error
			tbl_hed = document.createElement('td')
			tbl_hed.className = 'datacell green'
			tbl_txt = document.createTextNode(err_total)
			tbl_hed.appendChild(tbl_txt)
			tbl_row.appendChild(tbl_hed)

			// summary button
			tbl_hed = document.createElement('td')
			tbl_hed.className = 'datacell green'
			tbl_txt = document.createElement('input')
			tbl_txt.setAttribute('type', 'button')
			tbl_txt.value = 'Click Me'
			tbl_txt.onclick = print_calc_table
			tbl_txt.id = i
			tbl_hed.appendChild(tbl_txt)
			tbl_row.appendChild(tbl_hed)

			// compare button
			tbl_hed = document.createElement('td')
			tbl_hed.className = 'datacell green'
			tbl_txt = document.createElement('input')
			tbl_txt.setAttribute('type', 'button')
			tbl_txt.value = 'To do.'
			tbl_txt.onclick = to_do_alert
			tbl_txt.id = i
			tbl_hed.appendChild(tbl_txt)
			tbl_row.appendChild(tbl_hed)

			// output button
			tbl_hed = document.createElement('td')
			tbl_hed.className = 'datacell green'
			tbl_txt = document.createElement('input')
			tbl_txt.setAttribute('type', 'button')
			tbl_txt.value = 'To do.'
			tbl_txt.onclick = to_do_alert
			tbl_txt.id = i
			tbl_hed.appendChild(tbl_txt)
			tbl_row.appendChild(tbl_hed)

			target_table.appendChild(tbl_row)
		}
	}
	document.getElementById('load_text').style.display = 'none'
	target_table.style.display = 'table'
}

function to_do_alert()
{
	alert('To do.')
}

function print_compare_table()
{
	var target_table = document.getElementById('raw_table')
	// remove any existing nodes first
	while (target_table.firstChild)
	{
		target_table.removeChild(target_table.firstChild);
	}
	// header row
	var tbl_row = document.createElement('tr')
	var tbl_hed = document.createElement('th')
	var tbl_txt = document.createTextNode('DETAIL')
	tbl_hed.className = 'datacell'
	tbl_hed.appendChild(tbl_txt)
	tbl_row.appendChild(tbl_hed)

	tbl_hed = document.createElement('th')
	tbl_txt = document.createTextNode('PROTO ID#')
	tbl_hed.className = 'datacell'
	tbl_hed.appendChild(tbl_txt)
	tbl_row.appendChild(tbl_hed)

	tbl_hed = document.createElement('th')
	tbl_txt = document.createTextNode('NAME')
	tbl_hed.className = 'datacell'
	tbl_hed.appendChild(tbl_txt)
	tbl_row.appendChild(tbl_hed)
/*
	for (var i = 0, n = protos_fields.length; i < n; i++)
	{
		tbl_hed = document.createElement('th')
		tbl_txt = document.createTextNode(protos_fields[i])
		tbl_hed.appendChild(tbl_txt)
		tbl_hed.className = 'datacell'
		tbl_row.appendChild(tbl_hed)
	}
*/
	target_table.appendChild(tbl_row)
	// row for every character
	for (var i in characters_table)
	{
		char_inp = characters_table[i].char_inp
		if (char_inp.OBJECTTYPE == 'obj_t_npc')
		{
			prepare_output()
			tbl_row = document.createElement('tr')
			tbl_hed = document.createElement('td')
			tbl_hed.className = 'datacell red'
			tbl_txt = document.createElement('input')
			tbl_txt.setAttribute('type', 'button')
			tbl_txt.value = 'Show'
			tbl_txt.onclick = print_calc_table
			tbl_txt.id = i
			tbl_txt.className = 'ctd'
			tbl_hed.appendChild(tbl_txt)
			tbl_row.appendChild(tbl_hed)

			tbl_hed = document.createElement('td')
			tbl_hed.className = 'datacell red'
			tbl_txt = document.createTextNode(i)
			tbl_hed.appendChild(tbl_txt)
			tbl_row.appendChild(tbl_hed)

			tbl_hed = document.createElement('td')
			tbl_hed.className = 'datacell red'
			tbl_txt = document.createTextNode(descriptions_table[char_inp['DESCRIPTION_ID']])
			tbl_hed.appendChild(tbl_txt)
			tbl_row.appendChild(tbl_hed)
	/*
			for (var j in char_inp)
			{
				tbl_hed = document.createElement('td')
				div_hed = document.createElement('div')
				tbl_hed.className = 'datacell red'
				div_hed.className = 'divcell'
				tbl_txt = document.createTextNode(NullToBlank(char_inp[j]))
				div_hed.appendChild(tbl_txt)
				tbl_hed.appendChild(div_hed)
				tbl_row.appendChild(tbl_hed)
			}
	*/
			target_table.appendChild(tbl_row)
		}
	}
}

function print_calc_table()
{
	var selected_character = characters_table[window.event.srcElement.id]
	var char_inp = selected_character.char_inp
	var char_pro = selected_character.char_pro
	var char_raw = selected_character.char_raw
	var char_dsc = selected_character.char_dsc
	var err_pro = selected_character.err_pro
	var err_raw = selected_character.err_raw
	var child_window = window.showModelessDialog('library/child_window.hta', null, 'dialogHide:yes;scroll:yes;dialogWidth:800px;dialogHeight:800px;resizable:no;')
//	var child_window = window.open('library/child_window.html', 'child_window', 'width=800,height=800,location=no,menubar=no,status=no,toolbar=no')
	child_window.document.title = 'Summary - ' + char_inp.PROTONUMBER + ' - ' + descriptions_table[char_inp.DESCRIPTION_ID]
	var target_table = child_window.document.getElementById('calc_table')
	// clear the table before we begin (no longer necessary)
//	while (target_table.firstChild)
//	{
//		target_table.removeChild(target_table.firstChild);
//	}
	// add the header row
	var tbl_row = child_window.document.createElement('tr')
	var tbl_cll = child_window.document.createElement('th')
	var tbl_txt = child_window.document.createTextNode('Label')
	tbl_cll.appendChild(tbl_txt)
	tbl_row.appendChild(tbl_cll)
	tbl_cll = child_window.document.createElement('th')
	tbl_txt = child_window.document.createTextNode('PROTOS')
	tbl_cll.appendChild(tbl_txt)
	tbl_row.appendChild(tbl_cll)
	tbl_cll = child_window.document.createElement('th')
	tbl_txt = child_window.document.createTextNode('RAW')
	tbl_cll.appendChild(tbl_txt)
	tbl_row.appendChild(tbl_cll)
	tbl_cll = child_window.document.createElement('th')
	tbl_txt = child_window.document.createTextNode('Description')
	tbl_cll.appendChild(tbl_txt)
	tbl_row.appendChild(tbl_cll)
	target_table.appendChild(tbl_row)
	for (var i in char_pro)
	{
		// add the section headers
		if (char_pro[i] == "tool_section")
		{
			tbl_row = child_window.document.createElement('tr')
			tbl_cll = child_window.document.createElement('th')
			tbl_txt = child_window.document.createTextNode(char_dsc[i])
			tbl_cll.colSpan = 4
			tbl_cll.appendChild(tbl_txt)
			tbl_row.appendChild(tbl_cll)
			target_table.appendChild(tbl_row)
		}
		// add blank dividers
		else if (char_pro[i] == "tool_divider")
		{
			tbl_row = child_window.document.createElement('tr')
			tbl_cll = child_window.document.createElement('th')
			tbl_txt = child_window.document.createTextNode(char_dsc[i])
			tbl_cll.className = 'divider'
			tbl_cll.colSpan = 4
			tbl_cll.appendChild(tbl_txt)
			tbl_row.appendChild(tbl_cll)
			target_table.appendChild(tbl_row)
		}
		// add the table data
		else
		{
			tbl_row = child_window.document.createElement('tr')

			// label
			tbl_cll = child_window.document.createElement('td')
			tbl_txt = child_window.document.createTextNode(i)
			tbl_cll.appendChild(tbl_txt)
			tbl_row.appendChild(tbl_cll)

			// protos
			tbl_cll = child_window.document.createElement('td')
			tbl_txt = child_window.document.createTextNode(char_pro[i])
			if ((char_pro[i] == not_applicable) || (char_pro[i] == to_do))
			{
				tbl_cll.style.background = '#aaa'
			}
			else if (err_pro[i] == true)
			{
				tbl_cll.style.background = '#caa'
			}
			tbl_cll.appendChild(tbl_txt)
			tbl_row.appendChild(tbl_cll)

			// raw
			tbl_cll = child_window.document.createElement('td')
			tbl_txt = child_window.document.createTextNode(char_raw[i])

			if ((char_raw[i] == not_applicable) || (char_raw[i] == to_do))
			{
				tbl_cll.style.background = '#aaa'
			}
			else if (err_raw[i] == true)
			{
				tbl_cll.style.background = '#caa'
			}
			else if ((char_pro[i] != not_applicable) && (char_pro[i] != to_do) && (char_pro[i] != char_raw[i]))
			{
				tbl_cll.style.background = '#caa'
			}

			tbl_cll.appendChild(tbl_txt)
			tbl_row.appendChild(tbl_cll)

			// description
			tbl_cll = child_window.document.createElement('td')
			tbl_txt = child_window.document.createTextNode(char_dsc[i])
			tbl_cll.appendChild(tbl_txt)
			tbl_row.appendChild(tbl_cll)

			target_table.appendChild(tbl_row)
		}
	}
	child_window.document.getElementById('load_text').style.display = 'none'
	target_table.style.display = 'table'
}

function resize_box()
{
	var doc_height = document.documentElement.clientHeight
//	var doc_width = document.documentElement.clientWidth
	var this_box = document.getElementById('outer_box_2')
	this_box.style.height = doc_height - 150
//	this_box.style.width = doc_width
//	window.resizeTo(800, 600)
}

function alert_two(in_string)
{
	if (suppress_alerts == false)
	{
		alert(in_string)
	}
}
