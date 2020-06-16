notification = (title,message,imageUrl) =>{
	//console.log("Nouvelle notification",title,message,imageUrl)
	browser.notifications.create({
		"type": "basic",
		"iconUrl": imageUrl,
		"title": title,
		"message": message
	})

}



messagesListener = (request) =>{
	if (request.type == "notification"){
		notification(request.title,request.message,request.imageUrl)
	}
}

browser.runtime.onMessage.addListener(messagesListener)