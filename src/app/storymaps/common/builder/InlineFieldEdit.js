define(["lib-build/css!./InlineFieldEdit",
		"dojo/has"],
	function(viewCss, has)
	{
		/**
		 * InlineFieldEdit
		 * @class InlineFieldEdit
		 *
		 * Create editable fields for the given container (can target multiple fields with one call)
		 * Optional callback to be called when entering and exiting edit mode can be provided
		 */
		return function InlineFieldEdit(container, callbackEnterEdit, callbackAfterEdit)
		{
			// The edited input while editing
			var _inputEditing = null;

			container.find('.text_edit_icon').click(function(){
				enterEditMode(
					$(this),
					$(this).parent().find('.text_edit_label'),
					$(this).parent().find('.text_edit_input')
				);
			});

			container.find('.text_edit_label').click(function(){
				enterEditMode(
					$(this).parent().find('.text_edit_icon'),
					$(this),
					$(this).parent().find('.text_edit_input')
				);

			});

			container.find('.text_edit_input').blur(function() {
				exitEditMode($(this));
			});

			// On IOS, the blur doesn't work properly
			// Listen for touch start on the body
			// Exit the edit mode if we are editing and the target isn't the editing field
			if( has("ios") ) {
				$("body").bind("touchstart", function(e){
					if ( _inputEditing && e.target != _inputEditing.get(0) )
						exitEditMode(_inputEditing);
				});
			}

			container.find('.text_edit_input').keypress(function(event) {
				var keycode = (event.keyCode ? event.keyCode : event.which);
				if (keycode == "13")
					exitEditMode($(this));
			});

			function enterEditMode(button, label, input)
			{
				if( ! button || ! label || ! input )
					return;

				if( typeof callbackEnterEdit == "function" )
					callbackEnterEdit();

				_inputEditing = input;

				// Bad trick for the picture panel - should be removed
				label.parent().parent().addClass("isEditing");
				label.hide();
				button.hide();
				input.val(label.html());
				input.show();
				input.select();
			}

			function exitEditMode(input)
			{
				if( ! input || ! input.get(0) )
					return;

				_inputEditing = null;

				var value = input.get(0).value;
				var label = input.parent().find('.text_edit_label');
				var icon = input.parent().find('.text_edit_icon');
				var labelNonEditable = label.parent().first();

				if( value === "" ){
					if($(input).parents('h1.title'))
						value = i18n.commonCore.inlineFieldEdit.enterTitle;
					else{
						value = i18n.commonCore.inlineFieldEdit.enterSubtitle;
					}
				}


				// Basic XSS check
				value = value.replace(/<\/?script>/g,'');

				label.parent().parent().removeClass("isEditing");
				label.html(value);
				label.show();
				input.hide();
				icon.css("display", "inline-block");

				// Close the IOS keyboard
				if( has("ios") )
					document.activeElement.blur();

				if( typeof callbackAfterEdit == "function" )
					callbackAfterEdit(labelNonEditable, value);
			}
		};
	}
);
