from django.forms import DateTimeInput
from datetime import datetime

class BootstrapDateTimePickerInput(DateTimeInput):
    # Implementation from: https://simpleisbetterthancomplex.com/tutorial/2019/01/03/how-to-use-date-picker-with-django.html
    template_name = 'widgets/bootstrap_datetimepicker.html'

    def get_context(self, name, value, attrs):
        datetimepicker_id = 'datetimepicker_{name}'.format(name=name)
        if attrs is None:
            attrs = dict()
        attrs['data-target'] = '#{id}'.format(id=datetimepicker_id)
        attrs['class'] = attrs.get('class', '').strip()
        attrs['class'] += ' form-control datetimepicker-input'
        context = super().get_context(name, value, attrs)
        context['widget']['datetimepicker_id'] = datetimepicker_id
        context['widget']['input_format'] = 'DD/MM/YYYY' # can be improved to customize from attrs
        #context['widget']['value'] = value or datetime.today().strftime('%d/%m/%Y')
        return context

class BootstrapFormRow(DateTimeInput):
    # Implementation from: https://simpleisbetterthancomplex.com/tutorial/2019/01/03/how-to-use-date-picker-with-django.html
    template_name = 'widgets/form_row.html'

    def get_context(self, name, value, attrs):
        context = super().get_context(name, value, attrs)
        context['widget']['size_class'] = attrs.get('size_class')
        return context
