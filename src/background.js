// Dette her er greier for å sende svar til og hente svar fra eksternt API
chrome.runtime.onMessage.addListener(function(request, sender) {
	chrome.downloads.download({
		url: request.url,
		filename: request.filename,
		saveAs: true
	});
});
