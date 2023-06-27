<?php

namespace App\Http\Controllers;

use App\County;
use App\LotPanel;
use App\Panel;
use App\PanelParticipant;
use App\PtSample;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PanelController extends Controller
{
    public function getPanels(Request $request)
    {
        try {
            $panels = Panel::all();
            //for each panel, count the participants
            if ($panels->isEmpty()) {
                return response()->json([], 404);
            } else {
                foreach ($panels as $panel) {
                    // // sample count
                    $samples = $panel->ptSamples()->get();
                    $panel->sample_count = $samples->count();
                    // // samples
                    $samples = $panel->ptSamples()->get();
                    $panel->samples = $samples ?? [];
                }


                return response()->json($panels, 200);
            }
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch panel: ' . $ex->getMessage()], 500);
        }
    }

    public function createPanel(Request $request)
    {

        try {
            Log::info(json_encode($request->all()));
            $panel = new Panel();
            $panel->name = $request->panel['name'];
            $panel->save();
            //save panel samples
            if (isset($request->panel['samples']) && !empty($request->panel['samples'])) {
                foreach ($request->panel['samples'] as $sample) {
                    PtSample::create([
                        'name' => $sample['name'],
                        'hpv_16' => $sample['hpv_16'],
                        'hpv_18' => $sample['hpv_18'],
                        'hpv_other' => $sample['hpv_other'],
                        'panel_id' => $panel->id,
                    ]);
                }
            }
            return response()->json(['Message' => 'Created successfully'], 200);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could not save panel: ' . $ex->getMessage()], 500);
        }
    }

    public function editPanel(Request $request)
    {

        try {
            $panel = Panel::find($request->panel['id']);
            if (isset($request->panel['name']) && !empty($request->panel['name'])) {
                $panel->name = $request->panel['name'];
            }
            $panel->save();
            if (isset($request->panel['sample']) && !empty($request->panel['sample'])) {
                foreach ($request->panel['sample'] as $sample) {
                    PtSample::create([
                        'name' => $sample['name'],
                        'hpv_16' => $sample['hpv_16'],
                        'hpv_18' => $sample['hpv_18'],
                        'hpv_other' => $sample['hpv_other'],
                        'panel_id' => $panel->id,
                    ]);
                }
            }

            return response()->json(['Message' => 'Updated successfully'], 200);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could not update panel: ' . $ex->getMessage()], 500);
        }
    }

    public function deletePanel(Request $request)
    {
        try {
            $panel = Panel::find($request->id);
            // delete all in lot_panels
            $lot_panels = LotPanel::where('panel_id', $panel->id)->get();
            foreach ($lot_panels as $lp) {
                $lp->delete();
            }
            $panel->delete();
            return response()->json(['Message' => 'Deleted successfully'], 200);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could not delete panel: ' . $ex->getMessage()], 500);
        }
    }

    public function getPanelById(Request $request)
    {
        try {
            $panel = Panel::find($request->id);

            // samples
            $samples = $panel->ptSamples()->get();
            $panel->samples = $samples ?? [];

            // lots
            $lots = $panel->lots()->get();
            foreach ($lots as $lot) {
                $lot->participant_count = count($lot->participants()->get());
            }
            $panel->lots = $lots ?? [];

            return response()->json($panel, 200);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch panel: ' . $ex->getMessage()], 500);
        }
    }
}
