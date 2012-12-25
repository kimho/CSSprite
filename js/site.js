jQuery(document).ready(function(){

	var dropZone = jQuery('#imageDropZone'),
		playground = jQuery('#playground'),
		image = playground.find('img').filter(':first');

	dropZone.filedrop({
		paramname: 'imageDrop',
		allowedfiletypes: ['image/jpeg','image/png','image/gif'],
		maxfiles: 1,
		drop: function(fileEvent) {
			var reader = new FileReader();

			reader.onload = function(e) {
				var result = e.target.result;
				image.attr('src', result);
				dropZone.css('background', 'url(' + result + ') no-repeat top left');
				dropZone.width( image.width() )
					.height( image.height() )
					.css({ 'padding': 0 })
					.text('')
					.after('<p>To tinker with another image simply drag a new one over your current one</p>');
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
});