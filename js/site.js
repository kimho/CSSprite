jQuery(document).ready(function(){

	var dropZone = jQuery('#imageDropZone'),
		playground = jQuery('#playground'),
		image = playground.find('img').filter(':first'),
		resize = jQuery('#resize');

	// image drop
	dropZone.filedrop({
		paramname: 'imageDrop',
		allowedfiletypes: ['image/jpeg','image/png','image/gif'],
		maxfiles: 1,
		drop: function(fileEvent) {
			var reader = new FileReader(),
				result;

			reader.onload = function(e) {
				result = e.target.result;
				image.attr('src', result);
			};

			reader.onloadend = function(e) {
				var imgW = image.width(),
					imgH = image.height();

				dropZone.css('background', 'url(' + result + ') no-repeat top left');
				dropZone.width( imgW )
					.height( imgH )
					.css({ 'padding': 0 })
					.text('')
					.after('<p class="center-text"><small>To tinker with another image simply drag a new one over your current one</small></p>');
				playground.width( image.width() );
			};

			reader.readAsDataURL(fileEvent.dataTransfer.files[0]);
		},
		error: function(err, file) {
			switch(err) {
				case 'BrowserNotSupported':
					alert('browser does not support html5 drag and drop');
					break;
				case 'TooManyFiles':
					// user uploaded more than 'maxfiles'
					break;
				case 'FileTooLarge':
					// program encountered a file whose size is greater than 'maxfilesize'
					// FileTooLarge also has access to the file which was too large
					// use file.name to reference the filename of the culprit file
					break;
				case 'FileTypeNotAllowed':
					// The file type is not in the specified list 'allowedfiletypes'
					break;
				default:
					console.log(err);
					break;
			}
		}
	});

	// image interaction
	var isDragging = false,
		originalX, originalY;

	image.mousedown(function(e){
		isDragging = true;

		originalX = e.pageX - playground.offset().left;
		originalY = e.pageY - playground.offset().top;

		e.preventDefault();
		return false;
	});

	image.mouseup(function(e){
		isDragging = false;

		e.preventDefault();
		return false;
	});

	playground.mousemove(function(e){
		var mouseX = e.pageX - this.offsetLeft,
			mouseY = e.pageY - this.offsetTop;

		if (isDragging) {
			image.css({ 'top': -(originalY - mouseY), 'left': -(originalX - mouseX) });

			var test = { 'top': -(originalY - mouseY), 'left': -(originalX - mouseX) };
			console.log(test);
		}
	});

	// control panel controls
	resize.submit(function(e){

		var vals = resize.serializeArray(),
			width = parseInt( vals[0].value, 10 ), // might not be the best assignment method here?
			height = parseInt( vals[1].value, 10 );

		playground.css({
			width: ((width < 800) ? width: 800),
			height: ((height < 800) ? height: 800)
		});

		e.preventDefault();
		return false;
	});

});