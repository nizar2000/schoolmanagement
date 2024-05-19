<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
{
    public function toArray($request)
    {
        return array_merge(parent::toArray($request), [
            'formatted_updated_at' =>optional( $this->updated_at)->diffForHumans(),
        ]);
    }
}
