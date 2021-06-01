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
// count of people matching requirements for an event (prerequisites match) (can be used during event creation)

const countStudents = function (students, join_conditions) {
    if (!join_conditions) {
        return students;
    }
    return join_conditions.map(function (join_condition) {
        if (join_condition.of_subject) {
            return students.filter(function (student) {
                var result_exercise = student.exercises.find(function (exercise) {
                    return exercise.difficulty == join_condition.difficulty && exercise.subject == join_condition.subject;
                });
                return result_exercise ? result_exercise.count > 0 : false;
            });
        }
        if (join_condition.skill) {
            var skill = join_condition.skill.skill, level = join_condition.skill.level;
            return students.filter(function (student) {
                var result_skill = student.skill_set.find(function (skill_) {
                    return skill_.skill == skill;
                });
                return result_skill ? result_skill.level >= level : false;
            });
        }
        if (join_condition.subject) {
            return students.filter(function (student) {
                return !!student.passed_subjects.find(function (subject) {
                    return subject == join_condition.subject
                });
            });
        }
        if (join_condition.lecture_id) {
            return students.filter(function (student) {
                return !!student.courses_attended.find(function (attended) {
                    return attended == join_condition.lecture_id
                });
            });
        }
        return [];
    }).reduce(function (acc, arr) {
        return acc.concat(arr);
    }, []);
}

const studentsMatchingPrerequisites = [{
    $project: {
        join_conditions: 1,
    }
}, {
    $lookup: {
        from: 'students',
        pipeline: [{
            $project: {
                account_id: 1,
                skill_set: 1,
                exercises_done: {
                    $concatArrays: [{
                        $reduce: {
                            input: "$evaluations.solved.exercise",
                            initialValue: [],
                            in: {$concatArrays: ["$$value", "$$this"]}
                        }
                    }, "$exercise_attempts.exercise"]
                },
                courses_attended: "$study_plan.courses.lecture_id",
                all_subject_attempts: "$evaluations"
            }
        }, {
            $set: {
                all_subject_attempts: {
                    $filter: {
                        input: "$all_subject_attempts",
                        as: "attempt",
                        cond: {
                            $and: [{$eq: ["$$attempt.status", "pass"]}, {$eq: ["$$attempt.type_", "subjectEvaluation"]}]
                        }
                    },
                }
            }
        }, {
            $set: {
                all_subject_attempts: {
                    $map: {
                        input: "$all_subject_attempts",
                        as: "attempt",
                        in: {$arrayElemAt: ["$$attempt.solved", 0]}
                    }
                }
            }
        }, {
            $lookup: {
                from: 'exercises',
                localField: 'all_subject_attempts.exercise',
                foreignField: '_id',
                as: 'passed_exercises'
            }
        }, {
            $project: {
                all_subject_attempts: 0,
                passed_exercises: {
                    _id: 0,
                    difficulty: 0,
                    content: 0
                }
            }
        }, {
            $set: {
                passed_subjects: {$map: {input: "$passed_exercises", as: "exercise", in: "$$exercise.subject"}}
            }
        }, {
            $unset:
                "passed_exercises"
        }, {
            $lookup: {
                from: 'exercises',
                localField: 'exercises_done',
                foreignField: '_id',
                as: 'exercises'
            }
        }, {
            $project: {
                exercises_done: 0,
                exercises: {
                    _id: 0,
                    content: 0
                }
            }
        }, {
            $unwind: {
                path: "$exercises"
            }
        }, {
            $group: {
                _id: {
                    _id: "$_id",
                    difficulty: "$exercises.difficulty",
                    subject: "$exercises.subject"
                },
                count: {
                    $sum: 1
                },
                rest: {$push: "$$ROOT"}
            }
        }, {
            $set: {
                rest: {$arrayElemAt: ["$rest", 0]}
            }
        }, {
            $set: {
                rest: {exercises: {count: "$count"}}
            }
        }, {
            $replaceRoot: {
                newRoot: "$rest"
            }
        }, {
            $group: {
                _id: "$_id",
                exercises: {

                    $push: "$exercises"
                },
                rest: {$push: "$$ROOT"},
            }
        }, {
            $set: {
                rest: {$arrayElemAt: ["$rest", 0]}
            }
        }, {
            $set: {
                rest: {exercises: "$exercises"}
            }
        }, {
            $replaceRoot: {
                newRoot: "$rest"
            }
        }],
        as: 'student'
    }
}, {
    $match: {}
}, {
    $set: {
        passing_students: {
            $function: {
                args: ["$student", "$join_conditions"],
                lang: "js",
                body: "function (students, join_conditions) {if (!join_conditions) {return students;}return join_conditions.map(function (join_condition) {if (join_condition.of_subject) {return students.filter(function (student) {var result_exercise = student.exercises.find(function (exercise) {return exercise.difficulty == join_condition.difficulty && exercise.subject == join_condition.subject;});return result_exercise ? result_exercise.count > 0 : false;});}if (join_condition.skill) {var skill = join_condition.skill.skill, level = join_condition.skill.level;return students.filter(function (student) {var result_skill = student.skill_set.find(function (skill_) {return skill_.skill == skill;});return result_skill ? result_skill.level >= level : false;});}if (join_condition.subject) {return students.filter(function (student) {return !!student.passed_subjects.find(function(subject) {return subject == join_condition.subject});});}if (join_condition.lecture_id) {return students.filter(function (student) {return !!student.courses_attended.find(function(attended) {return attended == join_condition.lecture_id});});}return [];}).reduce(function(acc, arr) {return acc.concat(arr);}, []);}"
            }
        }
    }
}, {
    $set: {
        count: {$size: "$passing_students"}
    }
}, {
    $project: {
        count: 1,
    }
}, {
    $sort: {
        count: -1
    }
}];

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
}, {
    $sort: {
        already_solved_count: -1
    }
}];
// suggested exercises not already solved
const suggestedExercisesAlreadyAttempted = [{
    $project: {
        account_id: 1,
        study_plan: {
            suggested_exercises: 1
        },
        test: {
            $concatArrays: [{
                $reduce: {
                    input: "$evaluations.solved.exercise",
                    initialValue: [],
                    in: {$concatArrays: ["$$value", "$$this"]}
                }
            }, {
                $reduce: {
                    input: "$evaluations.todo.exercise",
                    initialValue: [],
                    in: {$concatArrays: ["$$value", "$$this"]}
                }
            }, "$exercise_attempts.exercise"]
        }
    }
}, {
    $set: {
        already_solved_count: {
            $size: {
                $filter: {
                    input: '$test',
                    as: 'item',
                    cond: {
                        $in: [
                            '$$item',
                            '$study_plan.suggested_exercises'
                        ]
                    }
                }
            }
        }
    }
}, {
    $project: {
        account_id: 1,
        _id: 0,
        already_solved_count: 1
    }
}, {
    $match: {
        already_solved_count: {
            $gt: 0
        }
    }
}, {
    $sort: {
        already_solved_count: -1
    }
}];


// A student is not presented same exercise more than once. Return the subjects so that we can generate more exercises for that subject

const exercisesPresentedMoreThanOnce = [{
    $project: {
        test: {
            $concatArrays: [
                {
                    $reduce: {
                        input: '$evaluations.solved.exercise',
                        initialValue: [],
                        'in': {
                            $concatArrays: [
                                '$$value',
                                '$$this'
                            ]
                        }
                    }
                },
                {
                    $reduce: {
                        input: '$evaluations.todo',
                        initialValue: [],
                        'in': {
                            $concatArrays: [
                                '$$value',
                                '$$this'
                            ]
                        }
                    }
                },
                '$exercise_attempts.exercise'
            ]
        }
    }
}, {
    $unwind: {
        path: "$test"
    }
}, {
    $group: {
        _id: {
            _id: "$_id",
            test: "$test",
        },
        count: {
            $sum: 1
        }
    }
}, {
    $sort: {
        count: -1
    }
}, {
    $project: {
        _id: "$_id._id",
        test: "$_id.test",
        count: {$subtract: ["$count", 1]}
    }
}, {
    $match: {
        count: {$gt: 0}
    }
}, {
    $group: {
        _id: "$test",
        count: {
            $sum: "$count"
        }
    }
}, {
    $lookup: {
        from: 'exercises',
        localField: '_id',
        foreignField: '_id',
        as: 'exercise'
    }
}, {
    $unwind: {
        path: "$exercise"
    }
}, {
    $project: {
        count: 1,
        difficulty: "$exercise.difficulty",
        subject: "$exercise.subject"
    }
}, {
    $sort: {
        count: -1
    }
}];

// Suggested events don't collide with busy times.

// Locations for events don't collide in timing, busyness of locations based on events

// Student solved exercise statistics by subject and type

