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

const tagFormat = /v?([0-9]\.[0-9]\.[0-9])[a-z]?/

/*
	FUNCTIONS
*/
getReleases = (callback) =>{
	fetch(releasesRequest).then((result)=>{
		result.json().then(callback)
	})
}

compareTag = (currentTag, newTag) =>{
	let currentTagMatch = currentTag.match(tagFormat)
	if (currentTagMatch)
		currentTag = Number(currentTagMatch[1].replace(/\./g,""))
	else
		return false

	let newTagMatch = newTag.match(tagFormat)
	if (newTagMatch)
		newTag = Number(newTagMatch[1].replace(/\./g,""))
	else
		return false

	return newTag>currentTag
}

latestReleaseByBranch = (releases) =>{
	var latest = {}
	releases.forEach((release)=>{
		if (!latest[release.target_commitish])
			latest[release.target_commitish] = release
		else if (compareTag(latest[release.target_commitish].tag_name,release.tag_name))
			latest[release.target_commitish] = release
	})

	return latest
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
		let latestReleases = latestReleaseByBranch(jsonResult)
		document.querySelectorAll(".downloadLink-waitForData").forEach((element)=>{
			var releaseType = element.getAttribute("releaseType")
			if (latestReleases[releaseType] != undefined){
				element.querySelector(".downloadLink__version")
						.appendChild(
							document.createTextNode(latestReleases[releaseType].tag_name)
						)

				element.setAttribute("href", latestReleases[releaseType].assets[0].browser_download_url)
			} else {
				element.style.color = "red"
				element.style.display = 'flex'
				element.style.justifyContent = "center"
				element.innerHTML = "<h2>Release not found</h2>"
			}

			element.classList.remove("downloadLink-waitForData")
			element.classList.add("downloadLink")
		})
	}
})