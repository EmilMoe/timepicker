var timepicker = {
    defaults: {
        interval: 15,
        start: 0
    },
    options: null,
    time: {
        hour: 0,
        minute: 0
    },
    active: false,
    source: null,
    load: function(options)
    {
        var self        = this;
        this.options    = options;

        self.each(function(timepicker)
        {
            timepicker.onclick = function()
            {
                self.source = this;

                if (self.active == true)
                    return;

                self.showHour(this, 1, 24, function(list, selected)
                {
                    self.time.hour = selected;
                    self.source.value = self.time.hour +':00';

                    self.showMinute(list, self.option('interval'), 60, self.time.hour, function(selected)
                    {
                        self.time.minute = selected;
                        self.source.value = self.time.hour +':'+ self.time.minute;
                    });
                });
            };
        });
    },
    option: function(option)
    {
        if (this.options === null)
            return this.defaults[option];

        if (this.options[option] === undefined)
            return this.defaults[option];

        return this.options[option];
    },
    each: function(callback)
    {   
        var timepickers = document.querySelectorAll('[data-toggle="timepicker"]');

        for (var i = 0; i < timepickers.length; i++)
        {
            callback(timepickers[i]);
        }
    },
    make: function(timepicker)
    {
        this.active = true;
        div         = document.createElement('div');
        ul          = document.createElement('ul');

        ul.setAttribute('data-value', 'null');

        div.setAttribute('class', 'timepicker');
        div.setAttribute('data-name', timepicker.getAttribute('name'));

        div.appendChild(ul);

        timepicker.parentNode.insertBefore(div, timepicker.nextSibling);

        document.addEventListener('mouseup', this.onClickEvent);
        document.addEventListener('keydown', this.onKeyEvents);

        return ul;
    },
    remove: function()
    {
        document.removeEventListener('mouseup', this.onClickEvent);
        document.removeEventListener('keydown', this.onKeyEvents);
        timepicker = document.querySelector('.timepicker');
        timepicker.parentNode.removeChild(timepicker);
        
        this.active = false;
    },
    clear: function(list)
    {
        all = list.querySelectorAll('li');

        for (var i = 0; i < all.length; i++)
            all[i].parentNode.removeChild(all[i]);
    },
    showHour: function(timepicker, interval, max, callback)
    {
        ul = this.make(timepicker);

        for (var i = this.option('start'); i < max; i = i + interval)
        {
            li = document.createElement("li");
            li.setAttribute('href', '#');
            li.setAttribute('data-value', this.pad(i));
            li.appendChild(document.createTextNode(this.pad(i) +':00'));
            ul.appendChild(li);

            li.onmouseover = function()
            {
                all = document.querySelectorAll('div.timepicker ul li');

                for (var j = 0; j < all.length; j++)
                    all[j].classList.remove('hover');

                this.classList.add('hover');
            };

            li.onmouseout = function()
            {
                this.classList.remove('hover');
            };

            li.onclick = function() {
                callback(ul, this.getAttribute('data-value'));
            };
        }
    },
    showMinute: function(list, interval, max, hour, callback)
    {
        self = this;
        this.clear(list);

        for (var i = 0; i < max; i = i + interval)
        {
            li = document.createElement("li");
            li.setAttribute('href', '#');
            li.setAttribute('data-value', this.pad(i));
            li.appendChild(document.createTextNode(hour +':'+ this.pad(i)));
            ul.appendChild(li);

            li.onmouseover = function()
            {
                all = document.querySelectorAll('div.timepicker ul li');

                for (var j = 0; j < all.length; j++)
                    all[j].classList.remove('hover');

                this.classList.add('hover');
            };

            li.onmouseout = function()
            {
                this.classList.remove('hover');
            };
            
            li.onclick = function()
            {
                callback(this.getAttribute('data-value'));

                self.remove();
            };
        }
    },
    pad: function(number)
    {
        var s = String(number);

        while (s.length < 2)
        {
            s = '0' + s;
        }

        return s;
    },
    onClickEvent: function()
    {
        if (event.target.attributes['data-value'] === undefined)
            timepicker.remove();
    },
    onKeyEvents: function()
    {
        switch(event.keyCode)
        {
            case 27:
                timepicker.remove();
                break;

            case 40:
                item  = document.querySelector('div.timepicker ul li.hover');
                list  = document.querySelectorAll('div.timepicker ul li');
                index = Array.prototype.indexOf.call(list, item);

                if (index == -1)
                {
                    list[0].classList.add('hover');
                    break;
                }

                if (index < list.length - 1)
                {
                    item.classList.remove('hover');
                    list[index + 1].classList.add('hover');
                }

                break;

            case 38:
                item  = document.querySelector('div.timepicker ul li.hover');
                list  = document.querySelectorAll('div.timepicker ul li');
                index = Array.prototype.indexOf.call(list, item);

                if (index > 0)
                {
                    item.classList.remove('hover');
                    list[index - 1].classList.add('hover');
                }

                break;

            case 13:
                item = document.querySelector('div.timepicker ul li.hover');
                item.click();
                break;
        }
    }
};

document.addEventListener("DOMContentLoaded", function(event)
{
    timepicker.load({
        interval: 15
    });
});