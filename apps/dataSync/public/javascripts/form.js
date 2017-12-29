(function ($) {
	var createField_private = function (form, formObject) {
		for(var field in formObject) {
			var formGroup = $('<div>').addClass('form-group').addClass('fieldSection');
			var label = $('<label>').addClass('col-sm-2').addClass('control-label').text(formObject[field].name || field);
			if(formObject[field].required)
				label.append($('<span>').css("color", "#f00").text('*'));
			var inputDiv = $('<div>').addClass('col-sm-8');
			var input ;
			if(formObject[field].type === 'textarea') {
				input = $('<textarea>')
						.attr('rows', "3")
						.attr('maxlength', formObject[field].maxlength || '32000')
			}
			else if(formObject[field].type === 'select') {
				var select = $('<select>');
				select.append($('<option>')
						.attr('value', '')
						.text('--select--')
						);
				for(var option in formObject[field].options) {
					select.append($('<option>')
							.attr('value', option)
							.text(formObject[field].options[option].name || option)
							);
				}
				input = select;
				//input.append(select);
			}
			else if(formObject[field].type === 'date' || formObject[field].type === 'Date') {
				input=$('<input />')
						.attr('type','text').datepicker({
												format: "yyyy-mm-dd",
												autoclose: true,
												todayHighlight: true
											});
				/*input = $('<div>').addClass('form-group').addClass('date')
						.append($('<input />').addClass('form-control').attr('type','text'))
						.append($('<span>').addClass('input-group-addon').append($('<span>').addClass('glyphicon').addClass('glyphicon-calendar')))
						.datetimepicker({"viewMode":'years',
										"format":'MM/YYYY'});*/
			}
			else if(formObject[field].type === 'file'){
				input=$('<input />').attr('type','file').attr('onchange','previewFile()');
			}
			else if(formObject[field].type === 'email'){
				input = $('<input />').attr('type','text').data('pattern',/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/);
			}
			else {
				input=$('<input />')
						.attr('type', 'text')
						.attr('maxlength', formObject[field].maxlength || "255")
						.attr('placeholder', formObject[field].placeholder || '')
			}
			input.addClass('form-control')
				.attr('id', 'sfdc_case_' + field.split(" ").join('_'))
				.attr('isDependent', formObject[field].isDependent ? 'yes' : 'no')
				.attr('isRequired', formObject[field].required ? 'yes' : 'no');
				
			if(formObject[field].id && formObject[field].id !== null && formObject[field].id !== '')
				input.attr('id', formObject[field].id);

			if(formObject[field].sfApi !== null && formObject[field].sfApi !== '')
				input.attr('name', formObject[field].sfApi);
			else
				input.attr('name', 'sfdc_case_' + field.split(" ").join('_'));                
			if(formObject[field].pattern && formObject[field].pattern !== null && formObject[field].pattern !== ''){
				input.data('pattern', new RegExp(formObject[field].pattern))
			}
			inputDiv.append(input);
			if(formObject[field].hint)
				inputDiv.append($('<small>').addClass('help-block').text(formObject[field].hint));
			if(formObject[field].isDependent) {
				(function (input, formGroup, options) {
					input.find('.form-control').change(function () {
						if(options[$(this).val()]) {
							formGroup.appendField(options[$(this).val()].actionFields);
						}
						else
							formGroup.appendField({});
					});
				})(inputDiv, formGroup, formObject[field].options);
			}
			form.append(formGroup.append(label).append(inputDiv));
			//setTimeout(function(){},500);
		}
	};
	$.fn.appendField = function (options) {
		var formObject = $.extend({}, options);
		var dependentDiv = $('<div>').attr('appended', 'yes');
		createField_private(dependentDiv, formObject);
		this.next('[appended=yes]').slideUp(function(){
			this.remove();
		});
		dependentDiv.hide();
		this.after(dependentDiv);
		dependentDiv.slideDown(function () {
			gadgets.window.adjustHeight();
		});
		return this;
	};

	$.fn.createForm = function (options, submitHandler) {
		// This is the easiest way to have default options.
		var formObject = $.extend({}, options);
		// Greenify the collection based on the settings variable.
		//this.append($("<h1>").text('hi'));
		var form = $("<form>").addClass("form-horizontal").addClass("case_create_form").css("width", "100%").css("height", "auto");
		createField_private(form, formObject);
		form.append($('<div>')
				.addClass('form-group')
				.addClass('fieldSection')
				.append($('<label>')
					.addClass('col-sm-2')
					.addClass('control-label')
				)
				.append($('<div>')
					.addClass('col-sm-8')
					.addClass('align-form-btn')
					.append($('<input />')
						.addClass('crm-btn')
						.attr('id', 'g_sfdc_jive_save')
						.attr('type', 'submit')
						.val('submit')
					)
					.append($('<input />')
						.addClass('crm-btn')
						.attr('id', 'g_sfdc_jive_cancel')
						.attr('type', 'button')
						.val('Cancel')
					)
				)
			);
		form.submit(function (e) {
			var formValue = $(this).serializeArray();
			//console.log('FormValue\n',formValue);
			var valid = true;
			$(this).find('[isRequired=yes]').each(function (i, field) {
				var value = $(field).val();
				if(value === null 
					|| value === '' 
					|| ($(field).data("pattern")
						&& (!($(field).data("pattern").test(value)))
						)
					) {
					$(field).parents(".form-group").addClass("has-error");
					valid = false;
				}
				else
					$(field).parents(".form-group").removeClass("has-error");
			});
			if(valid) {
				var g_sfdc_jive_case = {};
				formValue.forEach(function (formField) {
					g_sfdc_jive_case[formField.name] = formField.value;
				});
				if(typeof submitHandler === 'function')
					submitHandler(g_sfdc_jive_case);
			}
			return false;
		});
		return this.empty().append(form);
	};
}(jQuery));
