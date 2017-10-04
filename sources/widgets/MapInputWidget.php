<?php

namespace hector68\yii2\widgets;

use Yii;

class MapInputWidget extends \yii\widgets\InputWidget
{

    public $key;

    public $latitude = 0;

    public $longitude = 0;

    public $zoom = 0;

    public $description = "";

    public $width = '100%';

    public $height = '300px';

    public $pattern = '(%latitude%,%longitude%)';

    public $mapType = 'roadmap';

    public $animateMarker = false;

    public $alignMapCenter = true;

    public $enableSearchBar = true;

    public $viewFile = 'MapInputWidget';

    public $readonly = false;

    public function run()
    {

        Yii::setAlias('@hector68','@vendor/hector68');

        if ($this->readonly)
            $this->enableSearchBar = false;

        // Asset bundle should be configured with the application key
        $this->configureAssetBundle();

        return $this->render(
            $this->viewFile,
            [
                'id' => $this->getId(),
                'model' => $this->model,
                'attribute' => $this->attribute,
                'latitude' => $this->latitude,
                'longitude' => $this->longitude,
                'zoom' => $this->zoom,
                'width' => $this->width,
                'height' => $this->height,
                'pattern' => $this->pattern,
                'mapType' => $this->mapType,
                'animateMarker' => $this->animateMarker,
                'alignMapCenter' => $this->alignMapCenter,
                'enableSearchBar' => $this->enableSearchBar,
                'description' => $this->description,
                'readonly' => $this->readonly,
            ]
        );
    }

    private function configureAssetBundle()
    {
        \hector68\yii2\assets\MapInputAsset::$key = $this->key;
    }
}
