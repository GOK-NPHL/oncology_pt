<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Panel extends Model
{
     /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'shipment_id'
    ];

    public function ptshipment()
    {
        return $this->belongsTo('App\PtShipement', 'shipment_id', 'id');
    }

    public function ptSamples()
    {
        return $this->hasMany('App\PtSample', 'panel_id', 'id');
    }

    // lots (relationship-table = lot_panel)
    public function lots()
    {
        return $this->belongsToMany('App\Lot', 'lot_panels', 'panel_id', 'lot_id');
    }
}
