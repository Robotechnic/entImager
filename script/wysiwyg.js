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



//add wysiwyg to the page
var doc = browser.extension.getURL("/views/wysiwyg.html")
console.log(doc)

var temp = document.getElementById("wysiwygEntImager")
if ( temp !== null)
	temp.remove()

fetch(doc).then((response)=>{
	response.text().then((responseText)=>{
		//add element
		document.querySelector("body").insertAdjacentHTML("beforeend",responseText)

		//add event listener
		document.getElementById("wysiwygEntImagerClose").addEventListener("click", (event)=>{
			var dialog = document.getElementById('wysiwygEntImager')
			dialog.classList.add("hide")
		})

		document.querySelectorAll(".wysiwygEntImagerToolButton").forEach((element)=>{
			element.addEventListener("click",(event)=>{
				var sender = event.target
				if (event.target.nodeName != "button")
					sender = sender.parentNode

				var command = sender.name
				console.log(command)
				document.execCommand(command)
				//there is a bug with bold, so:
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
			})
		})
	})
})


console.log('loaded')