var message = ""
var messageType = "perso"


//parse href of mail link
parseHrefArg = (href) =>{
	var args = href.split("?")[1].split("&")
	var jsonArgs = {}
	args.forEach( (element, index) => {
		var nameValue = element.split("=")
		jsonArgs[nameValue[0]] = nameValue[1]
	})

	return jsonArgs
}

//generate the delete link
generateDelLink = (idCommunication) =>{
	return `https://joseph-saverne.mon-ent-occitanie.fr/sg.do` +
				`?PROC=MESSAGERIE&ACTION=MASQUER_COMMUNICATION&ID_COMMUNICATION=${idCommunication}`
}

//generate definitive delete link
generateDeffinitiveDelLink = (idCommunication) =>{
	return `https://joseph-saverne.mon-ent-occitanie.fr/sg.do` +
				`?PROC=MESSAGERIE&ACTION=MASQUER_COMMUNICATION_DEFINITIVE&ID_COMMUNICATION=${idCommunication}`
}

//init XMLHttpRequest
var sendMessage = new XMLHttpRequest()

sendMessage.addEventListener('load', (event) => {
	//console.log(sendMessage.status,sendMessage.responseText)
	if (sendMessage.status == 200){
		chrome.runtime.sendMessage({
			type:"notification",
			title:"Envoi d'un message",
			message:"Le message a été correctement envoyé",
			imageUrl:chrome.extension.getURL("icons/icon96.png")
		})
	} else {
		chrome.runtime.sendMessage({
			type:"notification",
			title:"Envoi d'un message",
			message:`Une erreur est survenue: code:${sendMessage.status}`,
			imageUrl:chrome.extension.getURL("icons/icon96.png")
		})
	}
})

//in case of errors
sendMessage.addEventListener('error', (event) => {
	//console.log(sendMessage.status,sendMessage.responseText)
	chrome.runtime.sendMessage({
		type:"notification",
		title:"Envoi d'un message",
		message:`Une erreur est survenue (erreur interne)`,
		imageUrl:chrome.extension.getURL("icons/icon96.png")
	})
})

//in case of abort
sendMessage.addEventListener('abort', (event) => {
	//console.log(sendMessage.status,sendMessage.responseText)
	chrome.runtime.sendMessage({
		type:"notification",
		title:"Envoi d'un message",
		message:`Une erreur est survenue (requete annulée)`,
		imageUrl:chrome.extension.getURL("icons/icon96.png")
	})
})

//send form function
sendForm = (jsonData) =>{
	var formDat = new FormData()

	//create form object
	for (let [key, value] of Object.entries(jsonData)) {
		formDat.append(key,value)
	}

	sendMessage.open("post","https://joseph-saverne.mon-ent-occitanie.fr/sg.do",true)
	sendMessage.send(formDat)
}

createCustomMessage = (delLink,subject,idCommunication) =>{
	var message = document.getElementById("wysiwygEntImagerMessage").innerHTML
	message = `${message}<p><img src="${delLink}"></p>`
	var formCustom = {
		ACTION: "AJOUTER_PARTICIPATION_FIL_MESSAGES",
		ID_COMMUNICATION: idCommunication,
		MESSAGE_PARTICIPATION:message,
		NOM_ACTION: "AJOUTER_PARTICIPATION_FIL_MESSAGES",
		PIECEJOINTE_REP: "",
		PROC: "MESSAGERIE",
		SERVICE_COURANT: "MESSAGERIE",
		SUJET: subject,
		LOCALE: "0",
		PIECEJOINTE_REP: "",
		PJ_HAS_CHANGED: "false",

	}
	sendForm(formCustom)
}

//function for delButton's click event
delButtonEvent = (mailLink,sender)=>{
	var editorDialog = document.getElementById("wysiwygEntImager")

	if (conf = confirm("Êtes vous sur de vouloir continuer?\nCette action est définitive et peut causer des problèmes au autres utilisateurs.")){
		var args = parseHrefArg(mailLink.href)

		var delLink = ""

		if (sender.classList.contains("definitive"))
			delLink = generateDeffinitiveDelLink(args["ID_COMMUNICATION"])
		else
			delLink = generateDelLink(args["ID_COMMUNICATION"])

		if (messageType == "none"){
			 message = ""
		}

		if (messageType != "perso"){
			var form = {
				ACTION: "AJOUTER_PARTICIPATION_FIL_MESSAGES",
				ID_COMMUNICATION: args["ID_COMMUNICATION"],
				MESSAGE_PARTICIPATION:`<p>${message}</p><p><img src="${delLink}"></p>`,
				NOM_ACTION: "AJOUTER_PARTICIPATION_FIL_MESSAGES",
				PIECEJOINTE_REP: "",
				PROC: "MESSAGERIE",
				SERVICE_COURANT: "MESSAGERIE",
				SUJET: mailLink.innerText,
				LOCALE: "0",
				PIECEJOINTE_REP: "",
				PJ_HAS_CHANGED: "false",

			}

			sendForm(form)
		} else {
			editorDialog.classList.add("modal--show")
			editorDialog.classList.remove("hide")

			document.getElementById("validate").onclick = (event)=>{
				createCustomMessage(delLink,mailLink.innerText,args["ID_COMMUNICATION"])
			}
		}
	}
}


//add all button
document.querySelectorAll(".row.row--full.list-enhanced1__item").forEach((element,index)=>{

	//prevent reload of the add on
	var holdElement = document.getElementById(`buttonContenerEntImagesHack.${index}`)
	if (!(holdElement == undefined || typeof(holdElement) == null)){
		element.removeChild(holdElement)
	}
	//create contener for buttons
	var contener = document.createElement("div")
	contener.className = "col col--xs-12"
	contener.setAttribute("id", `buttonContenerEntImagesHack.${index}`)

	//create icon
	var icon = document.createElement("span")
	icon.className = "icon icon--trash-warn"



	var buttonDel = document.createElement("button")
	buttonDel.appendChild(icon.cloneNode())
	buttonDel.appendChild(document.createTextNode("Envoyer une image de supression"))
	buttonDel.className = "entImagesDeleteButton"

	var buttonDeffinitiveDel = document.createElement("button")
	buttonDeffinitiveDel.appendChild(icon.cloneNode())
	buttonDeffinitiveDel.appendChild(document.createTextNode("Envoyer une image de supression définitive"))
	buttonDeffinitiveDel.className = "entImagesDeleteButton definitive"

	contener.appendChild(buttonDel)
	contener.appendChild(buttonDeffinitiveDel)
	element.appendChild(contener)


	var mailLink = element.getElementsByClassName("text--ellipsis js-consulterMessage")[0]

	//add eventlistener to button
	buttonDel.addEventListener("click", (event) => {
		event.preventDefault()
		delButtonEvent(mailLink,event.target)
	})

	buttonDeffinitiveDel.addEventListener("click", (event) => {
		event.preventDefault()
		delButtonEvent(mailLink,event.target)
	})

})

//change the display of all buttons
changeButtonsDisplay = (display = '') =>{
	document.querySelectorAll(".entImagesDeleteButton").forEach((element)=>{
		element.style.display = display
	})
}

//init data with local storage
chrome.storage.local.get(["displayInterface","messageDisplay","message"],(response)=>{
	if (!response.displayInterface){
		changeButtonsDisplay("")
	} else {
		changeButtonsDisplay("none")
	}

	if (response.message){
		message = response.message.replace("\n","<br/>")
	}

	if (response.messageDisplay){
		messageType = event.messageDisplay.newValue
	}
})

//change if the storage change
chrome.storage.onChanged.addListener((event)=>{
	console.log(event)
	
	if (event.displayInterface){
		if (!event.displayInterface.newValue){
			changeButtonsDisplay("")
		} else {
			changeButtonsDisplay("none")
		}
	}

	if (event.message){
		message = event.message.newValue.replace("\n","<br/>")
	}

	if (event.messageDisplay){
		messageType = event.messageDisplay.newValue
	}
})

// console.log('loaded')