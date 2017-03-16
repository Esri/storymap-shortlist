define([
	"lib-app/medium-editor/dist/js/medium-editor",
	"lib-build/css!lib-app/medium-editor/dist/css/medium-editor",
	"lib-build/css!lib-app/medium-editor/dist/css/themes/flat",
	"lib-build/css!lib-app/font-awesome/css/font-awesome",
	"lib-build/css!./MediumEditorWrapper",
	//"./plugins/Anchor",
	//"./plugins/AnchorPreview",
	"dojo/_base/lang"
	],
	function (
		MediumEditor,
		MediumEditorStyle,
		MediumEditorTheme,
		MediumEditorIcons,
		MediumEditorStyleOverride,
		//Anchor,
		//AnchorPreview,
		lang
	) {

		var CONFIG_ALL = {
			buttonLabels: 'fontawesome',
			targetBlank: true,
			autoLink: true,
			imageDragging: false,
			fileDragging: false,
			disableDoubleReturn: true,
			//diffTop: -20,
			anchor: {
			linkValidation: true,
			placeholderText: 'Enter a link...'
		},
		paste: {
			// This configuration force only plain text
			forcePlainText: true,
			cleanPastedHTML: false
		},
		extensions: {
			imageDragging: new function() { },
			//'anchor-preview': new AnchorPreview(),
			//'anchor': new Anchor()
			//'colorPicker': new ColorPicker()
		}
	};

	var CONFIG_SINGLE_LINE = {
		toolbar: false,
		disableReturn: true,
		keyboardCommands: false
	};

	var CONFIG_LINK = {
		toolbar: {
			allowMultiParagraphSelection: false,
			buttons: [
				'anchor'
			]
		},
		disableReturn: true,
		keyboardCommands: false
	};

	var CONFIG_STANDARD = {
		toolbar: {
			allowMultiParagraphSelection: false,
			buttons: [
				'bold',
				'italic',
				'underline',
				'anchor'
			]
		}
	};

	var SELECTION = MediumEditor.selection;

	var DEFAULT_TEXT_COLOR = 'rgb(0, 0, 0)';

	return function MediumEditorWrapper(userOptions)
	{
		userOptions = userOptions || {};

		if (! userOptions.container) {
			console.error("Could not initialize MediumEditorWrapper, userOptions:", userOptions);
			return;
		}

		var _mode = userOptions.mode || 'standard';
		var _config = lang.mixin({}, CONFIG_ALL);

		if (_mode == 'single-line') {
			_config = lang.mixin(_config, CONFIG_SINGLE_LINE);
		}
		else if (_mode == 'link') {
			_config = lang.mixin(_config, CONFIG_LINK);
			_config.placeholder = {
				text: 'Enter the link label and highlight it...',
				hideOnClick: false
			};
		}
		else {
			_config = lang.mixin(_config, CONFIG_STANDARD);
		}

		if (userOptions.placeholder) {
			_config.placeholder = {
				text: userOptions.placeholder,
				hideOnClick: false
			};
		}

		_config = lang.mixin(_config, userOptions.editorConfig);

		// Specify the relative container so highlight toolbar scroll
		//   if the editor is in a scrollable container
		_config.elementsContainer = userOptions.container.parent()[0];

		//console.log('Creation editor with options:', _config);
		var _editor = new MediumEditor(userOptions.container, _config);

		if (userOptions.onBlur && typeof userOptions.onBlur == 'function') {
			_editor.subscribe('blur', userOptions.onBlur);
		}

		// On text change
		_editor.subscribe('editableInput', function(event, editable) {
			//var blockContent = $(editor.getSelectedParentElement());

			// Clean up paste from word
			$(editable).find('p').contents().each(function() {
				if(this.nodeType === Node.COMMENT_NODE || this.nodeType == 8) {
					$(this).remove();
				}
			});
		});

		_editor.subscribe('editableKeydownEnter', function(e) {
			var blockContent = $(_editor.getSelectedParentElement());
			var range = SELECTION.getSelectionRange(document);
			var addBlocksSelector = '.block';

			// Prevent adding two consecutive empty block
			var childrens = blockContent.children();

			// The block is empty
			if (blockContent.html() == '' && childrens.length == 0) {
				e.preventDefault();
			}

			// The previous block is empty and cursor on first character
			if ((blockContent.prev().html() == '' || blockContent.prev().html() == '<br>')
			&& range.startOffset === 0) {
				e.preventDefault();
			}

			// Or the block is visually empty...
			if (childrens.length == 1) {
				if (childrens[0].tagName.toLowerCase() == 'br' && ! blockContent.text()) {
					e.preventDefault();
				}
			}
		}.bind(this));

		// Prevent the editor from creating span when merging blocks
		// Keep span with a color as that's what the editor use for the text color
		var el = $(_editor.elements[0]);
		el.on('input', function() {
			el.children('p').children('span[style]').each(function() {
				if (! this.style.color
				|| this.style.color == 'inherit'
				|| this.style.color == DEFAULT_TEXT_COLOR) {
					$(this).contents().unwrap();
				}
			});
		});

		this.setContent = function(p)
		{
			p = p || {};
			var text = p.text;

			if (text === undefined) {
				return;
			}

			text = '<p>' + text + '</p>';

			if (p.convertLine) {
				text = text.replace(/\n{2}/g, '</p><p>');
			}

			_editor.setContent(text);
			//_editor.selectAllContents();
			//_editor.pasteHTML(text);
		};
	};
});
