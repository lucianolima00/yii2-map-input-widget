<?php
/**
 * Created by PhpStorm.
 * User: aayaresko
 * Date: 23.05.15
 * Time: 11:45
 *
 * @copyright Copyright &copy; Andrej Jaresko, disbalans.net, 2015
 * @subpackage yii2-widget-maskedinputdatepicker
 */

namespace aayaresko\date;

use kartik\datetime\DateTimePicker;
use yii\widgets\MaskedInputAsset;
use yii\helpers\ArrayHelper;

/**
 * позволяет использовать inputmask jquery plugin совметсно с datetimepicker jquery plugin.
 * 
 * все методы выполняются согласно логике widgetTrait из пакета @see https://github.com/kartik-v/yii2-krajee-base .
 *
 * Class MaskedInputDatePicker
 * @author aayareko <aayaresko@gmail.com>
 * @see https://github.com/RobinHerbots/jquery.inputmask
 * @see https://github.com/kartik-v/yii2-widget-datepicker
 */
class MaskedInputDateTimePicker extends DateTimePicker
{
    /**
     * Example of use with kartik DateControl
     *
     <?= $form->field($model, 'data_fim')->widget(\kartik\datecontrol\DateControl::classname(), [
            'type'=> \kartik\datecontrol\DateControl::FORMAT_DATETIME,
            'displayFormat' => 'dd/MM/yyyy HH:mm',
            'autoWidget' => true,
            'widgetClass' => 'aayaresko\date\MaskedInputDateTimePicker',
     ]);
     */


    /**
     * включить или нет inputmask для данного поля
     * @var bool
     */
    public $enableMaskedInput = true;
    /**
     * параметры inputmask jquery plugin
     * свойства передавать в виде вложенного массива 'pluginOptions'
     * события передавать в виде вложенного массива 'pluginEvents'
     * формат маски в виде значения элемента массива 'mask'
     * пример:
     * $maskedInputOptions = [
     *      'mask' => '99.99.9999',
     *      'pluginOptions' => [
     *      ],
     *      'pluginEvents' => [
     *          'complete' => "function(){console.log('complete');}"
     *      ],
     * ]
     * @see https://github.com/RobinHerbots/jquery.inputmask 
     * Важно! события необходимо указывать без префикса 'on' (i.e 'onComplete' => 'complete')
     * @var array
     */


    public $maskedInputOptions = [
            'pluginOptions' => [
                'alias'    => 'datetime',
            ],
        ];

    public $pluginOptions = [
            'todayHighlight' => true,
            'todayBtn' => true,
            'autoclose' => true,
        ];

    /**
     * выполнит настройку параметров widget.
     *
     * @inheritdoc
     */
    public function init()
    {
        parent::init();

        $this->pluginOptions = isset($this->maskedInputOptions['pluginOptions']) ? ArrayHelper::merge($this->pluginOptions, $this->maskedInputOptions['pluginOptions']) : [];
        $this->pluginEvents  = isset($this->maskedInputOptions['pluginEvents'])  ? ArrayHelper::merge($this->pluginEvents, $this->maskedInputOptions['pluginEvents'])   : [];

        if(isset($this->maskedInputOptions['mask'])) {
            $this->pluginOptions['mask'] = $this->maskedInputOptions['mask'];
        }
    }
    
    /**
     * выполняет запуск widget.
     *
     * @inheritdoc
     */
    public function run()
    {
        parent::run();
        if($this->enableMaskedInput) {
            $this->registerClientScript();
        }
    }

    /**
     * регистрирует необходимые скрипты для работы maskedInput jquery plugin.
     * 
     * если используется range date picker - маска будет применена и для второго поля.
     * 
     */
    public function registerClientScript()
    {
        $element = "jQuery('#" . $this->options['id'] . "')";
        MaskedInputAsset::register($this->getView());
        $this->registerPlugin('inputmask', $element);
        if(isset($this->options2['id'])){
            $element2 = "jQuery('#" . $this->options2['id'] . "')";
            $this->registerPlugin('inputmask', $element2);
        }

        $id = $this->options['id'];

        // Para funcionar com o DateControl
        $js = "jQuery('#{$id}').on('complete', function(){
            $('#{$id}').trigger('change');
        });";

        $this->getView()->registerJs($js);

    }
}
