/*
	CONFIGURATION
*/
const APIurl     = "https://api.github.com/"
const user       = "Robotechnic"
const repository = "entImager"

const header = new Headers()
header.append("Accept","application/vnd.github.v3+json")

releasesRequest = new Request(APIurl+"repos/"+user+"/"+repository+"/releases",{
	method:"GET",
	headers:header
})

/*
	FUNCTIONS
*/
getReleases = (callback) =>{
	fetch(releasesRequest).then((result)=>{
		result.json().then(callback)
	})
}

/*
	CODE
*/
var downloadContener = document.querySelector(".downloadContener")


getReleases((jsonResult)=>{
	if (jsonResult.message == "Not Found"){
		downloadContener.style.color = "red"
		downloadContener.style.display = 'flex'
		downloadContener.style.justifyContent = "center"
		downloadContener.innerHTML = "<h2>Releases not found</h2>"
	} else {

	}
	console.log(jsonResult)
})