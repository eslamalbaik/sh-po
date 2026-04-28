<?php

namespace App\Traits;

trait Searchable
{
    /**
     * Scope a query to search across searchable columns.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string|null $search
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeSearch($query, $search)
    {
        if (empty($search)) {
            return $query;
        }

        $searchable = $this->searchable ?? [];

        return $query->where(function ($q) use ($search, $searchable) {
            foreach ($searchable as $index => $column) {
                if ($index === 0) {
                    $q->where($column, 'like', "%{$search}%");
                } else {
                    $q->orWhere($column, 'like', "%{$search}%");
                }
            }
        });
    }
}
