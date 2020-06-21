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
	})
})


console.log('loaded')