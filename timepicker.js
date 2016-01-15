var timepicker = {
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
        div = document.createElement('div');
        ul  = document.createElement('ul');

        div.setAttribute('class', 'timepicker');
        div.setAttribute('data-name', timepicker.getAttribute('name'));

        div.appendChild(ul);

        timepicker.parentNode.insertBefore(div, timepicker.nextSibling);

        return ul;
    },
    remove: function()
    {
        document.querySelector('.timepicker').remove();
    },
    showHour: function(timepicker, interval, max, callback)
    {
        ul = this.make(timepicker);

        for (var i = 0; i < max; i = i + interval)
        {
            li = document.createElement("li");
            li.setAttribute('href', '#');
            li.setAttribute('data-hour', (i).pad());
            li.appendChild(document.createTextNode((i).pad() +':00'));
            ul.appendChild(li);

            li.onclick = function() {
                hour = this.getAttribute('data-hour');
                callback(ul, hour);
            };
        }
    },
    showMinute: function(ul, interval, max, hour, callback)
    {
        self            = this;
        ul.innerHTML    = '';

        for (var i = 0; i < max; i = i + interval)
        {
            li = document.createElement("li");
            li.setAttribute('href', '#');
            li.setAttribute('data-minute', (i).pad());
            li.appendChild(document.createTextNode(hour +':'+ (i).pad()));
            ul.appendChild(li);

            li.onclick = function()
            {
                var minute = this.getAttribute('data-minute');
                callback(minute);

                self.remove();
            };
        }
    }
};

document.addEventListener("DOMContentLoaded", function(event)
{
    Number.prototype.pad = function(size)
    {
        var s = String(this);
        while (s.length < (size || 2)) {s = "0" + s;}
        return s;
    };

    (function(f)
    {
        var hour    = 0;
        var minute  = 0;

        f.each(function(timepicker)
        {
            timepicker.onclick = function()
            {
                f.showHour(this, 1, 24, function(list, selected)
                {
                    hour = selected;

                    f.showMinute(list, 15, 60, hour, function(selected)
                    {
                        minute = selected;

                        timepicker.value = hour +':'+ minute;
                    });
                });
            };
        });

    }) (timepicker);
});