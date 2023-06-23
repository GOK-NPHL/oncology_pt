<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Lot extends Model
{
     /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'shipment_id',
        'readiness_id',
    ];

    public function ptshipment()
    {
        return $this->belongsTo('App\PtShipement', 'shipment_id', 'id');
    }

    public function readiness()
    {
        return $this->belongsTo('App\Readiness', 'readiness_id', 'id');
    }

    public function participants()
    {
        // relationship table = LotParticipants
        return $this->belongsToMany('App\Laboratory', 'lot_participants', 'lot_id', 'participant_id');
    }
}
