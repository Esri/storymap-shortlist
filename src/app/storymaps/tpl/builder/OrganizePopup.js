define([
	"lib-build/tpl!./OrganizePopup",
	"lib-build/css!./OrganizePopup",
	"lib-build/tpl!./OrganizePopupEntry",
	// libraries
	"lib-app/jquery.ui.touch-punch",
	"dojo/Deferred"],
	function (
		viewTpl,
		viewCss,
		entryTpl,
		jqueryTouchPunch,
		Deferred
	) {
		return function OrganizePopup(container)
		{
			var _initDone = false,
				_resultDeferred = null,
				// cfg contains all entries
				// and sectionIndex which is the index of the current section at opening
				_cfg = null,
				_nbRowDeleted = null;

			container.append(viewTpl({
				title: i18n.builder.addEditPopup.organizeTabs,
				lblColTitle: i18n.builder.organizePopup.lblColTitle,
				lblColStatus: i18n.builder.organizePopup.lblColStatus,
				btnCancel: i18n.commonCore.common.cancel
			}));

			this.present = function(cfg)
			{
				var contentHTML = "";

				_resultDeferred = new Deferred();
				_cfg = cfg;

				if ( ! cfg || ! cfg.entries || cfg.sectionIndex == null )
					return _resultDeferred.reject();

				_nbRowDeleted = 0;

				if ( ! _initDone )
					initUI();

				container.find('.organizeHeader').html(
					//i18n.builder.organizePopup.lblHeader.replace('%LBL_LAYOUT%', app.data.getWebAppData().getLayoutProperties().itemsLbl.toLowerCase())
					i18n.builder.organizePopup.dragNDrop
				);

				// Table entries
				$.each(_cfg.entries, function (i, entry) {
					var title = entry.title;
					//title = (entriesLength - i) + (title ? " - " + title : "");
					/*if ( cfg.appLayout == "bullet" || cfg.appLayout == "accordion" ) {
						if ( ! cfg.layoutOpt.reverse )
							title = (i+1) + (title ? " - " + title : "");
						else
							title = (entriesLength - i) + (title ? " - " + title : "");
					}*/

					contentHTML += entryTpl({
						index: i,
						title: title,
						statusVal: '',
						statusLbl: '',
						helpDelete: i18n.builder.addFeatureBar.deleteFeature
					});
					/*statusVal: entry.status,
					statusLbl: app.builderCfg.STATUS[entry.status],*/
					//helpDelete: i18n.builder.addFeatureBar.deleteFeature;
				});

				container.find('.rows').html(contentHTML);

				container.find('.deleteSectionBtn').attr('disabled', false);

				// Status
				/*$.each(Object.keys(app.builderCfg.STATUS), function(i, status){
					container.find('.status-list').append('<li><a data-value="' + status + '">' + app.builderCfg.STATUS[status] + '</a></li>');
				});
				container.find('.status-list a').click(function(){
					$(this).parents('.btn-group').find('.status-list-btn')
						.data('value', $(this).data('value'))
						.text($(this).text());
				});
				container.find('.dropdown-toggle').dropdown();*/

				// Delete tooltip
				container.find('*[data-toggle=tooltip]').tooltip({
					trigger: 'hover'
				});

				// Edit and delete button click handlers
				container.find('.deleteSectionBtn').click(onClickDelete);

				// Make table sortable
				container.find('.rows').toggleClass("noreorder", _cfg.entries.length <= 1);
				if ( Object.keys(_cfg.entries).length > 1 ) {
					container.find(".organizeTable tbody").sortable({
						axis: "y",
						opacity: "0.4",
						cursor: "move",
						helper: function (e, tr) {
							var originals = tr.children();
							var helper = tr.clone();
							helper.children().each(function (index) {
								$(this).outerWidth(originals.eq(index).outerWidth());
							});
							return helper;
						}
					});
				}
				else {
					try {
						container.find(".organizeTable tbody").sortable("destroy");
					} catch( e ) { }
				}


				// Apply button
				updateApplyButtonStatus();

				container.modal({ keyboard:true });
				return _resultDeferred;
			};

			this.close = function()
			{
				container.modal('hide');
				$('.builder-content-panel .builder-organize').toggleClass('active');
				_resultDeferred.reject();
			};

			function onClickDelete()
			{
				var row = $(this).closest('tr').first();
				row.fadeOut('fast', function() {
					row.remove();
					_nbRowDeleted++;
					updateApplyButtonStatus();
				});
				var rows = container.find('.sectionRow').get();
				if(rows.length == 2)
					container.find('.deleteSectionBtn').attr('disabled', true);
				return false;
			}

			function onClickApply()
			{
				var entriesOnApply = [],
					newSectionIndex = 0,
					rows = container.find('.sectionRow').get();

				$.each($(rows), function(i, r){
					var	row = $(r),
						sectionIndex = row.data('index'),
						sectionStatus = row.find('.status-list-btn').data('value'),
						section = _cfg.entries[sectionIndex];

					// Save status
					section.status = sectionStatus;

					entriesOnApply.push(section);

					if ( sectionIndex === _cfg.sectionIndex )
						newSectionIndex = i;
				});

				_resultDeferred.resolve({
					entries: entriesOnApply,
					sectionIndex: newSectionIndex
				});
				$('.builder-content-panel .builder-organize').toggleClass('active');
				container.modal('hide');
			}

			function initUI()
			{
				container.find('.btnApply').click(onClickApply);

				container.on('hide.bs.modal', function () {
					$('.builder-content-panel .builder-organize').toggleClass('active');
					_resultDeferred.reject();
				});

				_initDone = true;
			}

			function updateApplyButtonStatus()
			{
				if ( _nbRowDeleted )
					container.find('.btnApply')
						.html(i18n.builder.addEditPopup.confirmDeletion + "%NB% %LBL_LAYOUT%"
							.replace('%NB%', _nbRowDeleted)
							.replace('%LBL_LAYOUT%', _nbRowDeleted > 1 ? 'tabs' : 'tab')
						)
						.removeClass('btn-primary')
						.addClass('btn-danger');
				else
					container.find('.btnApply')
						.html(i18n.commonCore.common.apply)
						.removeClass('btn-danger')
						.addClass('btn-primary');
			}
		};
	}
);
