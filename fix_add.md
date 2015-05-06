the function of "addImageLightbox"

===============

Sometimes, we use the ajax to load more images. Thus, I want to make function support dynamically to add images.

### Example :

````javascript
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title></title>
	<button id="add">Add image</button>
</head>
<body>
	
</body>
</html>
<script src="jquery.js"></script>
<script src="imagelightbox.js"></script>
<script>
	$( function()
	{
		selector = $( selector ).imageLightbox();

		....

		$("#add").on('click', function(e){
			$.ajax({
				url : '',
				type : "",
				dataType : "json",
				success : function(returnData, status)
				{
					....
					var image = $( '<img />' )
						.attr("src", returnData.src)
						.appendTo("...");
					selector = selector.addImageLightbox( image );
					...
				}
			})
		});
	});
</script>
````


## About The Code
````javascript
	this.addImageLightbox = function(elements)
	{
		elements.each(function(){
		if( !isTargetValid( this )) { return true; }
			targets = targets.add( $( this ) );
		});
		elements.click(this.startImageLightbox);
		return this;
	};
````
##Option

elements : The objects of jQuery.
