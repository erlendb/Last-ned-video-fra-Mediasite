function inject_catalog() {
	$(document).ready(function(){
		waitForTable = setInterval(function(){
			//TFY4106 type catalog
			if ($('#presentationTableView').length) {
				clearInterval(waitForTable);
				insertLoadButton(1);
				//insertDownloadButtons();
			} else if ($('#SearchResults').length) {
				clearInterval(waitForTable);
				insertLoadButton(2);
			}
		}, 100);
	});
}

function insertLoadButton(type) {
	if (type == 1 || type == 2) { //TFY4106 style catalog, TMA4245 style catalog
		titleElm = $('#contentAreaBottom');
		loadBtn = $(document.createElement('a'))
			.text('Load download buttons')
			.addClass('loadBtn')
			.attr('href', '#')
			.click(function() { insertDownloadButtons(type); })
			.insertBefore(titleElm);
	}
}

function insertDownloadButtons(type) {
	if (type == 1) { //TFY4106
	$('.presentationTableView_GridItem, .presentationTableView_GridAltItem').each(function(){
		insertDownloadButton(type, this);
	});
	} else if (type == 2) { //TMA4245
	$('.PresentationCardPanel').each(function(){
		insertDownloadButton(type, this);
	});
	}
}

function insertDownloadButton(type, elm) {
	if (type == 1) { //TFY4106
	tr = $(elm);
	id = tr.attr('id');
	text = tr.find('#playerLink').text() + '.mp4';

	var downloadVideoBtn = $(document.createElement('a'))
		.text('Download video')
		.addClass('downloadVideoBtn')
		.attr('id', id)
		.attr('download', text)
		.hide()
		.appendTo(tr);
	} else if (type == 2) { //TMA4245
		panel = $(elm);
		id = panel.find('span').text();
		text = panel.find('#cardTitle').text() + '.mp4';

		var downloadVideoBtn = $(document.createElement('a'))
			.text('Download video')
			.addClass('downloadVideoBtn')
			.attr('id', id)
			.attr('download', text)
			.hide()
			.appendTo(panel);
	}

	getVideoUrl(id, function(videoUrl){
		downloadVideoBtn.attr('data-url', videoUrl);
		downloadVideoBtn.click(function(){
			downloadVideo(videoUrl, downloadVideoBtn.attr('download'));
		});
		downloadVideoBtn.show();
	});

}

function downloadVideo(url, filename) {
	// Strip : " ? ~ < > * |
	filename = str = filename.replace(/:/g,'');
	filename = str = filename.replace(/"/g,'');
	filename = str = filename.replace(/\?/g,'');
	filename = str = filename.replace(/~/g,'');
	filename = str = filename.replace(/</g,'');
	filename = str = filename.replace(/>/g,'');
	filename = str = filename.replace(/\*/g,'');
	filename = str = filename.replace(/|/g,'');
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
			videoUrls = response.d.Presentation.Streams[0].VideoUrls;
			for (i = 0; i < videoUrls.length; i++) {
				if (videoUrls[i].MediaType == "MP4" && videoUrls[i].MimeType == "video/mp4") {
					videoUrl = videoUrls[i].Location;
					break;
				}
			}
			callback(videoUrl);
		}
	});
}
