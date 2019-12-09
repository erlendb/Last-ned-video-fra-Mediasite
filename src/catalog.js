function inject_catalog() {
	$(document).ready(function(){
		waitForTable = setInterval(function(){
			if ($('#presentationTableView').length) {
				clearInterval(waitForTable);
				insertLoadButton();
				//insertDownloadButtons();
			}
		}, 100);
	});
}

function insertLoadButton() {
	titleElm = $('#contentAreaBottom');

	loadBtn = $(document.createElement('a'))
		.text('Load download buttons')
		.addClass('loadBtn')
		.attr('href', '#')
		.click(insertDownloadButtons)
		.insertBefore(titleElm);
}

function insertDownloadButtons() {
	$('.presentationTableView_GridItem, .presentationTableView_GridAltItem').each(function(){
		insertDownloadButton(this);
	});
}

function insertDownloadButton(tr) {
	tr = $(tr);
	id = tr.attr('id');
	text = tr.find('#playerLink').text() + '.mp4';

	var downloadVideoBtn = $(document.createElement('a'))
		.text('Download video')
		.addClass('downloadVideoBtn')
		.attr('id', id)
		.attr('download', text)
		.hide()
		.appendTo(tr);

	getVideoUrl(id, function(videoUrl){
		//console.log(id + ' : ' + videoUrl);
		//console.log(downloadVideoBtn);
		downloadVideoBtn.attr('data-url', videoUrl);
		downloadVideoBtn.click(function(){
			downloadVideo(videoUrl, downloadVideoBtn.attr('download'));
		});
		downloadVideoBtn.show();
	});

}

function downloadVideo(url, filename) {
	filename = str = filename.replace(/:/g,''); // Remove colons
	chrome.runtime.sendMessage({
		url: url,
		filename: filename
	});
}

function getVideoUrl(resourceId, callback) {
	dataString = '{"getPlayerOptionsRequest":{"ResourceId":"' + resourceId + '","QueryString":"","UseScreenReader":false,"UrlReferrer":""}}';
	url = 'https://mediasite.ntnu.no/Mediasite/PlayerService/PlayerService.svc/json/GetPlayerOptions';

	$.ajax({
		type: 'POST',
		url: url,
		data: dataString,
		dataType: 'json',
		contentType: 'application/json',
		success: function(response) {
			videoUrl = response.d.Presentation.Streams[0].VideoUrls[0].Location;
			callback(videoUrl);
		}
	});
}
