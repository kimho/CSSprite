jQuery(document).ready(function(){

	var dropZone = jQuery('#imageDropZone'),
		playground = jQuery('#playground'),
		image = playground.find('img').filter(':first'),
		resize = jQuery('#resize');

	// util functions
	var updateCSS = function(options) {
		var opts = this.options || {};
		var useImageDataSource = opts.useImageDataSource || false;

		var cssString = ".background-class { \r\n"
			+ "\t" + "width: " + playground.width() + "px\r\n"
			+ "\t" + "height: " + playground.height() + "px\r\n"
			+ "\t" + "background-repeat: no-repeat" + "\r\n"
			+ "\t" + "background-position: " + image.offset().left + "px " + image.offset().top + "px" + ";\r\n";
		if(useImageDataSource) {
			cssString += "\t" + "background-image: " + "url(" +  image.attr('src') + ");\r\n";
		}
		
		cssString += "}";

		$('#css-output pre').text(cssString);
	};

	updateCSS();

	// image drop
	dropZone.filedrop({
		paramname: 'imageDrop',
		allowedfiletypes: ['image/jpeg','image/png','image/gif'],
		maxfiles: 1,
		maxfilesize: 1,
		drop: function(fileEvent) {
			var reader = new FileReader(),
				result;

			reader.onload = function(e) {
				console.log('loading...');
			};

			reader.onloadend = function(e) {

				console.log('loaded complete...');

				result = e.target.result;

				image.attr('src', result);

				var imgW = image.width(),
					imgH = image.height();

				dropZone.css('background', 'url(' + result + ') no-repeat top left');
				dropZone.width( imgW )
					.height( imgH )
					.css({ 'padding': 0 })
					.text('')
					.after('<p class="center-text"><small>To tinker with another image simply drag a new one over your current one</small></p>');
				playground.width( image.width() );

				updateCSS();
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
					console.log('file to large you tard...');
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

	playground.mousedown(function(e){
		isDragging = true;

		originalX = e.pageX - image.offset().left;
		originalY = e.pageY - image.offset().top;

		e.preventDefault();
		return false;
	});

	$(window).mousemove(function(e){
		if (isDragging) {
			var mouseX = e.pageX - playground.offset().left,
				mouseY = e.pageY - playground.offset().top;

			image.css({ 'top': -(originalY - mouseY), 'left': -(originalX - mouseX) });

			var test = { 'top': -(originalY - mouseY), 'left': -(originalX - mouseX) };
		}
	});

	$(window).mouseup(function(e){

		if(isDragging) {
			updateCSS();
			isDragging = false;
		}

		e.preventDefault();
		return false;
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