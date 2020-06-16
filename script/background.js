//display notification on notification message
notification = (title,message,imageUrl) =>{
	//console.log("Nouvelle notification",title,message,imageUrl)
	chrome.notifications.create({
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

chrome.runtime.onMessage.addListener(messagesListener)