<?php

namespace App\Http\Controllers;

use App\County;
use App\Lot;
use App\LotPanel;
use App\LotParticipant;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LotController extends Controller
{
    public function getLots(Request $request)
    {
        try {
            $lots = Lot::all();

            // shipment filter
            if ($request->has('shipment_id')) {
                $shipment_id = $request->input('shipment_id');
                $lots = Lot::where('shipment_id', $shipment_id)->get();
            }
            //for each lot, count the participants
            if ($lots->isEmpty()) {
                return response()->json([], 404);
            } else {
                foreach ($lots as $lot) {
                    $lot->participantCount = $lot->participants()->count() ?? 0;
                }
                // get shipment
                $shipment = $lot->ptshipment()->first();
                $lot->shipment = $shipment ?? null;

                // get readiness
                $readiness = $lot->readiness()->first();
                $lot->readiness = $readiness ?? null;
                
                // participants
                $participants = $lot->participants()->get();
                $lot->participants = $participants ?? [];
                
                return response()->json($lots, 200);
            }
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch lot: ' . $ex->getMessage()], 500);
        }
    }

    public function createLot(Request $request)
    {

        try {
            Log::info(json_encode($request->all()));
            $lot = new Lot();
            $lot->name = $request->lot['name'];
            if (isset($request->lot['shipment_id']) && !empty($request->lot['shipment_id'])) {
                $lot->shipment_id = $request->lot['shipment_id'];
            }
            if (isset($request->lot['readiness_id']) && !empty($request->lot['readiness_id'])) {
                $lot->readiness_id = $request->lot['readiness_id'];
            }
            $lot->save();
            //save lot participants
            if (isset($request->lot['participants']) && !empty($request->lot['participants'])) {
                foreach ($request->lot['participants'] as $participant) {
                    LotParticipant::create([
                        'lot_id' => $lot->id,
                        'participant_id' => $participant,
                    ]);
                }
            }
            return response()->json(['Message' => 'Created successfully'], 200);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could not save lot: ' . $ex->getMessage()], 500);
        }
    }

    public function editLot(Request $request)
    {

        try {
            $lot = Lot::find($request->lot['id']);
            if (isset($request->lot['name']) && !empty($request->lot['name'])) {
                $lot->name = $request->lot['name'];
            }
            if (isset($request->lot['shipment_id']) && !empty($request->lot['shipment_id'])) {
                $lot->shipment_id = $request->lot['shipment_id'];
            }
            if (isset($request->lot['readiness_id']) && !empty($request->lot['readiness_id'])) {
                $lot->readiness_id = $request->lot['readiness_id'];
            }
            $lot->save();
            if (isset($request->lot['participants']) && !empty($request->lot['participants'])) {
                foreach ($request->lot['participants'] as $participant) {
                    LotParticipant::create([
                        'lot_id' => $lot->id,
                        'participant_id' => $participant,
                    ]);
                }
            }

            return response()->json(['Message' => 'Updated successfully'], 200);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could not update lot: ' . $ex->getMessage()], 500);
        }
    }

    public function deleteLot(Request $request)
    {
        try {
            $lot = Lot::find($request->id);
            // delete all in lot_participants
            $lot_participants = LotParticipant::where('lot_id', $lot->id)->get();
            foreach ($lot_participants as $lot_participant) {
                $lot_participant->delete();
            }
            // delete all in lot_panels
            $lot_panels = LotPanel::where('lot_id', $lot->id)->get();
            foreach ($lot_panels as $lot_panel) {
                $lot_panel->delete();
            }
            $lot->delete();
            return response()->json(['Message' => 'Deleted successfully'], 200);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could not delete lot: ' . $ex->getMessage()], 500);
        }
    }

    public function getLotById(Request $request)
    {
        try {
            $lot = Lot::find($request->id);
            // get shipment
            $shipment = $lot->ptshipment()->first();
            $lot->shipment = $shipment ?? null;

            // get readiness
            $readiness = $lot->readiness()->first();
            $lot->readiness = $readiness ?? null;
            
            // participants
            $participants = $lot->participants()->get();
            foreach ($participants as $participant) {
                $pcounty = County::find($participant->county);
                $participant->county_name = $pcounty->name ?? '';
            }
            $lot->participants = $participants ?? [];

            return response()->json($lot, 200);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch lot: ' . $ex->getMessage()], 500);
        }
    }
}
