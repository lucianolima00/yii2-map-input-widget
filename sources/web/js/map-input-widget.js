function MapInputWidgetManager()
{

    const widgetSelector = '.lucianolima00-map-input-widget';

    var self = this;

    var widgets = Array();

    var initializeWidget = function ( widgetContainer )
    {
        if ( ! $(widgetContainer).data('initialized') )
        {
            var widget = new MapInputWidget(widgetContainer);
            widget.initialize();
            return widget;
        }
        return null;
    };

    var addWidget = function ( widget )
    {
        var widgetId = widget.getId();
        widgets[widgetId] = widget;
    };

    this.initializeWidgets = function()
    {
        $(widgetSelector).each
        (
            function ( widgetIndex , widgetContainer )
            {
                var widget = initializeWidget(widgetContainer);
                if ( widget )
                {
                    addWidget(widget);
                }
            }
        );

    };

    this.getWidget = function ( widgetId )
    {
        var widget = widgets[widgetId];
        return widget;
    };

}

function MapInputWidget ( widget )
{

    const inputSelector = 'input.lucianolima00-map-input-widget-input';

    const searchBarSelector = 'input.lucianolima00-map-input-widget-search-bar';

    const canvasSelector = 'div.lucianolima00-map-input-widget-canvas';

    var self = this;

    var input;

    var searchBar;

    var canvas;

    var map;

    var initializeComponents = function()
    {
        input = $(widget).find(inputSelector).get(0);

        $(input).change(
            function () {
                const latLng = $(widget).val().replace(/[()]/g, '').split(',');
                self.setPosition
                (
                    {
                        latitude: latLng[0],
                        longitude: latLng[1],
                    }
                );
            }
        );

        searchBar = $(widget).find(searchBarSelector).get(0);
        canvas = $(widget).find(canvasSelector).get(0);
    };

    var initializeMap = function()
    {

        map = new google.maps.Map
        (
            canvas,
            {
                mapTypeId: $(widget).data('map-type'),
                center: getInitialMapCenter(),
                zoom: $(widget).data('zoom'),
                styles:
                    [
                        {
                            featureType: "poi",
                            stylers:
                                [
                                    {
                                        visibility: "off",
                                    },
                                ],
                        },
                    ],
                mapTypeControlOptions :
                    {
                        mapTypeIds:
                            [
                            ],
                    },
            }
        );

        if ($(widget).data('readonly') !== 1) {

            google.maps.event.addListener
            (
                map,
                'click',
                function (click) {
                    self.setPosition
                    (
                        {
                            latitude: click.latLng.lat(),
                            longitude: click.latLng.lng(),
                        }
                    );
                }
            );
        }

        return map;
    };

    var initializeWidget = function()
    {
        var point = getInitialValue();
        self.setPosition(point);
        $(widget).data('initialized',true);
    };

    var initializeSearchBar = function()
    {
        $(searchBar).prop('hidden', (typeof $(widget).data('enable-search-bar') === 'undefined'));
        searchBarAutocomplete = new google.maps.places.Autocomplete(searchBar);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(searchBar);
        google.maps.event.addListener(
            searchBarAutocomplete,
            'place_changed',
            function() {
                var place = this.getPlace();
                var placeGeometry = place.geometry;
                if ( placeGeometry )
                {
                    var placeLocation = placeGeometry.location;
                    self.setPosition(placeLocation);
                }
            }
        );
        // Prevent enter key from submitting the form
        google.maps.event.addDomListener(searchBar, 'keydown', function(e) {
            if (e.keyCode == 13) {
                e.preventDefault();
            }
        });
    }

    var makePointString = function ( pointData )
    {
        var pattern = getPattern();
        var point = makePoint(pointData);
        pattern = pattern.replace(/%latitude%/g,point.lat());
        pattern = pattern.replace(/%longitude%/g,point.lng());
        return pattern;
    };

    var hasInitialValue = function()
    {
        var hasInitialValue = $(input).prop('value') != '';
        return hasInitialValue;
    };

    var getInitialValue = function()
    {
        var point;
        var pattern = getPattern();
        var pointString = $(input).prop('value');
        if ( pointString !== '' )
        {
            //  The function has an issue - it will not parse the initial value correctly
            //  if the pattern has more than one occurence of "%latitude%" or "%longitude%"
            //  in a row in the begining of the string.
            //  E.g. the initial value won't be parsed correctly against
            //  the pattern "%latitude% - %latitude% - %longitude%".
            var latitudePosition = pattern.indexOf('%latitude%');
            var longitudePosition = pattern.indexOf('%longitude%');
            var latitudeFirst = latitudePosition < longitudePosition;
            var latitudeIndex = latitudeFirst ? 0 : 1;
            var longitudeIndex = latitudeFirst ? 1 : 0;
            var latitude = pointString.match(/-?\d+(\.\d+)?/g)[latitudeIndex];
            var longitude = pointString.match(/-?\d+(\.\d+)?/g)[longitudeIndex];
            point = new google.maps.LatLng(latitude,longitude);
        }
        else
        {
            point = null;
        }
        return point;
    };

    var getInitialCenter = function()
    {
        var latitude = $(widget).data('latitude');
        var longitude = $(widget).data('longitude');
        var point = new google.maps.LatLng(latitude,longitude);
        return point;
    };

    var getInitialMapCenter = function()
    {
        var initialMapCenter;
        if ( hasInitialValue() )
        {
            initialMapCenter = getInitialValue();
        }
        else
        {
            initialMapCenter = getInitialCenter();
        }
        return initialMapCenter;
    };

    var getPattern = function()
    {
        var pattern = $(widget).attr('data-pattern').toString();
        return pattern;
    };

    // Constructs a point from latitude and langitude
    var makePoint = function ( pointData )
    {
        var point;
        if
        (
            pointData.latitude !== undefined
            &&
            pointData.longitude !== undefined
        )
        {
            var latitude = pointData.latitude;
            var longitude = pointData.longitude;
            point = new google.maps.LatLng(latitude,longitude);
        }
        else
        {
            point = pointData;
        }
        return point;
    }

    // Initializes widget
    this.initialize = function()
    {

        var eventInitializeBefore = jQuery.Event("initializeBefore");
        eventInitializeBefore.MapInputWidget = this;
        $(widget).trigger(eventInitializeBefore);

        initializeComponents();
        initializeMap();
        initializeWidget();
        initializeSearchBar();

        var eventInitializeAfter = jQuery.Event("initializeAfter");
        eventInitializeAfter.MapInputWidget = this;
        $(widget).trigger(eventInitializeAfter);
    };

    // Returns widget identifier
    this.getId = function()
    {
        var id = $(widget).prop('id');
        return id;
    };

    // Sets the widget value to specified point;
    // Pans the map to the corresponding point;
    // Sets marker position to the corresponding point.
    this.setPosition = function ( pointData )
    {
        if ( map.marker )
        {
            map.marker.setMap(null);
        }

        if ( pointData === null )
        {
            // Disable the input in order not to send it in POST array
            //$(input).prop('disabled',true);   //Almir - linha comentada para que fosse possível fazer a client validation corretamente.
            return;
        }
        else
        {
            // Enable the input in order to send in in POST array
            $(input).prop('disabled',false);
        }

        var point = makePoint(pointData);

        if ( $(widget).data('align-map-center') === 1 )
        {
            map.panTo(point);
        }

        var markerAnimation = null;
        if ( $(widget).data('animate-marker') === 1 )
        {
            markerAnimation = google.maps.Animation.DROP;
        }
        map.marker = new google.maps.Marker
        (
            {
                map: map,
                position: point,
                draggable: ($(widget).data('readonly') !== 1),
                animation: markerAnimation,
            }
        );

        if ($(widget).data('readonly') !== 1) {

            google.maps.event.addListener
            (
                map.marker,
                'dragend',
                function () {
                    self.setPosition(this.getPosition());
                }
            );
        }

        var pattern = $(widget).data('pattern');

        var event = jQuery.Event("makePoint");
        event.pointString = makePointString(point);
        event.MapInputWidget = this;
        $(widget).trigger(event);

        $(input).prop('value', event.pointString);

    };

    // Pans the map the the specified point
    this.panTo = function ( pointData )
    {
        var point = makePoint(pointData);
        map.panTo(point);
    };

    // Sets the map zoom to a specified value
    this.setZoom = function ( zoom )
    {
        map.setZoom(zoom);
    };

    // Get google map
    this.getMap = function()
    {
        return map;
    };

    this.getSearchBar = function()
    {
        return searchBar;
    };

    this.getInput = function()
    {
        return input;
    };

};
