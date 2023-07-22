var distance = require('google-distance-matrix');

export const getBranchDistanceById = async (origin, destination) => {
    // distance.key(process.env.GOOGLE_API_KEY);
    // distance.mode('driving');
    // distance.language('en');
    // distance.units('metric');
    // distance.traffic_model('optimistic');
    // distance.departure_time(Date.now());
    // distance.arrival_time(Date.now());
    // var origins = [origin];
    // var destinations = [destination];
    return {
        branchDistance: {
            distance: {
                text: Math.floor((Math.random()*9) + 1)+' '+'km'
            },
            duration: {
                text: Math.floor((Math.random()*9) + 1)+' '+'mins'
            }
        }
    };
    return new Promise((resolve, reject) => {
        distance.matrix(origins, destinations, function (err, distances) {
            if (err) {
            return console.log(err);
            }
            if(!distances) {
                return console.log('no distances');
            }
            if (distances.status == 'OK') {
                if (distances.rows[0].elements[0].status == 'OK') {
                    resolve({
                        branchDistance: distances.rows[0].elements[0]
                    });
                } else {
                    // console.log(destination + ' is not reachable by land from ' + origin);
                }
            }
          if (err) reject(err);
          
        })
    });
};