#Yii2 map input widget
##Description
A [Yii2 input widget](http://www.yiiframework.com/doc-2.0/yii-widgets-inputwidget.html) which provides a user-friendly interface for selecting geographical coordinates via [Google maps](https://www.google.com/maps/preview). Allows users to select geographical coordinates by clicking on an interative Google map embedded into you web-page.

##Usage

###Minimal example
To reproduce the following minimal example you will need to acquire a Google maps browser key as described in [Google maps developer's guide](https://developers.google.com/maps/documentation/javascript/tutorial#api_key). The key may be stored as an application parameter for easy referencing or anywhere you like. All other widget parameters have some sensible default values and may not be configured.
~~~php
echo $form->field($model,'coordinates')->widget
(
    'kolyunya\yii2\widgets\MapInputWidget',
    [
        // Google maps browser key.
        'key' => $key,
    ]
);
~~~

###Extended example
An exhaustive list of widget parameters (which are not derived from [yii\widgets\InputWidget](http://www.yiiframework.com/doc-2.0/yii-widgets-inputwidget.html)) available for configuration is described in the following example.
~~~php
echo $form->field($model,'coordinates')->widget
(
    'kolyunya\yii2\widgets\MapInputWidget',
    [

		// Google maps browser key.
		'key' => $key,

		// Initial map center latitude. Used only when the input has no value.
		// Otherwise the input value latitude will be used as map center.
		// Defaults to 0.
		'latitude' => 42,

		// Initial map center longitude. Used only when the input has no value.
		// Otherwise the input value longitude will be used as map center.
		// Defaults to 0.
		'longitude' => 42,

		// Initial map zoom.
		// Defaults to 0.
		'zoom' => 12,

		// Map container width.
		// Defaults to '100%'.
		'width' => '420px',

		// Map container height.
		// Defaults to '300px'.
		'height' => '420px',

		// Coordinates representation pattern. Will be use to construct a value of an actual input.
		// Will also be used to parse an input value to show the initial input value on the map.
		// You can use two macro-variables: '%latitude%' and '%longitude%'.
		// Defaults to '(%latitude%,%longitude%)'.
		'pattern' => '[%longitude%-%latitude%]',

		// Google map type. See official Google maps reference for details.
		// Defaults to 'roadmap'
		'mapType' => 'satellite',

    ]
);
~~~
