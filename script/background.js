//display notification on notification message
notification = (title,message,imageUrl) =>{
	//console.log("Nouvelle notification",title,message,imageUrl)
	browser.notifications.create({
		"type": "basic",
		"iconUrl": imageUrl,
		"title": title,
		"message": message
	})
}


//listen messages from page
messagesListener = (request) =>{
	if (request.type == "notification"){ //if the message request to display a notification
		notification(request.title,request.message,request.imageUrl)
	}
}

browser.runtime.onMessage.addListener(messagesListener)

//setup browther action
// disable if the page is not an ent page

var entValidator = /(http|https):\/\/([a-z\-])+.mon-ent-occitanie.([a-z]{2,4})/

manageBrowserAction = () =>{
	browser.tabs.query({currentWindow: true, active: true},(tab)=>{
		if (!Boolean(tab[0].url.match(entValidator))){
			browser.browserAction.disable(tab[0].id)
		}
	})
}


browser.tabs.onActivated.addListener(manageBrowserAction)

manageBrowserAction()