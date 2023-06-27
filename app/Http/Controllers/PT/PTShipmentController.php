<?php

namespace App\Http\Controllers\PT;

use App\Http\Controllers\Controller;
use App\Laboratory;
use App\Lot;
use App\LotPanel;
use App\LotParticipant;
use App\Panel;
use App\PtSample;
use App\PtShipement;
use App\ptsubmission;
use App\Readiness;
use App\ReadinessQuestion;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PTShipmentController extends Controller
{

    public function getShipments_Old(Request $request)
    {
        try {

            $readinessesWithLabId = PtShipement::select(
                "pt_shipements.id",
                "pt_shipements.round_name",
                "pt_shipements.code as shipment_code",
                "pt_shipements.updated_at as last_update",
                "pt_shipements.pass_mark",
                DB::raw('count(*) as participant_count')
            )->join('laboratory_readiness', 'laboratory_readiness.readiness_id', '=', 'pt_shipements.readiness_id')
                ->join('laboratories', 'laboratories.id', '=', 'laboratory_readiness.laboratory_id');

            if ($request->filterEmpty == 1) {
                $readinessesWithLabId = $readinessesWithLabId
                    ->join('ptsubmissions', 'ptsubmissions.pt_shipements_id', '=', 'pt_shipements.id');
            }
            if ($request->userId != '156f41ed97') {
                $readinessesWithLabId = $readinessesWithLabId
                    ->join('users', 'laboratories.id', '=', 'users.laboratory_id')
                    ->where('users.id', $request->userId);
            }

            $readinessesWithLabId = $readinessesWithLabId->groupBy(
                "pt_shipements.id",
                'pt_shipements.round_name',
                'pt_shipements.readiness_id',
                "pt_shipements.updated_at",
                "pt_shipements.pass_mark",
                "pt_shipements.code",
            );



            $readinessesWithNullLabId = PtShipement::select(
                "pt_shipements.id",
                "pt_shipements.round_name",
                "pt_shipements.code as shipment_code",
                "pt_shipements.updated_at as last_update",
                "pt_shipements.pass_mark",
                DB::raw('count(*) as participant_count')
            )->join('laboratory_pt_shipement', 'laboratory_pt_shipement.pt_shipement_id', '=', 'pt_shipements.id')
                ->join('laboratories', 'laboratories.id', '=', 'laboratory_pt_shipement.laboratory_id');

            if ($request->filterEmpty == 1) {
                $readinessesWithNullLabId = $readinessesWithNullLabId
                    ->join('ptsubmissions', 'ptsubmissions.pt_shipements_id', '=', 'pt_shipements.id');
            }
            if ($request->userId != '156f41ed97') {
                $readinessesWithNullLabId = $readinessesWithNullLabId
                    ->join('users', 'laboratories.id', '=', 'users.laboratory_id')
                    ->where('users.id', $request->userId);
            }

            $readinessesWithNullLabId = $readinessesWithNullLabId->groupBy('laboratory_pt_shipement.pt_shipement_id');

            $finalQuery = $readinessesWithLabId
                ->union($readinessesWithNullLabId)->orderBy('last_update', 'desc')
                ->get();

            return $finalQuery;
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch readiness list: ' . $ex->getMessage()], 500);
        }
    }

    public function getShipments(Request $request)
    {
        // get shipments, join lot_participants, join participants, join lots
        // return {id, round_name, shipment_code, last_update, pass_mark, participant_count}
        try {
            $shipments = PtShipement::select(
                "pt_shipements.id",
                "pt_shipements.round_name",
                "pt_shipements.code as shipment_code",
                "pt_shipements.updated_at as last_update",
                "pt_shipements.pass_mark",
                DB::raw('count(laboratories.id) as participant_count')
            )->join('lot_panels', 'lot_panels.shipment_id', '=', 'pt_shipements.id')
                ->join('lot_participants', 'lot_participants.lot_id', '=', 'lot_panels.lot_id')
                ->join('lots', 'lots.id', '=', 'lot_panels.lot_id')
                ->join('laboratories', 'laboratories.id', '=', 'lot_participants.participant_id');

            if ($request->has('with_submissions') && ($request->with_submissions == 'true' || $request->with_submissions == '1')) {
                $shipments = $shipments
                    ->join('ptsubmissions', 'ptsubmissions.pt_shipements_id', '=', 'pt_shipements.id');
            }
            if ($request->has('user_id') && $request->user_id != null && $request->user_id != '156f41ed97') {
                $shipments = $shipments
                    ->join('users', 'laboratories.id', '=', 'users.laboratory_id')
                    ->where('users.id', $request->user_id);
            }
            $shipments = $shipments
                ->groupBy('pt_shipements.id')
                ->orderBy('last_update', 'desc')
                ->get();

            return $shipments;
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch shipments: ' . $ex->getMessage()], 500);
        }
    }

    public function getShipmentById_Old(Request $request)
    {

        try {
            $labIds = [];
            $shipment = PtShipement::find($request->id);

            //get participants
            if (empty($shipment->readiness_id)) {

                $labs = PtShipement::select(
                    "laboratory_pt_shipement.laboratory_id"
                )->join('laboratory_pt_shipement', 'laboratory_pt_shipement.pt_shipement_id', '=', 'pt_shipements.id')
                    ->where('id', $request->id)
                    ->get();
                $labIds = [];
                foreach ($labs as $lab) {
                    $labIds[] = $lab->laboratory_id;
                }
            }

            //get samples
            $ptSamples = PtSample::select(
                "pt_samples.id",
                "name",
                'hpv_16 as 16',
                'hpv_18 as 18',
                'hpv_other as other'
            )->join('pt_shipements', 'pt_shipements.id', '=', 'pt_samples.ptshipment_id')
                ->where('pt_shipements.id', $request->id)
                ->get();

            $samples  = [];

            foreach ($ptSamples as $sample) {
                $samples[] = [
                    'name' => $sample['name'], '16' => $sample['16'],
                    '18' => $sample['18'], 'other' => $sample['other'], 'id' => $sample['id']
                ];
            }

            $payload = [];
            $payload['shipment'] = $shipment;
            $payload['labs'] = $labIds;
            $payload['samples'] = $samples;

            return $payload;
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch shipment: ' . $ex->getMessage()], 500);
        }
    }

    public function getShipmentById(Request $request)
    {

        try {
            $labIds = [];
            $samples = [];
            $panel_lots = [];
            $shipment = PtShipement::find($request->id);

            if (empty($shipment)) {
                return response()->json(['Message' => 'Shipment not found'], 404);
            }

            // lot_panels
            $lp_mappings = LotPanel::where('shipment_id', $request->id)->get();


            $lot_ids = [];
            $panel_ids = [];
            if (!empty($lp_mappings)) {
                foreach ($lp_mappings as $lp_mapping) {
                    $lot = Lot::find($lp_mapping->lot_id);
                    $pnl = Panel::find($lp_mapping->panel_id);
                    if (!empty($lot) && !empty($pnl)) {
                        $panel_lots[] = [
                            'lot_id' => $lp_mapping->lot_id,
                            'panel_id' => $lp_mapping->panel_id,
                            'lot_name' => $lot->name,
                            'panel_name' => $pnl->name
                        ];
                        $lot_ids[] = $lp_mapping->lot_id;
                        $panel_ids[] = $lp_mapping->panel_id;
                    }
                }
            }
            //get participants
            if (empty($lot_ids)) {
                $participating_labs = [];
                foreach ($lot_ids as $lot_id) {
                    $lot_participant_map = LotParticipant::where('lot_id', $lot_id)->get();
                    foreach ($lot_participant_map as $lot_participant) {
                        $pl = Laboratory::find($lot_participant->participant_id);
                        if (!empty($pl)) {
                            $participating_labs[] = $pl;
                            $labIds[] = $pl->id;
                        }
                    }
                }
            }




            $payload = [];
            $payload['shipment'] = $shipment;
            $payload['labs'] = $labIds;
            // $payload['samples'] = $samples;
            $payload['panel_lots'] = $panel_lots;

            return $payload;
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch shipment: ' . $ex->getMessage()], 500);
        }
    }


    public function saveShipment(Request $request)
    {
        try {

            $shipments = PtShipement::where('round_name', $request->shipement['round'])->get();
            if (count($shipments) > 0) {
                return response()->json(['Message' => 'Error during creating shipment. Round name already exist '], 500);
            }

            if (empty($request->shipement['panel_lots']) || count($request->shipement['panel_lots']) == 0) {
                return response()->json(['Message' => 'Please add panel-lot mappings '], 500);
            }

            $shipment = PtShipement::create([
                'pass_mark' => $request->shipement['pass_mark'],
                'round_name' => $request->shipement['round'],
                'code' => $request->shipement['shipment_code'],
                'start_date' => $request->shipement['start_date'],
                'end_date' => $request->shipement['result_due_date'],
                'test_instructions' => $request->shipement['test_instructions'],
                'readiness_id' => null,
            ]);

            // Save panel-lot mapping
            foreach ($request->shipement['panel_lots'] as $sample) {

                $panel_lot_mapping = new LotPanel();
                $panel_lot_mapping->lot_id = $sample['lot_id'];
                $panel_lot_mapping->panel_id = $sample['panel_id'];
                $panel_lot_mapping->shipment_id = $shipment->id;
                $panel_lot_mapping->save();
            }
            return response()->json(['Message' => 'Created successfully'], 200);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could not save the checklist ' . $ex->getMessage()], 500);
        }
    }


    public function updateShipment(Request $request)
    {

        try {

            $shipments = PtShipement::find($request->shipement['id']);

            if (isset($request->shipement['pass_mark'])) {
                $shipments->pass_mark = $request->shipement['pass_mark'];
            }
            if (isset($request->shipement['round'])) {
                $shipments->round_name = $request->shipement['round'];
            }
            if (isset($request->shipement['shipment_code'])) {
                $shipments->code = $request->shipement['shipment_code'];
            }
            if (isset($request->shipement['start_date'])) {
                $shipments->start_date = $request->shipement['start_date'];
            }
            if (isset($request->shipement['result_due_date'])) {
                $shipments->end_date = $request->shipement['result_due_date'];
            }
            if (isset($request->shipement['test_instructions'])) {
                $shipments->test_instructions = $request->shipement['test_instructions'];
            }

            $shipments->save();

            if (isset($request->shipement['panel_lots']) && count($request->shipement['panel_lots']) > 0) {

                // replace all existing mappings with new ones
                $existing_pl_maps = LotPanel::where('shipment_id', $shipments->id)->get();
                foreach ($existing_pl_maps as $pl_map) {
                    $pl_map->delete();
                }

                // create new mappings
                foreach ($request->shipement['panel_lots'] as $mapping) {
                    try {
                        $pl_map = new LotPanel();
                        $pl_map->lot_id = $mapping['lot_id'];
                        $pl_map->panel_id = $mapping['panel_id'];
                        $pl_map->shipment_id = $shipments->id;
                        $pl_map->save();
                    } catch (Exception $ex) {
                        Log::error($ex);
                    }
                }
            }

            return response()->json(['Message' => 'Updated successfully'], 200);
        } catch (Exception $ex) {
            Log::error($ex);
            return response()->json(['Message' => 'Could not save the checklist ' . $ex->getMessage()], 500);
        }
    }

    public function getUserSamples()
    {
        return $this->geSamples();
    }

    public function getUserSampleResponseResult(Request $request)
    {
        return $this->geSamples($request->id);
    }

    private function geSamples($submission_id = null)
    {

        $user = Auth::user();

        try {

            $shipments = PtShipement::select( //when using labs
                "pt_shipements.id",
                "pt_shipements.id as pt_shipements_id",
                "pt_shipements.round_name",
                "pt_shipements.code",
                "pt_shipements.start_date",
                "pt_shipements.end_date",
                "pt_shipements.test_instructions",
                "pt_samples.id as sample_id",
                "pt_samples.name as sample_name",
                "users.id as user_id",
                DB::raw("1 as is_readiness_answered"),
                DB::raw("null as readiness_id"),
                DB::raw("1 as readiness_approval_id")

            );

            if ($submission_id != null) {

                $shipments = $shipments->join('ptsubmissions', 'pt_shipements.id', '=', 'ptsubmissions.pt_shipements_id');
            }

            // $shipments = $shipments->join('laboratory_pt_shipement', 'laboratory_pt_shipement.pt_shipement_id', '=', 'pt_shipements.id')
            //     ->join('pt_samples', 'pt_samples.ptshipment_id', '=', 'pt_shipements.id')
            //     ->join('laboratories', 'laboratory_pt_shipement.laboratory_id', '=', 'laboratories.id')
            //     ->join('users', 'users.laboratory_id', '=', 'laboratories.id');

            $shipments = $shipments->join('lot_panels', 'lot_panels.shipment_id', '=', 'pt_shipements.id')
                ->join('lots', 'lots.id', '=', 'lot_panels.lot_id')
                ->join('panels', 'panels.id', '=', 'lot_panels.panel_id')
                ->join('lot_participants', 'lot_participants.lot_id', '=', 'lots.id')
                ->join('laboratories', 'lot_participants.participant_id', '=', 'laboratories.id')
                ->join('pt_samples', 'pt_samples.panel_id', '=', 'panels.id')
                ->join('users', 'users.laboratory_id', '=', 'laboratories.id');

            if ($submission_id == null) {
                $shipments = $shipments->where('users.id', $user->id);
            } else {
                $shipments = $shipments->where('ptsubmissions.id', $submission_id);
            }

            //when using readiness
            $shipments2 = PtShipement::select( //when using readiness
                "pt_shipements.id",
                "pt_shipements.id as pt_shipements_id",
                "pt_shipements.round_name",
                "pt_shipements.code",
                "pt_shipements.start_date",
                "pt_shipements.end_date",
                "pt_shipements.test_instructions",
                "pt_samples.id as sample_id",
                "pt_samples.name as sample_name",
                "users.id as user_id",
                "readiness_answers.id as is_readiness_answered", //check if readiness for this shipment id filled
                "pt_shipements.readiness_id as readiness_id",
                "readiness_approvals.id as readiness_approval_id",

            );

            if ($submission_id != null) {
                $shipments2 = $shipments2->join('ptsubmissions', 'pt_shipements.id', '=', 'ptsubmissions.pt_shipements_id');
            }

            // $shipments2 = $shipments2->join('laboratory_readiness', 'laboratory_readiness.readiness_id', '=', 'pt_shipements.readiness_id')
            //     ->leftJoin('readiness_answers',  'laboratory_readiness.readiness_id', '=',  'readiness_answers.readiness_id')
            //     ->leftJoin('readiness_approvals', 'readiness_answers.laboratory_id', '=',  'readiness_approvals.lab_id')
            //     ->join('pt_samples', 'pt_samples.ptshipment_id', '=', 'pt_shipements.id')
            //     ->join('laboratories', 'laboratory_readiness.laboratory_id', '=', 'laboratories.id')
            //     ->join('users', 'users.laboratory_id', '=', 'laboratories.id');

            $shipments2 = $shipments2->join('lot_panels', 'lot_panels.shipment_id', '=', 'pt_shipements.id')
                ->join('lots', 'lots.id', '=', 'lot_panels.lot_id')
                ->join('panels', 'panels.id', '=', 'lot_panels.panel_id')
                ->join('readinesses', 'readinesses.id', '=', 'lots.readiness_id')
                ->join('laboratory_readiness', 'laboratory_readiness.readiness_id', '=', 'readinesses.id')
                ->leftJoin('readiness_answers',  'laboratory_readiness.readiness_id', '=',  'readiness_answers.readiness_id')
                ->leftJoin('readiness_approvals', 'readiness_answers.laboratory_id', '=',  'readiness_approvals.lab_id')
                ->join('lot_participants', 'lot_participants.lot_id', '=', 'lots.id')
                ->join('laboratories', 'lot_participants.participant_id', '=', 'laboratories.id')
                ->join('pt_samples', 'pt_samples.panel_id', '=', 'panels.id')
                // ->join('pt_samples', 'pt_samples.ptshipment_id', '=', 'pt_shipements.id')
                // ->join('laboratories', 'laboratory_readiness.laboratory_id', '=', 'laboratories.id')
                ->join('users', 'users.laboratory_id', '=', 'laboratories.id');

            if ($submission_id == null) {
                $shipments2 = $shipments2->where('users.id', $user->id);
            } else {
                $shipments2 = $shipments2->where('ptsubmissions.id', $submission_id);
            }

            $shipments2 =  $shipments2->union($shipments);

            $shipments2 = $shipments2->get();


            $payload = [];
            $payload =  $this->wrapData($payload, $shipments2);

            return $payload;
        } catch (Exception $ex) {
            Log::error($ex);
            return response()->json(['Message' => 'Could fetch samples: ' . $ex->getMessage()], 500);
        }
    }

    private function wrapData($payload, $shipments2)
    {

        $sampleIds = [];
        $user = Auth::user();

        foreach ($shipments2 as $lab) {

            $submissionIdQry = ptsubmission::select( //when using readiness
                "ptsubmissions.id as submission_id",
            )->join('laboratories', 'laboratories.id', '=', 'ptsubmissions.lab_id')
                ->where('ptsubmissions.pt_shipements_id', $lab->pt_shipements_id)
                ->where('laboratories.id', $user->laboratory_id)->get();

            $submissionId = null;
            foreach ($submissionIdQry as $subIdRS) {
                $submissionId = $subIdRS->submission_id;
            }

            if (array_key_exists($lab->id, $payload)) {
                if (!array_key_exists($lab->sample_id, $sampleIds)) {
                    $payload[$lab->id]['samples'][] = ['sample_name' => $lab->sample_name, 'sample_id' => $lab->sample_id];
                    $sampleIds[$lab->sample_id] = 1;
                }
            } else {

                if (!array_key_exists($lab->sample_id, $sampleIds)) {
                    $sampleIds[$lab->sample_id] = 1;
                    $payload[$lab->id] = [];
                    $payload[$lab->id]['samples'] = [];
                    $payload[$lab->id]['samples'][] = ['sample_name' => $lab->sample_name, 'sample_id' => $lab->sample_id];

                    $payload[$lab->id]['test_instructions'] = $lab->test_instructions;
                    $payload[$lab->id]['id'] = $lab->id;
                    $payload[$lab->id]['pt_shipements_id'] = $lab->pt_shipements_id;
                    $payload[$lab->id]['start_date'] = $lab->start_date;
                    $payload[$lab->id]['code'] = $lab->code;
                    $payload[$lab->id]['end_date'] = $lab->end_date;
                    $payload[$lab->id]['round_name'] = $lab->round_name;
                    $payload[$lab->id]['submission_id'] = $submissionId;
                    $payload[$lab->id]['is_readiness_answered'] = $lab->is_readiness_answered;
                    $payload[$lab->id]['readiness_id'] = $lab->readiness_id;
                    $payload[$lab->id]['readiness_approval_id'] = $lab->readiness_approval_id;
                    $payload[$lab->id]['user_id'] = $lab->user_id;
                }
            }
        }
        return $payload;
    }

    public function getShipmentResponsesById(Request $request)
    {
        $user = Auth::user();
        try {

            $shipmentsResponses = DB::table("pt_shipements")->distinct()
                ->join('ptsubmissions', 'ptsubmissions.pt_shipements_id', '=', 'pt_shipements.id')
                ->join('laboratories', 'ptsubmissions.lab_id', '=', 'laboratories.id')
                ->join('users', 'ptsubmissions.user_id', '=', 'users.id')
                ->where('pt_shipements.id', $request->id)
                ->get([
                    "pt_shipements.id as pt_shipment_id",
                    "pt_shipements.pass_mark",
                    "pt_shipements.start_date",
                    "pt_shipements.code",
                    "pt_shipements.end_date",
                    "pt_shipements.round_name as name",
                    "laboratories.id as lab_id",
                    "users.name as fname",
                    "users.second_name as sname",
                    "laboratories.phone_number",
                    "laboratories.lab_name",
                    "laboratories.email",
                    "ptsubmissions.id as ptsubmission_id",
                    "ptsubmissions.created_at",
                    "ptsubmissions.updated_at"
                ]);

            // for each shipment response, get the sample results
            foreach ($shipmentsResponses as $key => $shipmentResponse) {
                $sample_results = DB::table("pt_submission_results")
                    ->where('ptsubmission_id', $shipmentResponse->ptsubmission_id)
                    ->join('pt_samples', 'pt_samples.id', '=', 'pt_submission_results.sample_id')
                    ->get([
                        'pt_submission_results.ptsubmission_id as pt_submission_id',
                        'pt_samples.id as sample_id',
                        'pt_samples.name as sample_name',
                        'pt_samples.hpv_16 as expected_hpv_16',
                        'pt_samples.hpv_18 as expected_hpv_18',
                        'pt_samples.hpv_other as expected_hpv_other',
                        'pt_submission_results.hpv_16 as submitted_hpv_16',
                        'pt_submission_results.hpv_18 as submitted_hpv_18',
                        'pt_submission_results.hpv_other as submitted_hpv_other',
                    ]);
                // calculate the performance
                $response_performance = 0;
                $sample_count = DB::table("pt_samples")->where('ptshipment_id', $shipmentResponse->pt_shipment_id)->count() ?? 5;
                $score_per_sample = (100 / $sample_count) ?? 20;

                foreach ($sample_results as $key => $sample_result) {
                    $expected_hpv_16 = $sample_result->expected_hpv_16;
                    $expected_hpv_18 = $sample_result->expected_hpv_18;
                    $expected_hpv_other = $sample_result->expected_hpv_other;
                    $submitted_hpv_16 = $sample_result->submitted_hpv_16;
                    $submitted_hpv_18 = $sample_result->submitted_hpv_18;
                    $submitted_hpv_other = $sample_result->submitted_hpv_other;
                    $sample_result->performance = 0;
                    if ($expected_hpv_16 == $submitted_hpv_16 && $expected_hpv_18 == $submitted_hpv_18 && $expected_hpv_other == $submitted_hpv_other) {
                        $sample_result->performance += $score_per_sample;
                    }
                    $response_performance += $sample_result->performance;
                }
                // $shipmentResponse->sample_results = $sample_results;
                $shipmentResponse->performance = $response_performance;
            }

            return $shipmentsResponses;
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch ptsubmissions list: ' . $ex->getMessage()], 500);
        }
    }

    public function getShipmentResponseReport($id,  $is_participant)
    {
        $user = Auth::user();
        try {

            $shipmentsResponses = DB::table("pt_shipements")->distinct()
                ->join('ptsubmissions', 'ptsubmissions.pt_shipements_id', '=', 'pt_shipements.id')
                ->join('pt_submission_results', 'pt_submission_results.ptsubmission_id', '=', 'ptsubmissions.id')
                ->join('laboratories', 'ptsubmissions.lab_id', '=', 'laboratories.id')
                ->join('platforms', 'ptsubmissions.platform_id', '=', 'platforms.id')
                ->join('users', 'ptsubmissions.user_id', '=', 'users.id');

            if ($is_participant == 1) {
                $shipmentsResponses = $shipmentsResponses->where('ptsubmissions.lab_id', $user->laboratory_id)
                    ->where('ptsubmissions.pt_shipements_id', $id);
            } else {
                $shipmentsResponses = $shipmentsResponses->where('ptsubmissions.id', $id);
            }

            $shipmentsResponses = $shipmentsResponses->get([
                "pt_shipements.id as shipment_id",
                "pt_shipements.created_at as shipment_date",
                "pt_shipements.code",
                "pt_shipements.end_date",
                "pt_shipements.round_name as name",
                "laboratories.id as lab_id",
                "laboratories.pt_code as pt_code",
                "users.name as fname",
                "users.second_name as sname",
                "laboratories.phone_number",
                "laboratories.lab_name",
                "laboratories.email",
                "ptsubmissions.id as ptsubmission_id",
                "ptsubmissions.created_at as _first_submission_date",
                "ptsubmissions.updated_at  as update_submission_date",
                "ptsubmissions.testing_date",
                "ptsubmissions.kit_expiry_date",
                "ptsubmissions.kit_date_received",
                "ptsubmissions.pt_lot_no",
                "platforms.name as platform_name"
            ]);


            //  one
            // $hipmentsRefResult = DB::table("pt_shipements")->distinct()
            //     ->join('pt_samples', 'pt_samples.ptshipment_id', '=', 'pt_shipements.id');
            $hipmentsRefResult = DB::table("pt_shipements")->distinct()
                ->join('lot_panels', 'lot_panels.shipment_id', '=', 'pt_shipements.id')
                ->join('panels', 'panels.id', '=', 'lot_panels.panel_id')
                ->join('pt_samples', 'pt_samples.panel_id', '=', 'panels.id');
                // ->groupBy('pt_shipements.id');

            $hipmentsRefResult = $hipmentsRefResult->get([
                "pt_shipements.id as shipment_id",
                "pt_samples.hpv_16 as ref_hpv_16",
                "pt_samples.hpv_18 as ref_hpv_18",
                "pt_samples.hpv_other as ref_hpv_other",
                "pt_samples.name as sample_name"
            ]);


            //  two
            $shipmentsResponsesRlt = DB::table("pt_shipements")->distinct()
                ->join('ptsubmissions', 'ptsubmissions.pt_shipements_id', '=', 'pt_shipements.id')
                ->leftJoin('pt_submission_results', 'pt_submission_results.ptsubmission_id', '=', 'ptsubmissions.id')
                ->join('pt_samples', 'pt_samples.id', '=', 'pt_submission_results.sample_id');
            if ($is_participant == 1) {
                $shipmentsResponsesRlt = $shipmentsResponsesRlt->where('ptsubmissions.lab_id', $user->laboratory_id)
                    ->where('ptsubmissions.pt_shipements_id', $id);
            } else {
                $shipmentsResponsesRlt = $shipmentsResponsesRlt->where('ptsubmissions.id', $id);
            }

            $shipmentsResponsesRlt = $shipmentsResponsesRlt->get([
                "pt_shipements.id as shipment_id",
                "pt_submission_results.hpv_16 as result_hpv_16",
                "pt_submission_results.hpv_18 as result_hpv_18",
                "pt_submission_results.hpv_other as result_hpv_other",
                "pt_samples.name as sample_name"
            ]);


            $dataPayload = [];
            foreach ($shipmentsResponsesRlt as $rslt) {
                $refRslt = $hipmentsRefResult->where('sample_name', $rslt->sample_name)->where('shipment_id', $rslt->shipment_id)->first();
                if (!empty($refRslt) && $refRslt->sample_name == $rslt->sample_name) {
                    $data = [];
                    $data['result_hpv_16'] = $rslt->result_hpv_16;
                    $data['result_hpv_18'] = $rslt->result_hpv_18;
                    $data['result_hpv_other'] = $rslt->result_hpv_other;
                    $data['sample_name'] = $refRslt->sample_name;
                    $data['ref_hpv_16'] = $refRslt->ref_hpv_16;
                    $data['ref_hpv_18'] = $refRslt->ref_hpv_18;
                    $data['ref_hpv_other'] = $refRslt->ref_hpv_other;
                    $dataPayload[] = $data;
                }
            }
            // foreach ($hipmentsRefResult as $refRslt) {
            // }

            return [
                'metadata' => $shipmentsResponses, "results" => $dataPayload
            ];
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch report data: ' . $ex->getMessage()], 500);
        }
    }
}
