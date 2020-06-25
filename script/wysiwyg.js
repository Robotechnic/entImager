selectElementContents = (el) => {
    if (window.getSelection && document.createRange) {
        var sel = window.getSelection()
        var range = document.createRange()
        range.selectNodeContents(el)
        sel.removeAllRanges()
        sel.addRange(range)
    } else if (document.selection && document.body.createTextRange) {
        var textRange = document.body.createTextRange()
        textRange.moveToElementText(el)
        textRange.select()
    }
}

dislogDisplay = (display,editorDialog) =>{
	//console.log(display)
	if (display){
		editorDialog.classList.add("modal--show")
		editorDialog.classList.remove("hide")
	} else {
		editorDialog.classList.remove("modal--show")
		editorDialog.classList.add("hide")
	}
}

//add wysiwyg to the page
var doc = chrome.extension.getURL("/views/wysiwyg.html")
//console.log(doc)

var temp = document.getElementById("wysiwygEntImager")
if ( temp !== null)
	temp.remove()

setButtonSelected = () =>{
	var commandList = ["bold","italic","insertOrderedList","insertUnorderedList","superscript","subscript"]
	commandList.forEach((element)=>{
		if(document.queryCommandState(element)){
			document.querySelector(`button[name="${element}"]`).classList.add("active")
		} else {
			document.querySelector(`button[name="${element}"]`).classList.remove("active")
		}
	})
}

fetch(doc).then((response)=>{
	response.text().then((responseText)=>{
		//add element
		document.querySelector("body").insertAdjacentHTML("beforeend",responseText)

		//add event listener
		var editor = document.getElementById("wysiwygEntImagerMessage")

		editor.addEventListener("click",setButtonSelected)
		editor.addEventListener("keypress",setButtonSelected)

		document.querySelectorAll(".wysiwygEntImagerToolButton").forEach((element)=>{
			element.addEventListener("click",(event)=>{
				var sender = event.target
				if (event.target.nodeName != "button")
					sender = sender.parentNode

				var command = sender.name
				//console.log(command)
				document.execCommand(command)
				//there is a bug with bold if the font weight > 400 so, this code fix that
				if (command = "bold"){
					document.querySelectorAll("#wysiwygEntImagerMessage span").forEach((element) =>{
						if(element.style = "font-weight: normal;"){
							var b = document.createElement("b")
							b.innerHTML = element.innerHTML
							element.parentNode.replaceChild(b,element)
							selectElementContents(b)
						}
					})
				}
				editor.focus()
				setButtonSelected()
			})
		})

		document.getElementById("validate").addEventListener("click",(event)=>{
			var dialog = document.getElementById('wysiwygEntImager')
			//console.log('validate')
			dislogDisplay(false,dialog)
		})

		document.getElementById("cancel").addEventListener("click",(event)=>{
			var dialog = document.getElementById('wysiwygEntImager')
			//console.log('cancel')
			dislogDisplay(false,dialog)
		})

		document.getElementById("wysiwygEntImagerClose").addEventListener("click", (event)=>{
			var dialog = document.getElementById('wysiwygEntImager')
			//console.log('close')
			dislogDisplay(false,dialog)
		})
	})
})

console.log('loaded')