/*

Scrapbook and JS export of queries

 */

// # Hard to solve exercises, solved by at least 5 people, get 20 minimum average scores

const hardToSolve = [{
    $project: {
        exercise_attempts: 1, evaluations: 1, _id: 0
    }
}, {
    $set: {
        reduced: {$reduce: {input: "$evaluations.solved", initialValue: [], in: {$concatArrays: ['$$value', '$$this']}}}
    }
}, {
    $set: {
        concated: {$concatArrays: ["$reduced", "$exercise_attempts"]}
    }
}, {
    $project: {
        concated: {exercise: 1, score: 1}
    }
}, {
    $unwind: {
        path: "$concated"
    }
}, {
    $replaceRoot: {
        newRoot: "$concated"
    }
}, {
    $group: {
        _id: "$exercise",
        count: {
            $sum: 1
        },
        avg: {
            $avg: "$score"
        }
    }
}, {
    $match: {
        count: {$gte: 5}
    }
}, {
    $sort: {
        avg: 1
    }
}, {$limit: 20}, {
    $lookup: {
        from: 'exercises',
        localField: '_id',
        foreignField: '_id',
        as: 'exercise'
    }
}, {
    $set: {
        first: {$arrayElemAt: ["$exercise", 0]}
    }
}, {
    $set: {
        difficulty: "$first.difficulty",
        subject: "$first.subject",
        content: "$first.content"
    }
}, {
    $project: {
        first: 0, exercise: 0
    }
}]

// Convert week and slot to definite time intervals, provide minutes in query
// start: week + (slot // 12) days + 8h + (slot % 12) hours
// end: week + (slot // 12) days + 9h + (slot % 12) hours

// basic usage is with $replaceWith or $set

const timeslotToTimestampConverter = {
    start: {
        $ifNull: ["$start", {
            $add: ["$week",
                {$multiply: [{$floor: {$divide: ["$slot", 12]}}, 24, 60, 60, 1000],},
                {$multiply: [8, 60, 60, 1000]},
                {$multiply: [{$floor: {$mod: ["$slot", 12]}}, 60, 60, 1000],}]
        }]
    },
    end: {
        $ifNull: ["$end", {
            $add: ["$week",
                {$multiply: [{$floor: {$divide: ["$slot", 12]}}, 24, 60, 60, 1000],},
                {$multiply: [9, 60, 60, 1000]},
                {$multiply: [{$floor: {$mod: ["$slot", 12]}}, 60, 60, 1000],}]
        }]
    }
}
// Events might align with courses, so they allocate time slots, or they can be completely different, which allows them to be allocated in a different time


// Events that many people have colliding busy times (maybe?)

const collidingBusyTimesWithEvents = [{
    $replaceRoot: {
        newRoot: "$study_plan"
    }
}, {
    $project: {
        busy_times: 1
    }
}, {
    $unwind: {
        path: "$busy_times"
    }
}, {
    $replaceRoot: {
        newRoot: "$busy_times"
    }
}, {
    $replaceWith: {
        start: {
            $ifNull: ["$start", {
                $add: ["$week",
                    {$multiply: [{$floor: {$divide: ["$slot", 12]}}, 24, 60, 60, 1000],},
                    {$multiply: [8, 60, 60, 1000]},
                    {$multiply: [{$floor: {$mod: ["$slot", 12]}}, 60, 60, 1000],}]
            }]
        },
        end: {
            $ifNull: ["$end", {
                $add: ["$week",
                    {$multiply: [{$floor: {$divide: ["$slot", 12]}}, 24, 60, 60, 1000],},
                    {$multiply: [9, 60, 60, 1000]},
                    {$multiply: [{$floor: {$mod: ["$slot", 12]}}, 60, 60, 1000],}]
            }]
        }
    }
}, {
    $group: {
        _id: null,
        times: {
            $push: {start: "$start", end: "$end"},
        }
    }
}, {
    $lookup: {
        from: 'events',
        pipeline: [
            {$project: {timing: 1}},
            {$unwind: {path: "$timing"}},
            {
                $set: {
                    start: {
                        $ifNull: ["$timing.start", {
                            $add: ["$timing.week",
                                {$multiply: [{$floor: {$divide: ["$timing.slot", 12]}}, 24, 60, 60, 1000],},
                                {$multiply: [8, 60, 60, 1000]},
                                {$multiply: [{$floor: {$mod: ["$timing.slot", 12]}}, 60, 60, 1000],}]
                        }]
                    },
                    end: {
                        $ifNull: ["$timing.end", {
                            $add: ["$timing.week",
                                {$multiply: [{$floor: {$divide: ["$timing.slot", 12]}}, 24, 60, 60, 1000],},
                                {$multiply: [9, 60, 60, 1000]},
                                {$multiply: [{$floor: {$mod: ["$timing.slot", 12]}}, 60, 60, 1000],}]
                        }]
                    }
                }
            },
            {$unset: "timing"},
            {$group: {_id: "$_id", timings: {$push: {start: "$start", end: "$end"}}}}
        ],
        as: 'events'
    }
}, {
    $unwind: {
        path: "$events"
    }
}, {
    $set: {
        colliding_student_count: {
            $size: {
                $filter: {
                    input: "$times",
                    as: "busy_time",
                    cond: {
                        $size: {
                            $filter: {
                                input: "$events.timings",
                                as: "event_timing",
                                cond: {
                                    $not: {
                                        $or: [
                                            {$gt: ["$$event_timing.start", "$$busy_time.end"]},
                                            {$lt: ["$$event_timing.end", "$$busy_time.start"]}
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        event_id: "$events._id"
    }
}, {
    $project: {
        times: 0,
        events: 0,
        _id: 0
    }
}, {
    $match: {
        colliding_student_count: {$gt: 0}
    }
}, {
    $sort: {
        colliding_student_count: -1
    }
}]
// count of people matching requirements for an event (no busy collisions, prerequisites match) (can be used during event creation

// suggested events not already attended

const suggestedEventsThatAreAlreadyAttended = [{
    $project: {
        account_id: 1,
        study_plan: {suggested_events: 1},
        events: {event: 1},
    }
}, {
    $set: {
        already_attended_count: {
            $size: {
                $filter: {
                    input: "$events",
                    as: "item",
                    cond: {$in: ["$$item.event", "$study_plan.suggested_events"]}
                }
            }
        }
    }
}, {
    $project: {
        account_id: 1,
        _id: 0,
        already_attended_count: 1,
    }
}, {
    $match: {
        already_attended_count: {$gt: 0}
    }
}];
// suggested exercises not already solved

// A student is not presented same exercise more than once. Return the subjects so that we can generate more exercises for that subject

// Suggested events don't collide with busy times.

// Locations for events don't collide in timing, busyness of locations based on events

// Student solved exercise statistics by subject and type

