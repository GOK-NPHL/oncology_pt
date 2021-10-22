<?php

namespace App\Http\Controllers\Service;

use App\Http\Controllers\Controller;
use App\PtShipement;
use App\PtSubmissionResult;
use App\ptsubmission as SubmissionModel;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class Submission extends Controller
{



    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        // $this->middleware('auth:sanctum');
    }

    public function createSubmission(Request $request)
    {
        try {
            $submission = $request->submission;
            $submissionModel = new SubmissionModel([

                "testing_date" => $submission["testingDate"],
                "kit_date_received" => $submission["kitReceivedDate"],
                "lot_date_received" => $submission["ptLotReceivedDate"],
                "kit_expiry_date" => $submission["kitExpiryDate"],
                "kit_lot_no" => $submission["kitLotNo"],
                "name_of_test" => $submission["nameOfTest"],
                "pt_lot_no" => $submission["ptLotNumber"],
                "lab_id" => $submission["labId"],
                "user_id" => $submission["userId"],
                "tester_name" => $submission["testerName"],
                "test_justification" => $submission["testJustification"],
                "pt_tested" => $submission["isPTTested"],
                "not_test_reason" => $submission["ptNotTestedReason"],
                "other_not_tested_reason" => $submission["ptNotTestedOtherReason"],
                "pt_shipements_id" => $submission["ptShipementId"],
                "platform_id" => $submission["platformId"]

            ]);

            $submissionModel->save();
            $submissionId = $submissionModel->id;


            // if (count($submission["samples"]) > 0) {

            foreach ($submission["samples"] as $key => $val) {

                $ptLtResult = new PtSubmissionResult([
                    "ptsubmission_id" => $submissionId,
                    "sample_id" => $key,
                    "hpv_16" => $val["16"],
                    "hpv_18" => $val["18"],
                    "hpv_other" => $val["other"],
                ]);
                $ptLtResult->save();
            }

            return response()->json(['Message' => 'Saved successfully'], 200);
        } catch (Exception $ex) {
            Log::error($ex);
            return response()->json(['Message' => 'Could not save sumbmission: ' . $ex->getMessage()], 500);
        }
    }

    public function getSubmissions()
    {
        //shipped vs how many feedback
        try {

            $payload = []; // round_name= total_shipment, total_responses, end_date

            //shipement count
            $shipmentsByLabRound = PtShipement::select( //when using labs

                "pt_shipements.round_name",
                "pt_shipements.end_date",
                DB::raw('count(*) as total_participant')

            )->join('laboratory_pt_shipement', 'laboratory_pt_shipement.pt_shipement_id', '=', 'pt_shipements.id')
                ->groupBy('round_name', 'end_date')->orderBy('pt_shipements.created_at', 'asc');

            $shipmentsByReadinessRound = PtShipement::select( //when using labs

                "pt_shipements.round_name",
                "pt_shipements.end_date",
                DB::raw('count(*) as total_participant')

            )->join('laboratory_readiness', 'laboratory_readiness.readiness_id', '=', 'pt_shipements.readiness_id')
                ->groupBy('round_name', 'end_date')->orderBy('pt_shipements.created_at', 'asc');


            $totalShipments = $shipmentsByLabRound
                ->union($shipmentsByReadinessRound)
                ->get();


            foreach ($totalShipments as $data) {

                if (array_key_exists($data->round_name, $payload)) {

                    $payload[$data->round_name]['total_shipment'] = $payload[$data->round_name]['total_shipment'] + $data->total_participant;
                    $payload[$data->round_name]['end_date'] = $data->end_date;
                } else {
                    $payload[$data->round_name] = ['total_shipment' => 0, 'total_responses' => 0, 'end_date' => null];
                    $payload[$data->round_name]['end_date'] = $data->end_date;
                    $payload[$data->round_name]['total_shipment'] = $data->total_participant;
                }
            }

            //submissions count
            $submissionsByLabRound = PtShipement::select( //when using labs

                "pt_shipements.round_name",
                "pt_shipements.end_date",
                DB::raw('count(*) as total_participant')

            )->join('laboratory_pt_shipement', 'laboratory_pt_shipement.pt_shipement_id', '=', 'pt_shipements.id')
                ->join('ptsubmissions', 'pt_shipements.id', '=', 'ptsubmissions.pt_shipements_id')
                ->groupBy('round_name', 'end_date')->orderBy('pt_shipements.created_at', 'asc');

            $submissionsByReadinessRound = PtShipement::select( //when using labs

                "pt_shipements.round_name",
                "pt_shipements.end_date",
                DB::raw('count(*) as total_participant')

            )->join('laboratory_readiness', 'laboratory_readiness.readiness_id', '=', 'pt_shipements.readiness_id')
                ->join('ptsubmissions', 'pt_shipements.id', '=', 'ptsubmissions.pt_shipements_id')
                ->groupBy('round_name', 'end_date')
                ->orderBy('pt_shipements.created_at', 'asc');

            $totalSubmissions = $submissionsByLabRound
                ->union($submissionsByReadinessRound)
                ->get();

            foreach ($totalSubmissions as $data) {

                if (array_key_exists($data->round_name, $payload)) {
                    $payload[$data->round_name]['end_date'] = $data->end_date;
                    $payload[$data->round_name]['total_responses'] = $payload[$data->round_name]['total_responses'] + $data->total_participant;
                } else {
                    $payload[$data->round_name] = ['total_shipment' => 0, 'total_responses' => 0, 'end_date' => null];
                    $payload[$data->round_name]['end_date'] = $data->end_date;
                    $payload[$data->round_name]['total_responses'] = $data->total_participant;
                }
            }
            return  $payload;
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Error shipmment summaries: ' . $ex->getMessage()], 500);
        }
    }

    public function getSubmissionById(Request $request)
    {

        $user = Auth::user();
        try {

            $submission = SubmissionModel::select(
                'ptsubmissions.id',
                'ptsubmissions.testing_date',
                'ptsubmissions.name_of_test',
                'ptsubmissions.kit_lot_no',
                'ptsubmissions.kit_date_received',
                'ptsubmissions.kit_expiry_date',
                'ptsubmissions.pt_lot_no',
                'ptsubmissions.lot_date_received',
                'ptsubmissions.user_id',
                'ptsubmissions.tester_name',
                'ptsubmissions.test_justification',
                'ptsubmissions.pt_tested',
                'ptsubmissions.not_test_reason',
                'ptsubmissions.other_not_tested_reason',
                'ptsubmissions.platform_id',
                'laboratories.email',
                'ptsubmissions.lab_id',
                'laboratories.lab_name',
                'laboratories.mfl_code',
                'pt_shipements.test_instructions',

            )->join('laboratories', 'laboratories.id', '=', 'ptsubmissions.lab_id')
                ->join('pt_shipements', 'pt_shipements.id', '=', 'ptsubmissions.pt_shipements_id')
                // ->where('ptsubmissions.lab_id', '=', $user->laboratory_id)
                ->where('ptsubmissions.id', '=', $request->id)
                ->get();


            $submissionResults = DB::table('pt_submission_results')

                ->select('sample_id', 'hpv_16 as 16', 'hpv_18 as 18', 'hpv_other as other')
                ->where('ptsubmission_id', $request->id);
            $submissionResults = $submissionResults->get();
            $payload = ['data' => $submission[0], 'test_results' => $submissionResults];

            return $payload;
            // return SubmissionModel::all();
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Error getting org units: ' . $ex->getMessage()], 500);
        }
    }


    public function updateSubmission(Request $request)
    {

        try {
            $submission = $request->submission;

            $submissionModel = SubmissionModel::find($submission['id']);

            $submissionModel->testing_date = $submission["testingDate"];
            $submissionModel->kit_date_received = $submission["kitReceivedDate"];
            $submissionModel->lot_date_received = $submission["ptLotReceivedDate"];
            $submissionModel->kit_expiry_date = $submission["kitExpiryDate"];
            $submissionModel->kit_lot_no = $submission["kitLotNo"];
            $submissionModel->name_of_test = $submission["nameOfTest"];
            $submissionModel->pt_lot_no = $submission["ptLotNumber"];
            $submissionModel->lab_id = $submission["labId"];
            $submissionModel->user_id = $submission["userId"];
            $submissionModel->tester_name = $submission["testerName"];
            $submissionModel->test_justification = $submission["testJustification"];
            $submissionModel->pt_tested = $submission["isPTTested"];
            $submissionModel->not_test_reason = $submission["ptNotTestedReason"];
            $submissionModel->other_not_tested_reason = $submission["ptNotTestedOtherReason"];
            $submissionModel->pt_shipements_id = $submission["ptShipementId"];
            $submissionModel->platform_id = $submission["platformId"];

            $submissionModel->save();

            DB::table('pt_submission_results')->where('ptsubmission_id', $submission['id'])->delete();

            if ($submission["isPTTested"]) {
                foreach ($submission["samples"] as $key => $val) {

                    $ptLtResult = new PtSubmissionResult([
                        "hpv_16" => $val["16"],
                        "hpv_18" => $val["18"],
                        "hpv_other" => $val["other"],
                        "ptsubmission_id" =>  $submission['id'],
                        "sample_id" => $key
                    ]);
                    $ptLtResult->save();
                }
            }


            return response()->json(['Message' => 'Updated successfully'], 200);
        } catch (Exception $ex) {
            Log::error($ex);
            return response()->json(['Message' => 'Could not save sumbmission: ' . $ex->getMessage()], 500);
        }
    }
}
