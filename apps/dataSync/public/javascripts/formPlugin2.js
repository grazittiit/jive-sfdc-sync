(function ($) {
	var createField_private = function (form, fields){
		fields.forEach(function(field){
			var formGroup = $('<div>').addClass('form-group').addClass('fieldSection');
			var label = $('<label>').addClass('col-sm-2').addClass('control-label').text(field.label || '');
			if(field.required)
				label.append($('<span>').css("color", "#f00").text('*'));
			var inputDiv = $('<div>').addClass('col-sm-8');
			var input ;
			if(field.type === 'textarea') {
				input = $('<textarea>')
						.attr('rows', "3")
						.attr('maxlength', field.maxlength || '32000')
			}
			else if(field.type === 'select'){
				var select = $('<select>');
				select.append($('<option>')
						.attr('value', '')
						.text('--select--')
						);
				field.options.forEach(function(option){
					select.append($('<option>')
							.attr('value', option.value || option)
							.text(option.text || option.value || option)
							);
				});
				input = select;
			}
			else if(field.type === 'date' || field.type === 'Date'){
				input = $('<input />')
							.attr('type','text').datepicker({
								format 			: "yyyy-mm-dd",
								autoclose		: true,
								todayHighlight	: true
							});
			}
			else if(field.type === 'file' || field.type === 'File'){
				input = $('<input />').attr('type','file').attr('onchange','previewFile()');
			}
			else if(field.type === 'email'){
				input = $('<input />').attr('type','text').data('pattern',/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/);
			}
			else if(field.type === 'hidden'){
				input = $('<input />').attr('type','hidden');
				formGroup.css("display","none");
			}
			else if(field.type === 'radio'){
				input = $('<input />').attr('type','hidden');
			}
			else{
				input=$('<input />')
					.attr('type', 'text')
					.attr('maxlength', field.maxlength || "255")
					.attr('placeholder', field.placeholder || '')
			}
			input.addClass('form-control')
				.attr('isDependent', field.isDependent ? 'yes' : 'no')
				.attr('isRequired', field.required ? 'yes' : 'no');
			if(field.value)
				input.val(field.value);
			if(field.readonly)
				input.prop('readonly',field.readonly);
			if(field.id && field.id !== null && field.id !== '')
				input.attr('id', field.id);
			if(field.sfApi && field.sfApi !== null && field.sfApi !== '')
				input.attr('name', field.sfApi);
			// else
			// 	input.attr('name', 'sfdc_case_' + field.label.split(" ").join('_'));
			if(field.pattern && field.pattern !== null && field.pattern !== '')
				input.data('pattern', new RegExp(field.pattern))
			inputDiv.append(input);
			if(field.hint)
				inputDiv.append($('<small>').addClass('help-block').text(field.hint));
			(function (inputDiv, formGroup, options) {
				inputDiv.find('.form-control').change(function(){
					var changedValue = $(this).val();
					var i;
					for (i = 0; i < options.length; i++) {
						if(changedValue === options[i].value){
							formGroup.appendField(options[i].fields);
							break;
						}
					};
					if(i === options.length)
						formGroup.appendField([]);
				});
			})(inputDiv, formGroup, field.options || []);
			form.append(formGroup.append(label).append(inputDiv));
		});
	}

	$.fn.appendField = function (options) {
		var fields = options;
		if (typeof options === 'undefined' || options === null || options === '')
			return;
		if(options.length === 0){
			this.next('[appended=yes]').slideUp(function(){
				this.remove();
			});
			return;
		}
		var dependentDiv = $('<div>').attr('appended', 'yes');
		createField_private(dependentDiv, fields);
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
		var form = $("<form>")
			.addClass("form-horizontal")
			.addClass("case_create_form")
			.css("width", "100%")
			.css("height", "auto")
			.attr('name',formObject.name);
		createField_private(form, formObject.fields);
		formObject.dependency.forEach(function(d){
			form.find("[name="+d.parent+"]").change(function(){
				var changedValue = $(this).val();
				var select = form.find("[name="+d.child+"]").html('');
				select.append($('<option>')
						.attr('value', '')
						.text('--select--')
						);
				if(changedValue && changedValue.length > 0) {
					d.mapping[changedValue].forEach(function(option){
						select.append($('<option>')
								.attr('value', option.value || option)
								.text(option.text || option.value || option)
								);
					});
				}
			});
			form.find("[name="+d.child+"]").html($('<option>').attr('value','').text('--select--'));
		});
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
