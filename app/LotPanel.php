<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class LotPanel extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'lot_id',
        'panel_id',
        'shipment_id'
    ];

    public function lot()
    {
        return $this->belongsTo('App\Lot', 'lot_id', 'id');
    }
    public function panel()
    {
        return $this->belongsTo('App\Panel', 'panel_id', 'id');
    }
    public function shipment()
    {
        return $this->belongsTo('App\PtShipment', 'shipment_id', 'id');
    }
}
