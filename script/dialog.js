var interface      = document.getElementById("interface")
var messageDisplay = document.getElementById("messageDisplay")
var dark           = document.getElementById("dark")
var message        = document.getElementById("message")


//event listener for Dark checkbox
dark.addEventListener("input", (event)=>{
	browser.storage.local.set({dark:event.target.checked})
	var header = document.querySelector("head")
	if (event.target.checked){
		var link = document.createElement("link")
		link.setAttribute("rel", "stylesheet")
		link.setAttribute("type","text/css")
		link.setAttribute("href","/style/dialogDark.css")
		link.setAttribute("id","darkStyle")
		header.appendChild(link)
	} else {
		header.removeChild(document.getElementById("darkStyle"))
	}
})

//event listener for show buttons on website or not
interface.addEventListener("input", (event)=>{
	browser.storage.local.set({displayInterface:event.target.checked})
})

//event listener for message
document.getElementsByName("messageDisplay").forEach((element)=>{
	element.addEventListener("click", (event)=>{
		console.log(event.target.value)
		browser.storage.local.set({messageDisplay:event.target.value})
		if (event.target.value == "default")
		{
			message.className = ""	
		}
		else
		{
			message.className = "hidden"
		}
	})
})


//function to change the width of textarea in function of the lenght of each lines
sizeFit = () =>{
	var lines = message.value.split("\n")
	var maxW = 46
	lines.forEach((l)=>{
		//console.log(l,maxW,l.length,l.length > maxW ? l.length : maxW)
		maxW = l.length > maxW ? l.length : maxW
	})

	message.setAttribute("cols",maxW)
}

//event listener for message
message.addEventListener("input", (event)=>{
	browser.storage.local.set({message:event.target.value})
	sizeFit()
})

//event listener for init dialog box
browser.storage.local.get(["displayInterface","messageDisplay","message","dark"]).then((response)=>{
	interface.checked    = response.displayInterface
	document.querySelector(`input[type='radio'][value='${response.messageDisplay || "perso"}']`).checked = true
	//messageDisplay.value = response.messageDisplay || "perso"
	dark.checked         = response.dark
	message.value        = response.message || ""
	sizeFit()

	var header = document.querySelector("head")
	if (response.dark){
		var link = document.createElement("link")
		link.setAttribute("rel", "stylesheet")
		link.setAttribute("type","text/css")
		link.setAttribute("href","/style/dialogDark.css")
		link.setAttribute("id","darkStyle")
		header.appendChild(link)
	}

	if (response.messageDisplay == "default")
	{
		message.className = ""	
	}
	else
	{
		message.className = "hidden"
	}
})