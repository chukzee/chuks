
var n = [4, 2, 5, 1, 3, 0];

n.sort(function (a, b) {
    return a < b;
});

console.log(n);

var slots = [{
        total_points: 15,
        total_wins: 5,
        total_draws: 3
    }, {
        total_points: 25,
        total_wins: 4,
        total_draws: 10
    }, {
        total_points: 25,
        total_wins: 10,
        total_draws: 5
    }, {
        total_points: 25,
        total_wins: 10,
        total_draws: 3
    }, {
        total_points: 25,
        total_wins: 10,
        total_draws: 7
    }, {
        total_points: 25,
        total_wins: 10,
        total_draws: 2
    }, {
        total_points: 25,
        total_wins: 4,
        total_draws: 12
    }, {
        total_points: 25,
        total_wins: 5,
        total_draws: 3
    }, {
        total_points: 25,
        total_wins: 5,
        total_draws: 1
    }, {
        total_points: 25,
        total_wins: 5,
        total_draws: 2
    }, {
        total_points: 10,
        total_wins: 5,
        total_draws: 5
    },  {
        total_points: 10,
        total_wins: 5,
        total_draws: 2
    }, {
        total_points: 10,
        total_wins: 5,
        total_draws: 3
    },{
        total_points: 12,
        total_wins: 5,
        total_draws: 1
    },{
        total_points: 12,
        total_wins: 4,
        total_draws: 3
    }];


slots.sort(function (a, b) {
    if (b.total_points === a.total_points && b.total_wins === a.total_wins)
        return b.total_draws - a.total_draws;
    
    if (b.total_points === a.total_points)
        return b.total_wins - a.total_wins;
        
    return b.total_points - a.total_points;
});


console.log(slots);